import React, { useState, useEffect, useRef } from 'react';
import { WordItem, StudentProfile, QuizQuestion, UnitInfo } from '../types';
import {
  Volume2,
  CheckCheck,
  Sparkles,
  RotateCcw,
  Trophy,
  Heart,
  HeartCrack,
  BookOpen,
  AlertCircle,
  Timer,
  Home,
  HelpCircle,
} from 'lucide-react';
import { sound, speakText, triggerConfetti } from '../utils/speech';
import { WordImage } from './WordImage';

interface QuizScreenProps {
  words: WordItem[];
  allUnits: UnitInfo[];
  selectedUnitId?: string;
  currentStudent: StudentProfile;
  onFinishQuiz: (score: number, starsEarned: number) => void;
  onBackToHome: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  words,
  allUnits,
  selectedUnitId,
  currentStudent,
  onFinishQuiz,
  onBackToHome,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isFinished, setIsFinished] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [shakeCard, setShakeCard] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset hint when switching questions
  useEffect(() => {
    setShowHint(false);
  }, [currentIndex]);

  // Generate interactive quiz questions from available words
  useEffect(() => {
    generateQuestions();
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, [words]);

  const generateQuestions = () => {
    if (words.length < 2) return;
    const pool = [...words];

    // Shuffled pool
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const questionCount = Math.min(8, shuffledPool.length);
    const generated: QuizQuestion[] = [];

    for (let i = 0; i < questionCount; i++) {
      const target = shuffledPool[i];
      const others = pool.filter((w) => w.id !== target.id);
      const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [target, ...shuffledOthers].sort(() => 0.5 - Math.random());

      generated.push({
        id: `q-${i}`,
        targetWord: target,
        options,
        correctOptionId: target.id,
      });
    }

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerChecked(false);
    setScore(0);
    setLives(3);
    setIsFinished(false);
    setShowFailedModal(false);
    setElapsedSeconds(0);
  };

  const handleRestartQuiz = () => {
    sound.playTap();
    generateQuestions();
  };

  const currentQ = questions[currentIndex];

  const handleFinish = (finalScore: number) => {
    setIsFinished((alreadyFinished) => {
      if (!alreadyFinished) {
        const starsEarned = Math.max(10, Math.floor(finalScore / 2));
        setTimeout(() => {
          onFinishQuiz(finalScore, starsEarned);
        }, 0);
        triggerConfetti();
      }
      return true;
    });
  };

  // Timer counter: increments every second when active
  useEffect(() => {
    if (isFinished || showFailedModal || questions.length === 0) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, showFailedModal, questions.length]);

  // Format seconds to MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePlayWordVoice = () => {
    if (currentQ) {
      sound.playTap();
      speakText(currentQ.targetWord.word);
    }
  };

  const handleSelectOption = (option: WordItem) => {
    if (isAnswerChecked || isFinished || showFailedModal) return;

    setSelectedOptionId(option.id);
    setIsAnswerChecked(true);

    const isCorrect = option.id === currentQ.correctOptionId;

    if (isCorrect) {
      sound.playCorrect();
      setScore((prev) => prev + 15);
      triggerConfetti();

      // 答对自动跳到下一个
      autoAdvanceTimerRef.current = setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOptionId(null);
          setIsAnswerChecked(false);
        } else {
          handleFinish(score + 15);
        }
      }, 650);
    } else {
      sound.playWrong();
      setShakeCard(option.id);
      const remainingLives = lives - 1;
      setLives(remainingLives);

      if (remainingLives <= 0) {
        // 三个爱心变灰，弹框提示
        setTimeout(() => {
          setShowFailedModal(true);
        }, 500);
      } else {
        // 允许继续尝试或稍后重置选中
        setTimeout(() => {
          setShakeCard(null);
          setIsAnswerChecked(false);
          setSelectedOptionId(null);
        }, 700);
      }
    }
  };

  if (questions.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-white rounded-3xl p-8 border-2 border-[#dde9ff] cloud-shadow space-y-4">
          <BookOpen className="w-12 h-12 text-[#ffb800] mx-auto" />
          <h3 className="text-xl font-bold text-[#0d1c2f]">正在准备测试题库</h3>
          <p className="text-sm text-[#514532]">请选择包含足够词汇的单元或学期进行测试。</p>
          <button
            onClick={onBackToHome}
            className="bg-[#ffb800] text-[#6b4c00] font-bold px-6 py-2.5 rounded-full button-3d-yellow"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  // Finished Screen (闯关完成)
  if (isFinished) {
    const starsEarned = Math.max(10, Math.floor(score / 2));
    return (
      <div className="w-full max-w-md mx-auto px-4 py-12 flex flex-col items-center text-center space-y-6 pb-28">
        <div className="bg-white border-2 border-[#dde9ff] rounded-3xl p-8 w-full cloud-shadow">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-[#ffb800]/20 flex items-center justify-center mb-4 border-2 border-[#ffb800]">
            <Trophy className="w-12 h-12 text-[#ffb800]" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#0d1c2f] mb-1">
            {score >= 60 ? '闯关大成功！🎉' : '继续加油哦！💪'}
          </h2>
          <p className="text-xs md:text-sm text-[#514532] mb-6">
            人教PEP 单元测试挑战已完成！
          </p>

          <div className="grid grid-cols-3 gap-2.5 mb-6">
            <div className="bg-[#fff8e6] border border-[#ffd666] p-3 rounded-2xl">
              <p className="text-[11px] text-[#7c5800] font-semibold">最终得分</p>
              <p className="text-xl font-bold text-[#6b4c00] font-quicksand">{score} 分</p>
            </div>
            <div className="bg-[#f0f9ff] border border-[#bae6fd] p-3 rounded-2xl">
              <p className="text-[11px] text-[#0369a1] font-semibold">练习用时</p>
              <p className="text-xl font-bold text-[#0369a1] font-quicksand">{formatTime(elapsedSeconds)}</p>
            </div>
            <div className="bg-[#f3fee6] border border-[#b4f26b] p-3 rounded-2xl">
              <p className="text-[11px] text-[#2b5d00] font-semibold">获得星星</p>
              <p className="text-xl font-bold text-[#2b5d00] font-quicksand">+{starsEarned} ⭐️</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRestartQuiz}
              className="w-full bg-[#ffb800] text-[#6b4c00] font-bold py-3.5 rounded-full button-3d-yellow flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
            >
              <RotateCcw className="w-4 h-4" />
              <span>再挑战一次</span>
            </button>
            <button
              onClick={onBackToHome}
              className="w-full bg-[#e6eeff] text-[#006780] font-bold py-3 rounded-full button-3d-white text-sm cursor-pointer"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-4 space-y-4 pb-28 relative">
      {/* Top Status Bar: Left Timer | Center Progress | Right Lives */}
      <div className="flex justify-between items-center bg-white border border-[#dde9ff] rounded-2xl p-3 px-4 cloud-shadow">
        {/* Left: Timer */}
        <div className="flex items-center gap-1.5 bg-[#f0f9ff] text-[#0284c7] font-bold font-quicksand px-3 py-1 rounded-full border border-[#bae6fd] text-xs md:text-sm">
          <Timer className="w-4 h-4 text-[#0284c7] animate-pulse" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>

        {/* Center: Question Counter */}
        <div className="text-xs md:text-sm font-bold text-[#006780] font-quicksand bg-[#eff4ff] px-3.5 py-1 rounded-full">
          第 {currentIndex + 1} / {questions.length} 题
        </div>

        {/* Right: Hearts / Lives */}
        <div className="flex items-center gap-1.5" title="剩余爱心">
          {[1, 2, 3].map((heartIndex) => (
            <Heart
              key={heartIndex}
              className={`w-6 h-6 transition-all duration-300 ${
                heartIndex <= lives
                  ? 'fill-[#ff4d4f] text-[#ff4d4f] scale-100 drop-shadow-sm'
                  : 'fill-gray-200 text-gray-300 scale-90 opacity-60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Target Word Prompt Card */}
      <div className="bg-white border-2 border-[#dde9ff] rounded-2xl py-3 px-4 md:py-3.5 md:px-6 text-center cloud-shadow relative">
        <span className="inline-flex items-center gap-1 bg-[#ffb800]/15 text-[#7c5800] text-[11px] md:text-xs font-bold px-2.5 py-0.5 rounded-full mb-1">
          <Sparkles className="w-3 h-3 text-[#ffb800]" />
          看英文单词，选择正确的中文释义与图片
        </span>

        {/* Word + Inline Audio Button */}
        <div className="flex items-center justify-center gap-2.5 my-1">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0d1c2f] font-quicksand tracking-wide leading-tight">
            {currentQ.targetWord.word}
          </h2>
          <button
            onClick={handlePlayWordVoice}
            className="inline-flex items-center gap-1 bg-[#eff4ff] hover:bg-[#dde9ff] text-[#0284c7] px-2.5 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            title="播放单词发音"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>发音</span>
          </button>
        </div>

        {/* Phonetic & Category Hint (Hidden by default, click to reveal) */}
        <div className="min-h-[28px] flex items-center justify-center">
          {!showHint ? (
            <button
              onClick={() => {
                sound.playTap();
                setShowHint(true);
              }}
              className="inline-flex items-center gap-1.5 text-[11px] text-[#006780] hover:text-[#0284c7] font-bold bg-[#eff4ff] hover:bg-[#dde9ff] px-3 py-1 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#cbe0ff] shadow-xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>点击查看提示词</span>
            </button>
          ) : (
            <div
              onClick={() => setShowHint(false)}
              title="点击收起提示"
              className="text-xs text-[#006780] font-semibold flex items-center justify-center gap-2 cursor-pointer hover:opacity-85 transition-opacity"
            >
              {currentQ.targetWord.phonetic && (
                <span className="text-[#0284c7] font-normal font-quicksand bg-[#f0f9ff] px-2 py-0.5 rounded border border-[#bae6fd]">
                  {currentQ.targetWord.phonetic}
                </span>
              )}
              {currentQ.targetWord.phonetic && <span className="text-gray-300">·</span>}
              <span className="bg-[#fff8e6] text-[#7c5800] px-2 py-0.5 rounded border border-[#ffd666]">
                提示: {currentQ.targetWord.categoryLabel}
              </span>
              <span className="text-[10px] text-gray-400 font-normal hover:underline">(收起)</span>
            </div>
          )}
        </div>
      </div>

      {/* 4 Options: 2 per row (一行放2个) */}
      <div className="grid grid-cols-2 gap-2.5">
        {currentQ.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === currentQ.correctOptionId;
          const isWrong = isSelected && !isCorrect;
          const optionLabel = ['A', 'B', 'C', 'D'][index] || '';

          let cardStyle =
            'bg-white border-2 border-[#dde9ff] hover:border-[#ffb800] hover:shadow-sm';

          if (isAnswerChecked) {
            if (isCorrect) {
              cardStyle = 'bg-[#f3fee6] border-2 border-[#6fde00] shadow-sm';
            } else if (isWrong) {
              cardStyle = 'bg-[#ffdad6] border-2 border-[#ba1a1a] opacity-90';
            } else {
              cardStyle = 'bg-white/60 border border-[#dde9ff] opacity-60';
            }
          }

          return (
            <div
              key={option.id}
              onClick={() => handleSelectOption(option)}
              className={`rounded-2xl p-2.5 md:p-3 flex items-center justify-between transition-all cursor-pointer cloud-shadow group ${cardStyle} ${
                shakeCard === option.id ? 'animate-bounce' : ''
              }`}
            >
              {/* Left: Option Letter + Thumbnail + Text */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 rounded-xl bg-[#eff4ff] text-[#006780] font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:bg-[#ffb800] group-hover:text-[#0d1c2f] transition-colors">
                  {optionLabel}
                </span>

                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-[#eff4ff] p-0.5 flex-shrink-0 flex items-center justify-center">
                  <WordImage
                    word={option}
                    className="w-full h-full rounded-lg object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Chinese Word Text & Pinyin */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-base md:text-xl font-bold text-[#0d1c2f] tracking-wide">
                    {option.translation}
                  </span>
                  {option.pinyin && (
                    <span className="text-xs text-[#7c5800] font-medium bg-[#fff8e6] px-2 py-0.5 rounded-md border border-[#ffd666]">
                      {option.pinyin}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Status / Result */}
              <div className="flex-shrink-0 pl-2">
                {isAnswerChecked && isCorrect && (
                  <span className="text-xs font-bold text-[#2b5d00] flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-xs animate-fade-in border border-[#6fde00]">
                    <CheckCheck className="w-4 h-4 text-[#2b5d00]" />
                    <span className="hidden sm:inline">正确！</span>
                  </span>
                )}
                {isAnswerChecked && isWrong && (
                  <span className="text-xs font-bold text-[#ba1a1a] flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-xs border border-[#ba1a1a]">
                    <AlertCircle className="w-4 h-4 text-[#ba1a1a]" />
                    <span className="hidden sm:inline">选错了 (爱心-1)</span>
                  </span>
                )}
                {!isAnswerChecked && (
                  <div className="w-5 h-5 rounded-full border-2 border-[#dde9ff] group-hover:border-[#ffb800] transition-colors" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3 Hearts Depleted Modal (三个爱心变灰弹框) */}
      {showFailedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border-2 border-[#dde9ff] shadow-2xl space-y-4 animate-scale-up">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#ffe5e5] border-2 border-[#ff4d4f]/30 flex items-center justify-center">
              <HeartCrack className="w-10 h-10 text-[#ff4d4f]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-[#0d1c2f]">爱心已用完 💔</h3>
              <p className="text-sm text-[#514532]">
                本次练习已用时 <span className="font-bold text-[#0284c7] font-quicksand">{formatTime(elapsedSeconds)}</span>。是否重新开始本单元挑战？
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onBackToHome}
                className="flex-1 bg-[#eff4ff] hover:bg-[#dde9ff] text-[#006780] font-bold py-3 rounded-full button-3d-white text-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Home className="w-4 h-4" />
                <span>取消</span>
              </button>
              <button
                onClick={handleRestartQuiz}
                className="flex-1 bg-[#ffb800] hover:bg-[#ffb800]/90 text-[#6b4c00] font-bold py-3 rounded-full button-3d-yellow text-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>确定</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

