/**
 * Real Speech Recognition & Audio Activity (VAD) Evaluation Engine
 * Accurately detects whether the user actually spoke into the microphone,
 * transcribes their speech, and scores pronunciation against the target sentence/word.
 */

export interface WordTokenMatch {
  word: string;
  matched: boolean;
  score: number;
}

export interface SpeechEvaluationResult {
  score: number; // 0 - 100
  status: 'no_voice' | 'too_short' | 'incorrect' | 'partial' | 'good' | 'excellent';
  feedback: string;
  transcript: string;
  tokenMatches: WordTokenMatch[];
  matchedWordsCount: number;
  totalWordsCount: number;
  matchRatio: number; // 0 - 1
  hasVoiceActivity: boolean;
  durationMs: number;
  peakVolume: number;
}

// Strip punctuation and normalize text for comparison
export function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Split into clean words array
export function tokenizeWords(text: string): string[] {
  const cleaned = cleanText(text);
  if (!cleaned) return [];
  return cleaned.split(' ').filter(Boolean);
}

// Levenshtein distance between two strings
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

// Word similarity (handles plural/conjugations/slight speech recognition variances)
function isWordSimilar(target: string, heard: string): boolean {
  if (target === heard) return true;
  if (target.length <= 2) return target === heard;
  
  // Common contractions and simplifications
  if (target === "you'll" && (heard === 'you' || heard === 'youll' || heard === 'you will')) return true;
  if (target === "he's" && (heard === 'hes' || heard === 'he is' || heard === 'his')) return true;
  if (target === "she's" && (heard === 'shes' || heard === 'she is')) return true;
  if (target === "it's" && (heard === 'its' || heard === 'it is')) return true;
  if (target === "what's" && (heard === 'whats' || heard === 'what is')) return true;
  if (target === "let's" && (heard === 'lets' || heard === 'let us')) return true;

  const dist = levenshteinDistance(target, heard);
  // Allow 1 edit for 4-5 letter words, 2 edits for 6+ letter words
  if (target.length >= 6 && dist <= 2) return true;
  if (target.length >= 4 && dist <= 1) return true;

  return false;
}

/**
 * Evaluates speech against target text
 */
