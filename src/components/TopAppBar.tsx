import React from 'react';
import { ActiveTab, StudentProfile } from '../types';
import { Timer, Heart, Star, ArrowLeft, MoreVertical, Sparkles } from 'lucide-react';
import { sound } from '../utils/speech';

interface TopAppBarProps {
  activeTab: ActiveTab;
  currentStudent: StudentProfile;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenProfileSwitch: () => void;
  // Quiz specific props
  quizTimerSeconds?: number;
  quizLives?: number;
  // Cards specific props
  activeCategoryName?: string;
  activeCategoryEnglishName?: string;
  onResetCategory?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeTab,
  currentStudent,
  onNavigateTab,
  onOpenProfileSwitch,
  quizTimerSeconds = 105,
  quizLives = 3,
  activeCategoryName = '动物',
  activeCategoryEnglishName = 'Animals',
  onResetCategory,
}) => {
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <header className="w-full top-0 sticky bg-[#f8f9ff]/95 backdrop-blur-md shadow-[0px_4px_20px_0px_rgba(124,88,0,0.08)] z-40 border-b border-[#e6eeff]">
      <div className="flex items-center justify-between px-4 md:px-8 h-16 w-full max-w-5xl mx-auto">
        {/* LEFT SECTION */}
        {activeTab === 'home' && (
          <button
            onClick={() => {
              sound.playTap();
              onOpenProfileSwitch();
            }}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-[#e6eeff] transition-all group cursor-pointer"
            title="点击切换学生档案 (Switch Student)"
          >
            <div className="relative">
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#ffb800] shadow-sm group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#6fde00] text-white text-[10px] font-bold px-1 rounded-full border border-white">
                {currentStudent.grade.replace('Grade ', 'G')}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs text-[#514532] font-semibold flex items-center gap-1">
                {currentStudent.name}
              </p>
              <p className="text-[10px] text-[#006780]">切换档案</p>
            </div>
          </button>
        )}

        {activeTab === 'sentences' && (
          <button
            onClick={() => {
              sound.playTap();
              onNavigateTab('home');
            }}
            className="flex items-center justify-center p-2 text-[#514532] hover:bg-[#dde9ff] transition-colors rounded-full active:scale-95 cursor-pointer"
            title="返回首页"
          >
            <ArrowLeft className="w-6 h-6 text-[#006780]" />
          </button>
        )}

        {activeTab === 'cards' && (
          <button
            onClick={() => {
              sound.playTap();
              onNavigateTab('home');
            }}
            className="flex items-center justify-center p-2 text-[#514532] hover:bg-[#dde9ff] transition-colors rounded-full active:scale-95 cursor-pointer"
            title="返回首页"
          >
            <ArrowLeft className="w-6 h-6 text-[#7c5800]" />
          </button>
        )}

        {activeTab === 'quiz' && (
          <div className="flex items-center gap-1.5 text-[#7c5800] font-bold bg-[#fff8e6] px-3 py-1.5 rounded-full border border-[#ffd666]">
            <Timer className="w-5 h-5 text-[#ffb800] animate-pulse" />
            <span className="text-lg font-bold font-quicksand tracking-wide">
              {formatTimer(quizTimerSeconds)}
            </span>
          </div>
        )}

        {activeTab === 'badges' && (
          <button
            onClick={() => {
              sound.playTap();
              onNavigateTab('home');
            }}
            className="flex items-center justify-center p-2 text-[#514532] hover:bg-[#dde9ff] transition-colors rounded-full active:scale-95 cursor-pointer"
            title="返回首页"
          >
            <ArrowLeft className="w-6 h-6 text-[#7c5800]" />
          </button>
        )}

        {/* CENTER SECTION: TITLE */}
        {activeTab === 'sentences' ? (
          <div className="text-center flex-1 mx-2">
            <h1 className="text-sm md:text-lg font-bold text-[#006780] leading-tight flex items-center justify-center gap-1.5">
              <span>📖 课本句子研读</span>
              <span className="text-[10px] bg-[#ffb800] text-[#513500] font-bold px-1.5 py-0.5 rounded-full">
                2024新版PEP
              </span>
            </h1>
            <span className="text-[11px] text-[#514532]/80 font-medium">
              每页课文·单字释义备注·点读跟读
            </span>
          </div>
        ) : activeTab === 'cards' ? (
          <div className="text-center flex-1 mx-2">
            <h1 className="text-base md:text-xl font-bold text-[#7c5800] leading-tight">
              学习中：{activeCategoryName}
            </h1>
            <span className="text-xs md:text-sm text-[#514532]/80 font-medium">
              (Learning: {activeCategoryEnglishName})
            </span>
          </div>
        ) : (
          <button
            onClick={() => {
              sound.playTap();
              onNavigateTab('home');
            }}
            className="text-center flex-1 mx-2 text-[#7c5800] hover:opacity-85 transition-opacity cursor-pointer"
          >
            <span className="text-lg md:text-2xl font-bold tracking-tight block">
              单词探险家 <span className="text-sm md:text-base opacity-85 font-normal">(Word Explorer)</span>
            </span>
          </button>
        )}

        {/* RIGHT SECTION */}
        {(activeTab === 'home' || activeTab === 'sentences') && (
          <div className="flex items-center gap-1.5 bg-[#fff8e6] text-[#7c5800] px-3 py-1.5 rounded-full border border-[#ffd666] shadow-sm">
            <Star className="w-5 h-5 text-[#ffb800] fill-[#ffb800]" />
            <span className="font-bold text-sm md:text-base font-quicksand">
              {currentStudent.totalStars}
            </span>
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="flex items-center gap-1">
            {onResetCategory && (
              <button
                onClick={() => {
                  sound.playTap();
                  onResetCategory();
                }}
                className="flex items-center justify-center p-2 text-[#514532] hover:bg-[#dde9ff] transition-colors rounded-full active:scale-95 cursor-pointer"
                title="重新开始本单元"
              >
                <MoreVertical className="w-5 h-5 text-[#514532]" />
              </button>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="flex items-center gap-1 text-[#ba1a1a]">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-6 h-6 transition-all ${
                  heartIndex <= quizLives
                    ? 'fill-[#ba1a1a] text-[#ba1a1a] scale-100'
                    : 'text-[#d5c4ab] fill-none scale-90 opacity-40'
                }`}
              />
            ))}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="flex items-center gap-1.5 bg-[#fff8e6] text-[#7c5800] px-3 py-1.5 rounded-full border border-[#ffd666]">
            <Sparkles className="w-4 h-4 text-[#ffb800]" />
            <span className="text-xs md:text-sm font-bold">成就馆</span>
          </div>
        )}
      </div>
    </header>
  );
};
