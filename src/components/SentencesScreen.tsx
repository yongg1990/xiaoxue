import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SentenceItem, SemesterKey, WordToken } from '../types';
import { PEP_GRADE_3_SENTENCES } from '../data/pepGrade3Sentences';
import { PEP_GRADE_4_SENTENCES } from '../data/pepGrade4Sentences';
import { PEP_GRADE_5_SENTENCES } from '../data/pepGrade5Sentences';
import { PEP_GRADE_6_SENTENCES } from '../data/pepGrade6Sentences';
import {
  startSpeechRecordingSession,
  SpeechEvaluationResult,
  RecordingSession,
} from '../utils/speechEvaluator';

const ALL_PEP_SENTENCES: SentenceItem[] = [
  ...PEP_GRADE_3_SENTENCES,
  ...PEP_GRADE_4_SENTENCES,
  ...PEP_GRADE_5_SENTENCES,
  ...PEP_GRADE_6_SENTENCES,
];
import {
  Volume2,
  BookOpen,
  Search,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Star,
  ChevronRight,
  Headphones,
  Gamepad2,
  Mic,
  ArrowRight,
  Filter,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { sound, speakText, triggerConfetti } from '../utils/speech';

interface SentencesScreenProps {
  initialSemesterKey?: SemesterKey;
  initialUnitId?: string;
  onBackToHome?: () => void;
  onNavigateToWords?: (unitId?: string) => void;
  onAddStars?: (stars: number) => void;
}

type ViewMode = 'reader' | 'reorder' | 'listen';

export const SentencesScreen: React.FC<SentencesScreenProps> = ({
  initialSemesterKey = '3A',
  initialUnitId,
  onBackToHome,
  onNavigateToWords,
  onAddStars,
}) => {
  const [selectedSemesterKey, setSelectedSemesterKey] = useState<SemesterKey>(
    initialSemesterKey || '3A'
  );

  // Unit filter: 'all' or unit id
  const [selectedUnitId, setSelectedUnitId] = useState<string>(() => {
    if (!initialUnitId || initialUnitId === 'all') return 'all';
    const exists = ALL_PEP_SENTENCES.some(
      (s) => s.semesterKey === (initialSemesterKey || '3A') && s.unitId === initialUnitId
    );
    return exists ? initialUnitId : 'all';
  });

  // Keep in sync with prop updates
  useEffect(() => {
    if (initialSemesterKey) {
      setSelectedSemesterKey(initialSemesterKey);
    }
  }, [initialSemesterKey]);

  useEffect(() => {
    if (initialUnitId && initialUnitId !== 'all') {
      const exists = ALL_PEP_SENTENCES.some(
        (s) => s.semesterKey === selectedSemesterKey && s.unitId === initialUnitId
      );
      setSelectedUnitId(exists ? initialUnitId : 'all');
    } else {
      setSelectedUnitId('all');
    }
  }, [initialUnitId, selectedSemesterKey]);

  // Page filter: 'all' or number
  const [selectedPage, setSelectedPage] = useState<string>('all');

  // Search keyword
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active view mode
  const [viewMode, setViewMode] = useState<ViewMode>('reader');

  // Currently focused word for detail popup
  const [activeToken, setActiveToken] = useState<{ sentenceId: string; token: WordToken } | null>(null);

  // Starred sentences stored in local state
  const [starredIds, setStarredIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('pep_starred_sentences');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Reorder Game state
  const [gameSentenceIndex, setGameSentenceIndex] = useState<number>(0);
  const [selectedWordsInGame, setSelectedWordsInGame] = useState<string[]>([]);
  const [gameResult, setGameResult] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Listen Quiz state
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizIsAnswered, setQuizIsAnswered] = useState<boolean>(false);

  // Real microphone speech evaluation state
  const [activeRecordingSentenceId, setActiveRecordingSentenceId] = useState<string | null>(null);
  const [recordingVolume, setRecordingVolume] = useState<number>(0);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'processing'>('idle');
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [evaluationResults, setEvaluationResults] = useState<Record<string, SpeechEvaluationResult>>({});
  const sessionRef = useRef<RecordingSession | null>(null);

  // Toggle star
  const handleToggleStar = (sentenceId: string) => {
    sound.playTap();
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(sentenceId)) {
        next.delete(sentenceId);
      } else {
        next.add(sentenceId);
      }
      try {
        localStorage.setItem('pep_starred_sentences', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Filtered sentences for current semester
  const semesterSentences = useMemo(() => {
    return ALL_PEP_SENTENCES.filter((s) => s.semesterKey === selectedSemesterKey);
  }, [selectedSemesterKey]);

  // Safety fallback: if selectedUnitId is not 'all', but does not exist in current semesterSentences, reset to 'all'
  useEffect(() => {
    if (selectedUnitId !== 'all' && semesterSentences.length > 0) {
      const exists = semesterSentences.some((s) => s.unitId === selectedUnitId);
      if (!exists) {
        setSelectedUnitId('all');
      }
    }
  }, [selectedUnitId, semesterSentences]);

  // Unique units for selector
  const availableUnits = useMemo(() => {
    const map = new Map<string, { id: string; name: string; chineseTitle: string }>();
    semesterSentences.forEach((s) => {
      if (!map.has(s.unitId)) {
        map.set(s.unitId, {
          id: s.unitId,
          name: s.unitName,
          chineseTitle: s.unitChineseTitle,
        });
      }
    });
    return Array.from(map.values());
  }, [semesterSentences]);

  // Available pages for current unit
  const availablePages = useMemo(() => {
    let list = semesterSentences;
    if (selectedUnitId !== 'all') {
      list = list.filter((s) => s.unitId === selectedUnitId);
    }
    const pageSet = new Set<number>();
    list.forEach((s) => pageSet.add(s.pageNumber));
    return Array.from(pageSet).sort((a, b) => a - b);
  }, [semesterSentences, selectedUnitId]);

  // Final filtered sentences list
  const filteredSentences = useMemo(() => {
    return semesterSentences.filter((s) => {
      if (selectedUnitId !== 'all' && s.unitId !== selectedUnitId) return false;
      if (selectedPage !== 'all' && s.pageNumber !== Number(selectedPage)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inEn = s.sentence.toLowerCase().includes(q);
        const inZh = s.chineseTranslation.includes(q);
        const inWords = s.wordsBreakdown.some(
          (w) => w.word.toLowerCase().includes(q) || w.meaning.includes(q)
        );
        return inEn || inZh || inWords;
      }
      return true;
    });
  }, [semesterSentences, selectedUnitId, selectedPage, searchQuery]);

  // Reorder Game Target Sentence
  const gameSentences = filteredSentences.length > 0 ? filteredSentences : semesterSentences;
  const currentReorderSentence = gameSentences[gameSentenceIndex % gameSentences.length];

  // Scrambled words for reorder game
  const scrambledGameWords = useMemo(() => {
    if (!currentReorderSentence) return [];
    // Extract words from breakdown
    const list = currentReorderSentence.wordsBreakdown.map((wb, idx) => ({
      id: `${wb.word}-${idx}`,
      display: wb.display.replace(/[.,!?]/g, ''),
      originalIndex: idx,
    }));
    // Fisher-Yates shuffle with seed
    const shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [currentReorderSentence]);

  // Listen Quiz Target Sentence & Options
  const currentQuizSentence = gameSentences[quizIndex % gameSentences.length];
  const quizOptions = useMemo(() => {
    if (!currentQuizSentence) return [];
    const correct = currentQuizSentence.chineseTranslation;
    const others = semesterSentences
      .filter((s) => s.id !== currentQuizSentence.id && s.chineseTranslation !== correct)
      .map((s) => s.chineseTranslation);
    // pick 2-3 distractors
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 2);
    const combined = [correct, ...shuffledOthers].sort(() => 0.5 - Math.random());
    return combined;
  }, [currentQuizSentence, semesterSentences]);

  // Reset page filter when unit changes
  const handleUnitChange = (unitId: string) => {
    sound.playTap();
    setSelectedUnitId(unitId);
    setSelectedPage('all');
  };

  // Play full sentence
  const handlePlaySentence = (sentence: SentenceItem, rate: number = 0.82) => {
    sound.playTap();
    speakText(sentence.sentence, 'en-US', rate);
  };

  // Play single word token
  const handlePlayToken = (token: WordToken, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playTap();
    speakText(token.word, 'en-US', 0.75);
  };

  // Real microphone follow-me reading handler
  const handleStartRecording = (sentence: SentenceItem) => {
    // If already recording this sentence, stop and trigger immediate evaluation
    if (activeRecordingSentenceId === sentence.id) {
      sound.playTap();
      sessionRef.current?.stop();
      return;
    }

    // If recording another sentence, cancel it first
    if (sessionRef.current) {
      sessionRef.current.cancel();
      sessionRef.current = null;
    }

    sound.playTap();
    setActiveRecordingSentenceId(sentence.id);
    setRecordingVolume(0);
    setInterimTranscript('');
    setRecordingStatus('recording');
    setRecordingError(null);

    const session = startSpeechRecordingSession({
      targetText: sentence.sentence,
      onVolumeChange: (vol) => {
        setRecordingVolume(vol);
      },
      onInterimTranscript: (text) => {
        setInterimTranscript(text);
      },
      onStateChange: (st) => {
        if (st === 'processing') setRecordingStatus('processing');
        if (st === 'done') setRecordingStatus('idle');
      },
      onComplete: (res) => {
        setActiveRecordingSentenceId(null);
        setRecordingStatus('idle');
        setEvaluationResults((prev) => ({
          ...prev,
          [sentence.id]: res,
        }));

        if (res.score >= 90) {
          sound.playCorrect();
          triggerConfetti();
          if (onAddStars) onAddStars(5);
        } else if (res.score >= 60) {
          sound.playTap();
        } else {
          sound.playWrong();
        }
      },
      onError: (err) => {
        setActiveRecordingSentenceId(null);
        setRecordingStatus('idle');
        setRecordingError(err);
        sound.playWrong();
      },
    });

    sessionRef.current = session;
  };

  const handleStopRecording = () => {
    sound.playTap();
    if (sessionRef.current) {
      sessionRef.current.stop();
    }
  };

  const handleCancelRecording = () => {
    sound.playTap();
    if (sessionRef.current) {
      sessionRef.current.cancel();
      sessionRef.current = null;
    }
    setActiveRecordingSentenceId(null);
    setRecordingStatus('idle');
    setInterimTranscript('');
    setRecordingVolume(0);
  };

  // Cancel recording session if component unmounts
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.cancel();
      }
    };
  }, []);

  // Clean active token on page/unit change
  useEffect(() => {
    setActiveToken(null);
  }, [selectedUnitId, selectedPage, selectedSemesterKey]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6 pb-28">
      {/* Top Header / Banner */}
      <div className="bg-gradient-to-r from-[#006780] to-[#0089a8] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-10 opacity-15 text-9xl pointer-events-none select-none">
          📖
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase text-white/95 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#ffb800]" />
              人教版（PEP版，义务教育教科书 / 2024新版）课本同步
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {selectedSemesterKey.startsWith('3')
                ? '三年级'
                : selectedSemesterKey.startsWith('4')
                ? '四年级'
                : selectedSemesterKey.startsWith('5')
                ? '五年级'
                : '六年级'}（人教PEP·2024新版）课本句子研读
            </h1>
            <p className="text-white/90 text-sm md:text-base mt-1 max-w-2xl">
              精选人教版PEP小学英语（义务教育教科书 / 2024新版）核心课文句子，标注完整中文释义，提供
              <span className="text-[#ffd666] font-bold">「单个单词逐词释义拆解」</span>
              与智能点读跟读！
            </p>
          </div>

          {/* Grade & Semester Toggle Pills */}
          <div className="flex flex-wrap bg-black/25 p-1.5 rounded-2xl border border-white/20 gap-1 max-w-xl">
            {(
              [
                { key: '3A', label: '三上 (3A)', badge: '2024新版', activeColor: 'bg-[#ffb800] text-[#513500]' },
                { key: '3B', label: '三下 (3B)', badge: '2024新版', activeColor: 'bg-[#5ed8ff] text-[#003847]' },
                { key: '4A', label: '四上 (4A)', badge: '2024新版', activeColor: 'bg-[#48bb78] text-[#134e29]' },
                { key: '4B', label: '四下 (4B)', badge: '2024新版', activeColor: 'bg-[#38b2ac] text-[#0c4a47]' },
                { key: '5A', label: '五上 (5A)', badge: '2024新版', activeColor: 'bg-[#6ee7b7] text-[#064e3b]' },
                { key: '5B', label: '五下 (5B)', badge: '2024新版', activeColor: 'bg-[#a78bfa] text-[#2e1065]' },
                { key: '6A', label: '六上 (6A)', badge: '2024新版', activeColor: 'bg-[#f6ad55] text-[#744210]' },
                { key: '6B', label: '六下 (6B)', badge: '2024新版', activeColor: 'bg-[#fc8181] text-[#742a2a]' },
              ] as const
            ).map((item) => {
              const isSelected = selectedSemesterKey === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    sound.playTap();
                    setSelectedSemesterKey(item.key as SemesterKey);
                    setSelectedUnitId('all');
                    setSelectedPage('all');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? `${item.activeColor} shadow-md scale-105`
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-black/20 text-white font-normal">
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap gap-2">
          <button
            onClick={() => {
              sound.playTap();
              setViewMode('reader');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              viewMode === 'reader'
                ? 'bg-white text-[#006780] shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 课文逐页研读 & 单词拆解</span>
          </button>
          <button
            onClick={() => {
              sound.playTap();
              setViewMode('reorder');
              setSelectedWordsInGame([]);
              setGameResult('idle');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              viewMode === 'reorder'
                ? 'bg-[#ffb800] text-[#513500] shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>🧩 点词拼句大闯关</span>
          </button>
          <button
            onClick={() => {
              sound.playTap();
              setViewMode('listen');
              setQuizSelectedOption(null);
              setQuizIsAnswered(false);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              viewMode === 'listen'
                ? 'bg-[#6fde00] text-[#224b00] shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>🎯 听音选意对对碰</span>
          </button>
        </div>
      </div>

      {/* Filter Bar: Units & Pages */}
      <div className="bg-white rounded-2xl p-4 border border-[#e6eeff] shadow-sm space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索课本句子、单词或中文（如：friend, elephant, 你好, 苹果）..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006780] text-sm text-gray-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded-md cursor-pointer"
            >
              清空
            </button>
          )}
        </div>

        {/* Unit Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs md:text-sm scrollbar-thin">
          <span className="text-gray-500 font-semibold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> 单元:
          </span>
          <button
            onClick={() => handleUnitChange('all')}
            className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors cursor-pointer ${
              selectedUnitId === 'all'
                ? 'bg-[#006780] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部单元 ({semesterSentences.length}句)
          </button>
          {availableUnits.map((u) => {
            const count = semesterSentences.filter((s) => s.unitId === u.id).length;
            const isSelected = selectedUnitId === u.id;
            return (
              <button
                key={u.id}
                onClick={() => handleUnitChange(u.id)}
                className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#ffb800] text-[#513500] shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {u.chineseTitle} ({count})
              </button>
            );
          })}
        </div>

        {/* Page Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs md:text-sm scrollbar-thin border-t border-gray-100 pt-2">
          <span className="text-gray-500 font-semibold flex items-center gap-1 shrink-0">
            📄 课本页码:
          </span>
          <button
            onClick={() => {
              sound.playTap();
              setSelectedPage('all');
            }}
            className={`px-3 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
              selectedPage === 'all'
                ? 'bg-[#5ed8ff] text-[#004254]'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部页码
          </button>
          {availablePages.map((pageNum) => {
            const isSelected = selectedPage === String(pageNum);
            const count = semesterSentences.filter((s) => {
              if (selectedUnitId !== 'all' && s.unitId !== selectedUnitId) return false;
              return s.pageNumber === pageNum;
            }).length;

            return (
              <button
                key={pageNum}
                onClick={() => {
                  sound.playTap();
                  setSelectedPage(String(pageNum));
                }}
                className={`px-3 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#ff7d54] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                第{pageNum}页 ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: 课文逐页研读 & 单词拆解 (READER) */}
      {/* ========================================================================= */}
      {viewMode === 'reader' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              共找到 <span className="font-bold text-[#006780]">{filteredSentences.length}</span>{' '}
              个课本句子，点击句中任意单词可单独发音并查看详释：
            </p>
            {onNavigateToWords && selectedUnitId !== 'all' && (
              <button
                onClick={() => onNavigateToWords(selectedUnitId)}
                className="text-xs font-bold text-[#006780] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" /> 查看本单元单词卡片
              </button>
            )}
          </div>

          {filteredSentences.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-gray-700">没有找到匹配的句子</h3>
              <p className="text-sm text-gray-500 mt-1">
                尝试切换单元或清空搜索关键词查看更多课本内容。
              </p>
              <button
                onClick={() => {
                  setSelectedUnitId('all');
                  setSelectedPage('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-[#006780] text-white rounded-xl text-sm font-bold cursor-pointer"
              >
                显示全部句子
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredSentences.map((item, index) => {
                const isStarred = starredIds.has(item.id);
                const isRecording = activeRecordingSentenceId === item.id;
                const evalResult = evaluationResults[item.id];

                return (
                  <div
                    key={item.id}
                    id={`sentence-card-${item.id}`}
                    className="bg-white rounded-3xl p-5 md:p-6 border-2 border-[#e6eeff] shadow-[0_4px_20px_rgba(0,103,128,0.05)] hover:border-[#ffd666] transition-all relative"
                  >
                    {/* Sentence Meta Header */}
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-[#006780]/10 text-[#006780] font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                          📄 {item.pageLabel}
                        </span>
                        <span className="bg-[#ffb800]/15 text-[#855900] font-bold text-xs px-2.5 py-1 rounded-full">
                          {item.unitChineseTitle}
                        </span>
                        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-full">
                          {item.section}
                        </span>
                        {item.speaker && (
                          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                            🗣️ {item.speaker}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleStar(item.id)}
                          title={isStarred ? '取消收藏' : '收藏此重点句'}
                          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                            isStarred
                              ? 'text-[#ffb800] bg-amber-50 hover:bg-amber-100'
                              : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Interactive English Sentence (Clickable Word Tokens) */}
                    <div className="my-3">
                      <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                        {item.wordsBreakdown.map((token, wIdx) => {
                          const isHighlighted = token.highlight;
                          const isCurrentActive =
                            activeToken?.sentenceId === item.id &&
                            activeToken.token.word.toLowerCase() === token.word.toLowerCase();

                          return (
                            <button
                              key={`${token.word}-${wIdx}`}
                              onClick={(e) => {
                                handlePlayToken(token, e);
                                setActiveToken({ sentenceId: item.id, token });
                              }}
                              className={`group relative px-2.5 py-1.5 rounded-xl text-lg md:text-xl font-extrabold tracking-wide transition-all cursor-pointer ${
                                isCurrentActive
                                  ? 'bg-[#006780] text-white shadow-md scale-105'
                                  : isHighlighted
                                  ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 hover:scale-105'
                                  : 'bg-gray-50 text-gray-800 hover:bg-gray-100 hover:scale-105'
                              }`}
                            >
                              <span>{token.display}</span>
                              {/* Subtitle mini meaning under the word */}
                              <span
                                className={`block text-[10px] md:text-[11px] font-normal leading-tight mt-0.5 truncate max-w-[80px] ${
                                  isCurrentActive
                                    ? 'text-white/90 font-medium'
                                    : 'text-gray-500 group-hover:text-[#006780]'
                                }`}
                              >
                                {token.meaning}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Token Detail Pill (if clicked) */}
                    {activeToken && activeToken.sentenceId === item.id && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-3 my-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handlePlayToken(activeToken.token)}
                            className="bg-[#006780] text-white p-2 rounded-xl hover:bg-[#005166] transition-transform active:scale-95 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="font-extrabold text-[#006780] text-base">
                                {activeToken.token.word}
                              </span>
                              {activeToken.token.phonetic && (
                                <span className="text-xs text-gray-500 font-mono">
                                  {activeToken.token.phonetic}
                                </span>
                              )}
                              {activeToken.token.partOfSpeech && (
                                <span className="text-[11px] text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded font-semibold">
                                  {activeToken.token.partOfSpeech}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 text-xs font-semibold mt-0.5">
                              中文意思：
                              <span className="text-indigo-900 font-bold">
                                {activeToken.token.meaning}
                              </span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveToken(null)}
                          className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 bg-white rounded-lg border border-gray-200 cursor-pointer"
                        >
                          关闭释义
                        </button>
                      </div>
                    )}

                    {/* Full Chinese Sentence Translation */}
                    <div className="bg-[#fffdf5] border-l-4 border-[#ffb800] rounded-r-xl px-4 py-2.5 my-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                          整句中文翻译
                        </span>
                        <p className="text-base md:text-lg font-bold text-gray-800 mt-0.5">
                          {item.chineseTranslation}
                        </p>
                      </div>
                    </div>

                    {/* Sentence-level Audio & Follow-me Controls */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                      <button
                        onClick={() => handlePlaySentence(item, 0.82)}
                        className="flex items-center gap-1.5 bg-[#006780] text-white px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold hover:bg-[#005266] transition-all active:scale-95 cursor-pointer shadow-sm"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>🔊 标准朗读</span>
                      </button>

                      <button
                        onClick={() => handlePlaySentence(item, 0.65)}
                        className="flex items-center gap-1.5 bg-[#e6f7fa] text-[#006780] border border-[#a3e4d7] px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold hover:bg-[#d0f2f7] transition-all active:scale-95 cursor-pointer"
                      >
                        <span>🐢 慢速跟读</span>
                      </button>

                      <button
                        id={`btn-speech-eval-${item.id}`}
                        onClick={() => handleStartRecording(item)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95 cursor-pointer ${
                          isRecording
                            ? 'bg-[#ba1a1a] text-white ring-2 ring-red-300 shadow-md animate-pulse'
                            : evalResult
                            ? evalResult.score >= 90
                              ? 'bg-[#ebfbee] text-[#2b8a3e] border border-[#a9e34b] hover:bg-[#d3f9d8]'
                              : evalResult.score >= 60
                              ? 'bg-[#e7f5ff] text-[#1971c2] border border-[#a5d8ff] hover:bg-[#d0ebff]'
                              : 'bg-[#fff5f5] text-[#e03131] border border-[#ffc9c9] hover:bg-[#ffe3e3]'
                            : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                        }`}
                      >
                        <Mic className={`w-4 h-4 ${isRecording ? 'animate-bounce text-yellow-300' : ''}`} />
                        <span>
                          {isRecording
                            ? '⏹️ 停止录音并打分'
                            : evalResult
                            ? `🔄 重新跟读 (${evalResult.score}分)`
                            : '🎤 麦克风跟读打分'}
                        </span>
                      </button>

                      {isRecording && (
                        <button
                          onClick={handleCancelRecording}
                          className="px-2.5 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200 cursor-pointer"
                        >
                          取消
                        </button>
                      )}
                    </div>

                    {/* Live Recording Panel with VAD Volume Meter */}
                    {isRecording && (
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 my-2.5 space-y-2.5 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="text-xs md:text-sm font-black text-red-700">
                              {recordingStatus === 'processing'
                                ? '正在智能分析语音与发音准确度...'
                                : '🎙️ 正在录音，请对准麦克风大声朗读课文句子！'}
                            </span>
                          </div>
                          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-red-200 text-red-700">
                            {recordingVolume > 10 ? '🟢 感应到声音' : '⚪ 等待发音中...'}
                          </span>
                        </div>

                        {/* Live Volume Meter Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold text-gray-600">
                            <span>实时麦克风音量感知 (未出声则不会误判打分)：</span>
                            <span className={recordingVolume > 10 ? 'text-green-600 font-black' : 'text-gray-400'}>
                              {recordingVolume}%
                            </span>
                          </div>
                          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-75 rounded-full ${
                                recordingVolume > 40
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                                  : recordingVolume > 10
                                  ? 'bg-gradient-to-r from-yellow-400 to-green-400'
                                  : 'bg-gray-300'
                              }`}
                              style={{ width: `${Math.max(3, recordingVolume)}%` }}
                            />
                          </div>
                        </div>

                        {/* Real-time recognized text preview */}
                        <div className="bg-white/90 border border-red-100 rounded-xl px-3 py-2 text-xs">
                          <span className="text-gray-400 font-medium mr-1.5">已捕捉文字:</span>
                          <span className="font-bold text-[#0d1c2f]">
                            {interimTranscript ? `"${interimTranscript}"` : '（对准麦克风发音，文字将在此实时显示）'}
                          </span>
                        </div>

                        {/* Prompt & Finish button */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <p className="text-[11px] text-red-600 font-medium">
                            💡 读完后点击“读完了，交卷打分”即可查看真实发音评分与单词比对
                          </p>
                          <button
                            onClick={handleStopRecording}
                            className="bg-[#d63031] text-white px-4 py-1.5 rounded-xl text-xs font-black hover:bg-[#b71515] active:scale-95 transition-all shadow cursor-pointer"
                          >
                            ⏹️ 读完了，交卷打分
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Recording Error Alert */}
                    {recordingError && isRecording && (
                      <div className="bg-red-100 border border-red-300 text-red-800 rounded-xl p-3 my-2 text-xs font-bold">
                        {recordingError}
                      </div>
                    )}

                    {/* Speech Evaluation Result Card */}
                    {evalResult && !isRecording && (
                      <div
                        className={`rounded-2xl p-4 my-2.5 border-2 transition-all ${
                          evalResult.score >= 90
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                            : evalResult.score >= 60
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                            : evalResult.score > 0
                            ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300'
                            : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-black/5">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {evalResult.score >= 90
                                ? '🌟'
                                : evalResult.score >= 60
                                ? '👍'
                                : evalResult.score > 0
                                ? '💡'
                                : '❌'}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-base font-black ${
                                    evalResult.score >= 90
                                      ? 'text-green-800'
                                      : evalResult.score >= 60
                                      ? 'text-blue-800'
                                      : evalResult.score > 0
                                      ? 'text-amber-800'
                                      : 'text-red-800'
                                  }`}
                                >
                                  发音实测得分：{evalResult.score} 分
                                </span>
                                <span
                                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                                    evalResult.score >= 90
                                      ? 'bg-green-200 text-green-900'
                                      : evalResult.score >= 60
                                      ? 'bg-blue-200 text-blue-900'
                                      : evalResult.score > 0
                                      ? 'bg-amber-200 text-amber-900'
                                      : 'bg-red-200 text-red-900'
                                  }`}
                                >
                                  {evalResult.status === 'no_voice'
                                    ? '未检测到发音 (0分)'
                                    : evalResult.status === 'too_short'
                                    ? '发音过短/未识别'
                                    : evalResult.status === 'incorrect'
                                    ? '发音不符'
                                    : evalResult.status === 'partial'
                                    ? '部分读准'
                                    : evalResult.status === 'good'
                                    ? '良好流畅'
                                    : '标准优秀'}
                                </span>
                              </div>
                              <p
                                className={`text-xs font-bold mt-0.5 ${
                                  evalResult.score >= 90
                                  ? 'text-green-700'
                                  : evalResult.score >= 60
                                  ? 'text-blue-700'
                                  : evalResult.score > 0
                                  ? 'text-amber-700'
                                  : 'text-red-700'
                                }`}
                              >
                                {evalResult.feedback}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePlaySentence(item, 0.72)}
                              className="text-xs font-bold bg-white text-[#006780] border border-[#006780]/30 hover:bg-[#006780]/5 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>听原音</span>
                            </button>
                            <button
                              onClick={() => handleStartRecording(item)}
                              className="text-xs font-bold bg-[#006780] text-white hover:bg-[#005166] px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>重新跟读</span>
                            </button>
                          </div>
                        </div>

                        {/* Transcript & Word Breakdown comparison */}
                        <div className="space-y-2 text-xs">
                          {evalResult.transcript ? (
                            <div className="flex items-start gap-1.5 bg-white/80 rounded-xl p-2.5 border border-black/5">
                              <span className="font-bold text-gray-500 shrink-0">听到的语音：</span>
                              <span className="font-bold text-gray-800">
                                "{evalResult.transcript}"
                              </span>
                            </div>
                          ) : (
                            <div className="bg-white/80 rounded-xl p-2.5 border border-red-200 text-red-700 font-bold flex items-center gap-1.5">
                              <span>⚠️</span>
                              <span>麦克风没有检测到发音声音，请对准麦克风大声朗读，不要静音哦！</span>
                            </div>
                          )}

                          {/* Word-by-word correctness tags */}
                          {evalResult.tokenMatches.length > 0 && (
                            <div>
                              <span className="text-[11px] font-bold text-gray-500 block mb-1">
                                课文单词逐词匹配检测：
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {evalResult.tokenMatches.map((tm, tmIdx) => (
                                  <span
                                    key={`token-match-${tm.word}-${tmIdx}`}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border shadow-xs ${
                                      tm.matched
                                        ? 'bg-green-100 text-green-900 border-green-300'
                                        : 'bg-red-50 text-red-700 border-red-200'
                                    }`}
                                  >
                                    <span>{tm.matched ? '✓' : '✕'}</span>
                                    <span>{tm.word}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Grammar / Daily Note */}
                    {item.grammarTip && (
                      <div className="mt-3 bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                        <span className="text-base shrink-0">💡</span>
                        <div className="flex-1 font-medium">{item.grammarTip}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: 点词拼句大闯关 (REORDER GAME) */}
      {/* ========================================================================= */}
      {viewMode === 'reorder' && currentReorderSentence && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#e6eeff] shadow-lg space-y-6">
          <div className="flex justify-between items-center">
            <span className="bg-[#ffb800]/20 text-[#7a4c00] text-xs font-bold px-3 py-1 rounded-full">
              第 {gameSentenceIndex + 1} / {gameSentences.length} 题 · 点词拼句
            </span>
            <span className="text-xs text-gray-500 font-medium">
              📄 {currentReorderSentence.pageLabel} · {currentReorderSentence.unitChineseTitle}
            </span>
          </div>

          {/* Target Chinese translation */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 text-center">
            <span className="text-xs font-semibold text-amber-800">目标中文句子：</span>
            <h3 className="text-xl md:text-2xl font-black text-gray-800 mt-1">
              {currentReorderSentence.chineseTranslation}
            </h3>
          </div>

          {/* User Assembled Sentence Area */}
          <div className="min-h-[70px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-4 flex flex-wrap items-center gap-2">
            {selectedWordsInGame.length === 0 ? (
              <span className="text-gray-400 text-sm font-medium">
                👉 请点击下方打乱的英文单词，按正确语序组成完整句子...
              </span>
            ) : (
              selectedWordsInGame.map((word, idx) => (
                <button
                  key={`assembled-${word}-${idx}`}
                  onClick={() => {
                    sound.playTap();
                    setSelectedWordsInGame((prev) => prev.filter((_, i) => i !== idx));
                    setGameResult('idle');
                  }}
                  className="bg-[#006780] text-white px-3 py-1.5 rounded-xl font-bold text-base shadow-sm hover:bg-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                  title="点击移除此词"
                >
                  <span>{word}</span>
                  <span className="text-xs opacity-70">✕</span>
                </button>
              ))
            )}
          </div>

          {/* Word Bubble Options */}
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-2">备选单词列表：</p>
            <div className="flex flex-wrap gap-2.5">
              {scrambledGameWords.map((item, idx) => {
                const isUsed = selectedWordsInGame.filter((w) => w === item.display).length >=
                  scrambledGameWords.filter((w) => w.display === item.display).length;

                return (
                  <button
                    key={`option-${item.id}`}
                    disabled={isUsed}
                    onClick={() => {
                      sound.playTap();
                      speakText(item.display, 'en-US', 0.75);
                      setSelectedWordsInGame((prev) => [...prev, item.display]);
                      setGameResult('idle');
                    }}
                    className={`px-4 py-2.5 rounded-2xl font-extrabold text-base tracking-wide transition-all cursor-pointer ${
                      isUsed
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 opacity-50 cursor-not-allowed'
                        : 'bg-white border-2 border-[#e6eeff] text-gray-800 hover:border-[#006780] hover:bg-blue-50/50 shadow-sm active:scale-95'
                    }`}
                  >
                    {item.display}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action and verification */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                sound.playTap();
                setSelectedWordsInGame([]);
                setGameResult('idle');
              }}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl bg-gray-100 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> 重新排列
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playTap();
                  handlePlaySentence(currentReorderSentence, 0.75);
                }}
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                <Volume2 className="w-4 h-4" /> 听发音提示
              </button>

              <button
                onClick={() => {
                  // Normalize and compare
                  const userStr = selectedWordsInGame.join(' ').toLowerCase();
                  const targetStr = currentReorderSentence.wordsBreakdown
                    .map((w) => w.display.replace(/[.,!?]/g, ''))
                    .join(' ')
                    .toLowerCase();

                  if (userStr === targetStr) {
                    sound.playCorrect();
                    triggerConfetti();
                    setGameResult('correct');
                  } else {
                    sound.playWrong();
                    setGameResult('wrong');
                  }
                }}
                className="bg-[#ffb800] hover:bg-[#ffa700] text-[#513500] font-black px-6 py-2.5 rounded-xl text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                检查答案
              </button>
            </div>
          </div>

          {/* Result Alert */}
          {gameResult === 'correct' && (
            <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-extrabold text-base">回答完全正确！太厉害啦！🎉</h4>
                  <p className="text-xs text-green-700 mt-0.5">
                    标准句子：{currentReorderSentence.sentence}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playTap();
                  setGameSentenceIndex((prev) => (prev + 1) % gameSentences.length);
                  setSelectedWordsInGame([]);
                  setGameResult('idle');
                }}
                className="bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer hover:bg-green-700"
              >
                下一题 <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {gameResult === 'wrong' && (
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-center justify-between text-red-800">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-bold">词序还不太对哦，再试一次或听听发音提示吧！</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: 听音选义对对碰 (LISTEN & CHOOSE TRANSLATION) */}
      {/* ========================================================================= */}
      {viewMode === 'listen' && currentQuizSentence && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#e6eeff] shadow-lg space-y-6">
          <div className="flex justify-between items-center">
            <span className="bg-[#6fde00]/20 text-[#255200] text-xs font-bold px-3 py-1 rounded-full">
              第 {quizIndex + 1} / {gameSentences.length} 题 · 听音辨意
            </span>
            <span className="text-xs text-gray-500 font-medium">
              📄 {currentQuizSentence.pageLabel} · {currentQuizSentence.unitChineseTitle}
            </span>
          </div>

          {/* Big Audio Play Button */}
          <div className="bg-gradient-to-br from-[#006780] to-[#0089a8] rounded-3xl p-8 text-center text-white space-y-4">
            <p className="text-xs md:text-sm text-white/80 font-medium">
              点击下方扬声器仔细倾听课文朗读，选择正确的中文句意：
            </p>
            <div className="flex justify-center items-center gap-3">
              <button
                onClick={() => {
                  sound.playTap();
                  speakText(currentQuizSentence.sentence, 'en-US', 0.82);
                }}
                className="w-16 h-16 rounded-full bg-white text-[#006780] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <Volume2 className="w-8 h-8" />
              </button>
              <button
                onClick={() => {
                  sound.playTap();
                  speakText(currentQuizSentence.sentence, 'en-US', 0.65);
                }}
                className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all cursor-pointer"
                title="慢速朗读"
              >
                <span className="text-xs font-bold">慢速🐢</span>
              </button>
            </div>
            {quizIsAnswered && (
              <p className="text-lg md:text-xl font-black text-[#ffd666] tracking-wide pt-2">
                {currentQuizSentence.sentence}
              </p>
            )}
          </div>

          {/* Chinese Meaning Options */}
          <div className="space-y-3">
            {quizOptions.map((option, idx) => {
              const isSelected = quizSelectedOption === option;
              const isCorrect = option === currentQuizSentence.chineseTranslation;

              let btnStyle = 'bg-gray-50 border-2 border-gray-200 hover:border-[#006780] text-gray-800';
              if (quizIsAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-green-50 border-2 border-green-500 text-green-900 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-red-50 border-2 border-red-400 text-red-800';
                }
              }

              return (
                <button
                  key={`quiz-opt-${idx}`}
                  disabled={quizIsAnswered}
                  onClick={() => {
                    setQuizSelectedOption(option);
                    setQuizIsAnswered(true);
                    if (isCorrect) {
                      sound.playCorrect();
                      triggerConfetti();
                    } else {
                      sound.playWrong();
                    }
                  }}
                  className={`w-full p-4 rounded-2xl text-left text-sm md:text-base transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span className="font-semibold">{option}</span>
                  {quizIsAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  )}
                  {quizIsAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {quizIsAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  sound.playTap();
                  setQuizIndex((prev) => (prev + 1) % gameSentences.length);
                  setQuizSelectedOption(null);
                  setQuizIsAnswered(false);
                }}
                className="bg-[#006780] text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-1.5 shadow hover:bg-[#005166] cursor-pointer"
              >
                下一句 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
