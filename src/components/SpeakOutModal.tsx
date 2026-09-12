import React, { useState, useRef, useEffect } from 'react';
import { WordItem } from '../types';
import { Volume2, Mic, X, Sparkles, CheckCircle2, ChevronRight, RotateCcw, AlertCircle } from 'lucide-react';
import { sound, speakText, triggerConfetti } from '../utils/speech';
import { WordImage } from './WordImage';
import {
  startSpeechRecordingSession,
  SpeechEvaluationResult,
  RecordingSession,
} from '../utils/speechEvaluator';

interface SpeakOutModalProps {
  words: WordItem[];
  onClose: () => void;
  onAddStars: (stars: number) => void;
}

export const SpeakOutModal: React.FC<SpeakOutModalProps> = ({ words, onClose, onAddStars }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0);
  const [interimText, setInterimText] = useState('');
  const [evalResult, setEvalResult] = useState<SpeechEvaluationResult | null>(null);
  const sessionRef = useRef<RecordingSession | null>(null);

  const currentWord = words[currentIndex] || words[0];

  const handlePlayModelVoice = (rate = 0.68) => {
    sound.playTap();
    speakText(currentWord.word, 'en-US', rate);
  };

  const handleStartSpeaking = () => {
    sound.playTap();
    if (sessionRef.current) {
      sessionRef.current.cancel();
      sessionRef.current = null;
    }

    setIsRecording(true);
    setEvalResult(null);
    setVolume(0);
    setInterimText('');

    const session = startSpeechRecordingSession({
      targetText: currentWord.word,
      onVolumeChange: (vol) => {
        setVolume(vol);
      },
      onInterimTranscript: (text) => {
        setInterimText(text);
      },
      onComplete: (result) => {
        setIsRecording(false);
        setEvalResult(result);
        if (result.score >= 85) {
          sound.playCorrect();
          triggerConfetti();
          onAddStars(5);
        } else if (result.score >= 50) {
          sound.playTap();
        } else {
          sound.playWrong();
        }
      },
      onError: () => {
        setIsRecording(false);
        sound.playWrong();
        setEvalResult({
          score: 0,
          maxScore: 100,
          transcript: '',
          feedback: '麦克风权限未开启或录音失败，请确认允许麦克风权限后重试。',
          status: 'no_voice',
          tokenMatches: [],
        });
      },
    });

    sessionRef.current = session;
  };

  const handleStopSpeaking = () => {
    sound.playTap();
    if (sessionRef.current) {
      sessionRef.current.stop();
    }
  };

  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.cancel();
      }
    };
  }, []);

  const handleNextWord = () => {
    sound.playTap();
    if (sessionRef.current) {
      sessionRef.current.cancel();
      sessionRef.current = null;
    }
    if (currentIndex + 1 < words.length) {
      setCurrentIndex((prev) => prev + 1);
      setEvalResult(null);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg text-center shadow-2xl border-2 border-[#dde9ff] relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 bg-[#ffdad6] text-[#93000a] font-bold text-xs px-3 py-1 rounded-full mb-3">
          <Mic className="w-3.5 h-3.5" />
          <span>开口说 (Speak Out 练习)</span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-[#0d1c2f] mb-1">
          跟读单词：{currentWord.word}
        </h3>
        <p className="text-xs md:text-sm text-[#514532]/80 mb-4">
          大声读出单词，锻炼口语发音！
        </p>

        {/* Word Image Avatar */}
        <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-[#dde9ff] mb-4 bg-[#eff4ff] flex items-center justify-center">
          <WordImage
            word={currentWord}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Model Voice Buttons */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => handlePlayModelVoice(0.70)}
            className="inline-flex items-center gap-1.5 bg-[#e6eeff] text-[#006780] font-bold px-4 py-2 rounded-full text-xs md:text-sm button-3d-white cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>示范发音</span>
          </button>
          <button
            onClick={() => handlePlayModelVoice(0.55)}
            className="inline-flex items-center gap-1 bg-[#fff8e6] text-[#7c5800] font-bold px-3 py-2 rounded-full text-xs md:text-sm button-3d-yellow border border-[#ffd666] cursor-pointer"
            title="超慢速示范"
          >
            <span>🐢 慢速示范</span>
          </button>
        </div>

        {/* Recording / Voice Trigger */}
        <div className="flex flex-col items-center justify-center mb-4">
          <button
            onClick={isRecording ? handleStopSpeaking : handleStartSpeaking}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isRecording
                ? 'bg-[#ba1a1a] text-white ring-4 ring-red-300 scale-105 shadow-lg animate-pulse'
                : 'bg-[#ffb800] text-[#6b4c00] button-3d-yellow scale-100 shadow-md hover:scale-105'
            }`}
          >
            <Mic className={`w-9 h-9 ${isRecording ? 'animate-bounce' : ''}`} />
          </button>

          <p className="text-xs md:text-sm font-bold text-[#514532] mt-3">
            {isRecording ? '🎙️ 正在倾听中... 读完后点击麦克风停止' : '点击麦克风大声跟读单词'}
          </p>

          {/* Volume Meter during Recording */}
          {isRecording && (
            <div className="w-full max-w-xs mt-3 px-4 py-2 bg-red-50 rounded-xl border border-red-200 text-center">
              <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1">
                <span>麦克风音量感知:</span>
                <span className={volume > 10 ? 'text-green-600 font-bold' : 'text-gray-400'}>
                  {volume > 10 ? `🟢 ${volume}% (已检测到声音)` : '⚪ 等待发音...'}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-green-500 transition-all duration-75"
                  style={{ width: `${Math.max(4, volume)}%` }}
                />
              </div>
              {interimText && (
                <p className="text-xs font-bold text-gray-800 mt-2">
                  听到了: "{interimText}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Evaluation Feedback */}
        {evalResult && (
          <div
            className={`border-2 rounded-2xl p-4 mb-4 text-center animate-fade-in ${
              evalResult.score >= 85
                ? 'bg-[#f3fee6] border-[#b4f26b]'
                : evalResult.score >= 50
                ? 'bg-[#fff8e6] border-[#ffd666]'
                : 'bg-[#fff0f0] border-[#ffc9c9]'
            }`}
          >
            <div className="flex justify-center items-center gap-1 mb-1">
              <Sparkles
                className={`w-5 h-5 ${
                  evalResult.score >= 85
                    ? 'text-[#ffb800] fill-[#ffb800]'
                    : evalResult.score >= 50
                    ? 'text-[#f59f00]'
                    : 'text-[#e03131]'
                }`}
              />
              <span
                className={`text-2xl font-black font-quicksand ${
                  evalResult.score >= 85
                    ? 'text-[#326b00]'
                    : evalResult.score >= 50
                    ? 'text-[#d97706]'
                    : 'text-[#c92a2a]'
                }`}
              >
                {evalResult.score} 分
              </span>
            </div>

            <p
              className={`text-sm font-bold flex items-center justify-center gap-1 ${
                evalResult.score >= 85
                  ? 'text-[#2b5d00]'
                  : evalResult.score >= 50
                  ? 'text-[#92400e]'
                  : 'text-[#b91c1c]'
              }`}
            >
              {evalResult.score >= 85 ? (
                <CheckCircle2 className="w-4 h-4 text-[#2b5d00]" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {evalResult.feedback}
            </p>

            {evalResult.transcript && (
              <p className="text-xs text-gray-600 mt-1.5 font-medium">
                麦克风识别到的发音: <span className="font-bold">"{evalResult.transcript}"</span>
              </p>
            )}
          </div>
        )}

        {/* Next Word Action */}
        <div className="flex gap-3">
          {evalResult && (
            <button
              onClick={handleStartSpeaking}
              className="flex-1 bg-[#e6eeff] text-[#0d1c2f] font-bold py-3 rounded-full button-3d-white flex items-center justify-center gap-1.5 cursor-pointer text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>再读一次</span>
            </button>
          )}

          <button
            onClick={handleNextWord}
            className="flex-1 bg-[#ffb800] text-[#6b4c00] font-bold py-3 rounded-full button-3d-yellow flex items-center justify-center gap-1.5 cursor-pointer text-sm md:text-base"
          >
            <span>{currentIndex + 1 < words.length ? '下一个单词' : '完成练习'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