export function evaluateSpokenText(
  targetText: string,
  recognizedText: string,
  hasVoiceActivity: boolean,
  durationMs: number,
  peakVolume: number
): SpeechEvaluationResult {
  const targetWords = tokenizeWords(targetText);
  const heardWords = tokenizeWords(recognizedText);

  // CASE 1: No voice activity detected at all (silence / user didn't speak)
  if (!hasVoiceActivity || peakVolume < 10) {
    return {
      score: 0,
      status: 'no_voice',
      feedback: '未检测到您的声音输入！请靠近麦克风并大声朗读哦。',
      transcript: '',
      tokenMatches: targetWords.map((w) => ({ word: w, matched: false, score: 0 })),
      matchedWordsCount: 0,
      totalWordsCount: targetWords.length,
      matchRatio: 0,
      hasVoiceActivity: false,
      durationMs,
      peakVolume,
    };
  }

  // CASE 2: Voice detected, but duration is too short (< 400ms) and no speech recognized
  if (durationMs < 400 && heardWords.length === 0) {
    return {
      score: 10,
      status: 'too_short',
      feedback: '录音时间太短了，没有录入完整的句子，请深吸一口气大声朗读！',
      transcript: '',
      tokenMatches: targetWords.map((w) => ({ word: w, matched: false, score: 0 })),
      matchedWordsCount: 0,
      totalWordsCount: targetWords.length,
      matchRatio: 0,
      hasVoiceActivity: true,
      durationMs,
      peakVolume,
    };
  }

  // CASE 3: Voice detected, but speech recognition produced empty string (whisper, mumble, or noise)
  if (heardWords.length === 0) {
    return {
      score: 25,
      status: 'too_short',
      feedback: '检测到了声音，但没有识别出清晰的英语单词，请听标准音后大声重读！',
      transcript: '(声音模糊未识别)',
      tokenMatches: targetWords.map((w) => ({ word: w, matched: false, score: 0 })),
      matchedWordsCount: 0,
      totalWordsCount: targetWords.length,
      matchRatio: 0,
      hasVoiceActivity: true,
      durationMs,
      peakVolume,
    };
  }

  // CASE 4: Words recognized! Match each target word against recognized words
  const usedIndices = new Set<number>();
  let matchedCount = 0;

  const tokenMatches: WordTokenMatch[] = targetWords.map((tWord) => {
    let matched = false;
    for (let i = 0; i < heardWords.length; i++) {
      if (!usedIndices.has(i) && isWordSimilar(tWord, heardWords[i])) {
        matched = true;
        usedIndices.add(i);
        break;
      }
    }
    if (matched) {
      matchedCount++;
      return { word: tWord, matched: true, score: 100 };
    }
    return { word: tWord, matched: false, score: 0 };
  });

  const totalWords = targetWords.length;
  const matchRatio = totalWords > 0 ? matchedCount / totalWords : 0;

  // Check full string similarity as secondary metric
  const cleanTarget = cleanText(targetText);
  const cleanHeard = cleanText(recognizedText);
  const strDist = levenshteinDistance(cleanTarget, cleanHeard);
  const maxLen = Math.max(cleanTarget.length, cleanHeard.length);
  const strSimilarity = maxLen > 0 ? Math.max(0, 1 - strDist / maxLen) : 0;

  // Composite accuracy calculation
  if (matchedCount === 0 && strSimilarity < 0.2) {
    return {
      score: Math.min(30, Math.round(15 + strSimilarity * 20)),
      status: 'incorrect',
      feedback: '识别到的内容与课文句子不一致，请仔细听原音多练习！',
      transcript: recognizedText,
      tokenMatches,
      matchedWordsCount: 0,
      totalWordsCount: totalWords,
      matchRatio: 0,
      hasVoiceActivity: true,
      durationMs,
      peakVolume,
    };
  }

  if (matchRatio < 0.4) {
    const calculatedScore = Math.round(35 + matchRatio * 40);
    return {
      score: calculatedScore,
      status: 'partial',
      feedback: `跟读出了 ${matchedCount} 个单词，注意红色未读准的单词，继续加油！`,
      transcript: recognizedText,
      tokenMatches,
      matchedWordsCount: matchedCount,
      totalWordsCount: totalWords,
      matchRatio,
      hasVoiceActivity: true,
      durationMs,
      peakVolume,
    };
  }

  if (matchRatio < 0.75) {
    const calculatedScore = Math.round(65 + (matchRatio - 0.4) * 50);
    return {
      score: calculatedScore,
      status: 'good',
      feedback: `读得很不错！已正确读出 ${matchedCount}/${totalWords} 个单词，发音越来越棒了！`,
      transcript: recognizedText,
      tokenMatches,
      matchedWordsCount: matchedCount,
      totalWordsCount: totalWords,
      matchRatio,
      hasVoiceActivity: true,
      durationMs,
      peakVolume,
    };
  }

  // 75% or more words matched
  const calculatedScore = Math.min(
    100,
    Math.round(88 + (matchRatio - 0.75) * 48)
  );
  return {
    score: calculatedScore,
    status: 'excellent',
    feedback: '太棒了！发音非常标准流畅，语调自然，给你点赞！⭐⭐⭐',
    transcript: recognizedText,
    tokenMatches,
    matchedWordsCount: matchedCount,
    totalWordsCount: totalWords,
    matchRatio,
    hasVoiceActivity: true,
    durationMs,
    peakVolume,
  };
}

/**
 * Controller to manage microphone audio stream + Web Speech Recognition
 */
export interface RecordingSession {
  stop: () => void;
  cancel: () => void;
}

