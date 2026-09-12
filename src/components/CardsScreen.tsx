import React, { useState, useEffect } from 'react';
import { WordItem, StudentProfile, UnitInfo, SemesterKey } from '../types';
import { Volume2, RefreshCw, CheckCircle, ChevronLeft, ChevronRight, Sparkles, BookOpen, Gauge } from 'lucide-react';
import { sound, speakText, triggerConfetti } from '../utils/speech';
import { getWordChineseExplanation } from '../utils/wordHelper';
import { WordImage } from './WordImage';

interface CardsScreenProps {
  words: WordItem[];
  allUnits: UnitInfo[];
  selectedUnitId?: string;
  selectedSemesterKey: SemesterKey;
  currentStudent: StudentProfile;
  onSelectUnit: (unitId: string) => void;
  onWordMastered: (wordId: string) => void;
  onCompleteSession: () => void;
  onBackToHome: () => void;
  onNavigateToSentences?: (unitId?: string) => void;
}

export const CardsScreen: React.FC<CardsScreenProps> = ({
  words,
  allUnits,
  selectedUnitId,
  selectedSemesterKey,
  currentStudent,
  onSelectUnit,
  onWordMastered,
  onCompleteSession,
  onBackToHome,
  onNavigateToSentences,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [celebratingWord, setCelebratingWord] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.68); // 默认少儿教学清晰慢速

  // Safe fallback if words array is empty
  const activeWords = words.length > 0 ? words : [];
  const currentWord = activeWords[currentIndex] || activeWords[0];
  const progressPercent = activeWords.length > 0
    ? Math.round(((currentIndex + 1) / activeWords.length) * 100)
    : 0;

  // Find active unit info
  const currentUnit = allUnits.find((u) => u.id === (currentWord?.unitId || selectedUnitId)) || allUnits[0];

  // Auto-speak word when moving to a new card
  useEffect(() => {
    if (currentWord) {
      const timer = setTimeout(() => {
        speakText(currentWord.word, 'en-US', speechRate);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentWord, speechRate]);

  const handleSpeakWord = (rateOverride?: number) => {
    sound.playTap();
    if (currentWord) {
      speakText(currentWord.word, 'en-US', rateOverride || speechRate);
    }
  };

  const handleSpeakSentence = (rateOverride?: number) => {
    sound.playTap();
    if (currentWord) {
      speakText(currentWord.exampleSentence, 'en-US', rateOverride || speechRate);
    }
  };

  const handleRemembered = () => {
    if (!currentWord) return;
    sound.playCorrect();
    onWordMastered(currentWord.id);
    setCelebratingWord(true);

    if (currentIndex + 1 >= activeWords.length) {
      triggerConfetti();
      setTimeout(() => {
        setCelebratingWord(false);
        onCompleteSession();
      }, 1000);
    } else {
      setTimeout(() => {
        setCelebratingWord(false);
        setCurrentIndex((prev) => prev + 1);
      }, 400);
    }
  };

  const handleLearnAgain = () => {
    sound.playTap();
    if (currentIndex + 1 < activeWords.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      sound.playTap();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < activeWords.length - 1) {
      sound.playTap();
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!currentWord) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 border-2 border-[#dde9ff] cloud-shadow space-y-4">
          <BookOpen className="w-12 h-12 text-[#ffb800] mx-auto" />
          <h3 className="text-xl font-bold text-[#0d1c2f]">本单元暂无更多单词</h3>
          <p className="text-sm text-[#514532]">请选择其他单元或学期进行学习。</p>
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

  const isMastered = currentStudent.wordsMastered.includes(currentWord.id);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-2 sm:py-3 flex flex-col items-center justify-start pb-44">
      {/* Unit Selector Bar */}
      <div className="w-full mb-2 flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="bg-[#ffb800]/15 text-[#7c5800] font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#ffd666]">
            <BookOpen className="w-3 h-3 text-[#ffb800]" />
            {currentUnit?.chineseTitle || '课本单元'}
          </span>
          {currentUnit?.isNew2024 && (
            <span className="bg-[#ff4757] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              2024新版
            </span>
          )}
          {onNavigateToSentences && (
            <button
              onClick={() => {
                sound.playTap();
                onNavigateToSentences(currentUnit?.id);
              }}
              className="text-[10px] text-[#006780] font-bold bg-[#e6f7fa] hover:bg-[#d0f2f7] px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer border border-[#a3e4d7] transition-colors"
            >
              📖 句子
            </button>
          )}
        </div>

        {/* Unit switch pills */}
        <div className="flex items-center gap-0.5 bg-[#f0f4fc] p-0.5 rounded-xl border border-[#dde9ff] overflow-x-auto max-w-full no-scrollbar shadow-xs">
          {allUnits
            .filter((u) => u.semesterKey === selectedSemesterKey)
            .map((u) => {
              const isActive = u.id === currentUnit?.id;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    sound.playTap();
                    onSelectUnit(u.id);
                    setCurrentIndex(0);
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#006780] text-white shadow-xs'
                      : 'text-[#514532]/80 hover:text-[#006780] hover:bg-white/80'
                  }`}
                >
                  U{u.unitNumber}
                </button>
              );
            })}
        </div>
      </div>

      {/* Progress & Counter Header */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#eff4ff] text-[#006780] font-bold text-xs px-2.5 py-0.5 rounded-full font-quicksand">
            {currentIndex + 1} / {activeWords.length}
          </span>
          <span className="text-xs text-[#514532] font-semibold">
            {currentWord.categoryLabel}
          </span>
        </div>

        {/* Linear progress bar */}
        <div className="w-32 md:w-48 h-2 bg-[#dde9ff] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ffb800] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Integrated Comprehensive Learning Card */}
      <div className="w-full max-w-lg relative group my-2">
        <div
          className={`w-full bg-white border-2 border-[#dde9ff] rounded-2xl md:rounded-3xl p-3.5 md:p-4.5 flex flex-col items-center cloud-shadow transition-all duration-300 ${
            celebratingWord ? 'ring-4 ring-[#6fde00] scale-[1.02]' : ''
          }`}
        >
          {/* Top card bar: Category, POS, and Mastery badge + Speed selector */}
          <div className="w-full flex justify-between items-center pb-2.5 border-b border-[#eff4ff] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#eff4ff] text-[#006780] text-xs font-bold px-3 py-1 rounded-full font-quicksand">
                {currentWord.categoryLabel}
              </span>
              {currentWord.partOfSpeech && (
                <span className="bg-[#fff8e6] text-[#7c5800] text-xs font-bold px-2 py-0.5 rounded-md border border-[#ffd666]">
                  {currentWord.partOfSpeech}
                </span>
              )}
            </div>

            {/* Speech Speed Pill Switcher */}
            <div className="flex items-center bg-[#f0f4ff] p-0.5 rounded-full border border-[#dde9ff] text-[11px] font-bold">
              <button
                onClick={() => setSpeechRate(0.55)}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                  speechRate <= 0.6 ? 'bg-[#ffb800] text-[#6b4c00] shadow-sm' : 'text-[#006780] hover:text-[#0d1c2f]'
                }`}
                title="慢速朗读 (适合跟读模仿)"
              >
                <span>🐢 慢速</span>
              </button>
              <button
                onClick={() => setSpeechRate(0.72)}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                  speechRate > 0.6 ? 'bg-[#006780] text-white shadow-sm' : 'text-[#006780] hover:text-[#0d1c2f]'
                }`}
                title="标准语速 (清晰自然)"
              >
                <span>🐰 标准</span>
              </button>
            </div>
          </div>

          {/* Core Word, Pronunciation & Chinese Meaning Section (Horizontal: Left Image, Right Details) */}
          <div className="w-full py-3 flex flex-row items-center gap-3.5 sm:gap-5 border-b border-[#eff4ff]">
            {/* Left: Image Illustration */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-[#eff4ff] p-1 border-2 border-[#dde9ff] shadow-inner flex items-center justify-center">
              <WordImage
                word={currentWord}
                className="w-full h-full rounded-xl object-contain transition-transform hover:scale-105 duration-300"
              />
            </div>

            {/* Right: Word Details (English, Phonetic, Pinyin, Chinese) */}
            <div className="flex-1 text-left space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-[#0d1c2f] font-quicksand leading-tight">
                  {currentWord.word}
                </h2>

                {/* Audio Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSpeakWord()}
                    className="p-1 rounded-full bg-[#ffb800] text-[#6b4c00] hover:bg-[#ffa000] active:scale-95 transition-all shadow-xs cursor-pointer"
                    title="朗读单词"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSpeakWord(0.55)}
                    className="px-1.5 py-0.5 rounded-full bg-[#fff8e6] text-[#7c5800] hover:bg-[#ffecb3] active:scale-95 transition-all text-[10px] font-bold border border-[#ffd666] flex items-center gap-0.5 cursor-pointer shadow-xs"
                    title="超慢速朗读单词 (0.55x)"
                  >
                    <span>🐢 慢速</span>
                  </button>
                </div>
              </div>

              {/* Phonetics & Phonics */}
              <div className="flex flex-wrap items-center gap-1.5">
                {currentWord.phonetic && (
                  <span className="text-[11px] text-[#006780] font-quicksand font-bold bg-[#eff4ff] px-1.5 py-0.5 rounded border border-[#c3daf9]">
                    {currentWord.phonetic}
                  </span>
                )}
                {currentWord.phonics && (
                  <span className="text-[11px] text-[#7c5800] font-quicksand font-bold bg-[#fff8e6] px-1.5 py-0.5 rounded border border-[#ffd666]">
                    拼读: {currentWord.phonics}
                  </span>
                )}
              </div>

              {/* Chinese translation and Pinyin */}
              <div className="pt-0.5 flex items-baseline gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-[#006780] leading-none">
                  {currentWord.translation}
                </h3>
                {currentWord.pinyin && (
                  <span className="text-xs font-bold text-[#514532]/70 tracking-wider">
                    {currentWord.pinyin}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom combined content: Example sentence & Chinese Explanation */}
          <div className="w-full pt-3 space-y-2.5">
            {/* Example sentence box */}
            <div className="bg-[#fff8e6] border border-[#ffd666] rounded-xl p-3 text-left relative transition-all hover:border-[#ffb800]">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="text-[10px] font-bold text-[#7c5800] tracking-wider bg-[#ffecb3] px-2 py-0.5 rounded inline-block">
                      例句示范
                    </span>
                    <button
                      onClick={() => handleSpeakSentence(0.55)}
                      className="text-[10px] font-bold text-[#7c5800] bg-white px-2 py-0.5 rounded-full border border-[#ffd666] hover:bg-[#fff0c2] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                      title="慢速朗读例句 (0.55x)"
                    >
                      <span>🐢 慢速朗读</span>
                    </button>
                  </div>
                  <p className="text-sm font-bold text-[#7c5800] font-quicksand inline leading-relaxed">
                    {currentWord.exampleSentence}
                  </p>
                </div>
                <button
                  onClick={() => handleSpeakSentence()}
                  className="p-1.5 rounded-full bg-[#ffb800]/40 text-[#6b4c00] hover:bg-[#ffb800] active:scale-95 transition-all shrink-0 cursor-pointer"
                  title="朗读例句"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[#514532]/90 mt-1 pl-0.5 font-medium">
                {currentWord.exampleTranslation}
              </p>
            </div>

            {/* Chinese Explanation box */}
            <div className="bg-[#f8f9ff] border border-[#dde9ff] rounded-xl p-2.5 text-left">
              <span className="text-[10px] font-bold text-[#006780] tracking-wider bg-[#e1edff] px-2 py-0.5 rounded mr-1.5 inline-block mb-1 sm:mb-0">
                词义解析
              </span>
              <p className="text-xs text-[#514532] inline leading-relaxed font-medium">
                {getWordChineseExplanation(currentWord)}
              </p>
            </div>
          </div>
        </div>

        {/* Card Navigation Arrows */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-5 w-10 h-10 rounded-full bg-white border border-[#dde9ff] shadow-md flex items-center justify-center text-[#7c5800] z-20 transition-all ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:scale-110 active:scale-95 cursor-pointer'
          }`}
          title="上一个单词"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === activeWords.length - 1}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-5 w-10 h-10 rounded-full bg-white border border-[#dde9ff] shadow-md flex items-center justify-center text-[#7c5800] z-20 transition-all ${
            currentIndex === activeWords.length - 1
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:scale-110 active:scale-95 cursor-pointer'
          }`}
          title="下一个单词"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Floating Bottom Learning Actions Bar */}
      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4 z-30 flex items-center gap-3">
        <button
          onClick={handleLearnAgain}
          className="flex-1 bg-white text-[#514532] font-bold py-3.5 rounded-2xl button-3d-white flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg border border-[#dde9ff]"
        >
          <RefreshCw className="w-4 h-4 text-[#006780]" />
          <span>再学一次 (Review)</span>
        </button>

        <button
          onClick={handleRemembered}
          className="flex-1 bg-[#6fde00] text-[#1c4200] font-bold py-3.5 rounded-2xl button-3d-green flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg border border-[#a8f15d]"
        >
          <CheckCircle className="w-5 h-5 text-[#1c4200]" />
          <span>记住了 (+10 ⭐️)</span>
        </button>
      </div>
    </div>
  );
};