export function startSpeechRecordingSession(options: {
  targetText: string;
  onVolumeChange?: (volume: number) => void;
  onInterimTranscript?: (transcript: string) => void;
  onStateChange?: (state: 'requesting' | 'recording' | 'processing' | 'done' | 'error') => void;
  onComplete: (result: SpeechEvaluationResult) => void;
  onError: (errorMessage: string) => void;
}): RecordingSession {
  let isCancelled = false;
  let isStopped = false;
  let mediaStream: MediaStream | null = null;
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let animFrameId: number | null = null;
  let recognition: any = null;

  let peakVolume = 0;
  let totalVolumeSum = 0;
  let volumeSampleCount = 0;
  let voiceActivityFrames = 0;
  let recognizedText = '';
  const startTime = Date.now();

  const cleanup = () => {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    if (recognition) {
      try {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.stop();
      } catch {
        // ignore
      }
      recognition = null;
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
    }
    if (audioContext && audioContext.state !== 'closed') {
      try {
        audioContext.close();
      } catch {
        // ignore
      }
      audioContext = null;
    }
  };

  const finishEvaluation = () => {
    if (isStopped || isCancelled) return;
    isStopped = true;
    options.onStateChange?.('processing');

    const durationMs = Date.now() - startTime;
    cleanup();

    // Voice activity detected if peak volume exceeded threshold and had sustained frames
    const hasVoiceActivity = peakVolume >= 12 && voiceActivityFrames >= 3;

    const result = evaluateSpokenText(
      options.targetText,
      recognizedText,
      hasVoiceActivity,
      durationMs,
      peakVolume
    );

    options.onStateChange?.('done');
    options.onComplete(result);
  };

  const init = async () => {
    options.onStateChange?.('requesting');

    // 1. Request microphone stream
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        throw new Error('当前浏览器不支持麦克风录音');
      }

      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (isCancelled) {
        cleanup();
        return;
      }

      options.onStateChange?.('recording');

      // 2. Setup AudioContext Analyser for real-time VAD & Volume Monitoring
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioCtx) {
        audioContext = new AudioCtx();
        const source = audioContext.createMediaStreamSource(mediaStream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.4;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const monitorVolume = () => {
          if (isStopped || isCancelled || !analyser) return;

          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          // Scale to 0 - 100
          const currentVol = Math.min(100, Math.round((avg / 128) * 100));

          if (currentVol > peakVolume) {
            peakVolume = currentVol;
          }
          if (currentVol >= 10) {
            voiceActivityFrames++;
          }
          totalVolumeSum += currentVol;
          volumeSampleCount++;

          options.onVolumeChange?.(currentVol);
          animFrameId = requestAnimationFrame(monitorVolume);
        };

        monitorVolume();
      }

      // 3. Setup Web Speech Recognition
      const win = window as unknown as {
        SpeechRecognition?: any;
        webkitSpeechRecognition?: any;
      };
      const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRec) {
        try {
          recognition = new SpeechRec();
          recognition.lang = 'en-US';
          recognition.interimResults = true;
          recognition.maxAlternatives = 1;
          recognition.continuous = false;

          recognition.onresult = (event: any) => {
            let current = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              current += event.results[i][0].transcript;
            }
            if (current.trim()) {
              recognizedText = current.trim();
              options.onInterimTranscript?.(recognizedText);
            }
          };

          recognition.onerror = (event: any) => {
            console.log('Speech recognition event:', event.error);
            // 'no-speech' indicates silence from user
            if (event.error === 'no-speech') {
              // Not a fatal error, just silence
            }
          };

          recognition.onend = () => {
            // Recognition naturally ended
            if (!isStopped && !isCancelled) {
              finishEvaluation();
            }
          };

          recognition.start();
        } catch (recErr) {
          console.warn('SpeechRecognition start failed, relying on audio VAD:', recErr);
        }
      }

      // Safety maximum recording timeout (e.g. 7 seconds)
      setTimeout(() => {
        if (!isStopped && !isCancelled) {
          finishEvaluation();
        }
      }, 7000);
    } catch (err: any) {
      cleanup();
      if (isCancelled) return;
      options.onStateChange?.('error');

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        options.onError('麦克风权限已被拒绝。请在浏览器地址栏允许使用麦克风后重试！');
      } else if (err.name === 'NotFoundError') {
        options.onError('未找到可用的麦克风设备，请检查设备连接！');
      } else {
        options.onError(err.message || '启动麦克风录音失败，请重试！');
      }
    }
  };

  init();

  return {
    stop: () => {
      finishEvaluation();
    },
    cancel: () => {
      isCancelled = true;
      cleanup();
      options.onStateChange?.('done');
    },
  };
}
