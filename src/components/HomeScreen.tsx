import React from 'react';
import {
  StudentProfile,
  GradeLevel,
  SemesterType,
  SemesterKey,
  CategoryInfo,
  UnitInfo,
  WordItem,
} from '../types';
import { ChevronRight, Users, Sparkles, HelpCircle } from 'lucide-react';
import { sound, triggerConfetti } from '../utils/speech';
import { GradeSemesterSelector } from './GradeSemesterSelector';
import { PEP_SEMESTERS } from '../data/pepCurriculum';

interface HomeScreenProps {
  currentStudent: StudentProfile;
  selectedGrade: GradeLevel;
  selectedSemester: SemesterType;
  selectedSemesterKey: SemesterKey;
  units: UnitInfo[];
  allWords: WordItem[];
  categories: CategoryInfo[];
  selectedCategoryId: string;
  selectedUnitId?: string;
  onSelectGrade: (grade: GradeLevel) => void;
  onSelectSemester: (semester: SemesterType) => void;
  onSelectSemesterKey: (key: SemesterKey) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectUnit: (unitId: string) => void;
  onOpenProfileSwitch: () => void;
  onStartCards: (unitId?: string, categoryId?: string) => void;
  onStartQuiz: (unitId?: string) => void;
  onOpenSpeakOut: () => void;
  onOpenBadges: () => void;
  onOpenHomework?: () => void;
  onResetTodayProgress?: () => void;
  onOpenSentences?: (semesterKey?: SemesterKey, unitId?: string) => void;
  onOpenExam?: (grade?: GradeLevel) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentStudent,
  selectedGrade,
  selectedSemester,
  selectedSemesterKey,
  units,
  allWords,
  categories,
  selectedCategoryId,
  selectedUnitId,
  onSelectGrade,
  onSelectSemester,
  onSelectSemesterKey,
  onSelectCategory,
  onSelectUnit,
  onOpenProfileSwitch,
  onStartCards,
  onStartQuiz,
  onOpenSpeakOut,
  onOpenBadges,
  onOpenHomework,
  onResetTodayProgress,
  onOpenSentences,
  onOpenExam,
}) => {
  const currentSemesterMeta =
    PEP_SEMESTERS.find((s) => s.key === selectedSemesterKey) || PEP_SEMESTERS[0];

  // Current semester words
  const semesterWords = allWords.filter((w) => w.semesterKey === selectedSemesterKey);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6 pb-28">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d1c2f]">
              Hi, {currentStudent.name}! 👋
            </h2>
            <button
              onClick={() => {
                sound.playTap();
                onOpenProfileSwitch();
              }}
              className="flex items-center gap-1 bg-[#e6eeff] px-3 py-1 rounded-full text-[#7c5800] text-xs md:text-sm font-bold hover:bg-[#dde9ff] transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#006780]" />
              <span>切换档案 ({currentStudent.grade})</span>
            </button>
          </div>
          <p className="text-sm md:text-base text-[#514532]/90 mt-1 font-medium">
            你好，{currentStudent.chineseName || currentStudent.name}！开启 2024 人教版 (PEP) 趣味单词探险吧！
          </p>
        </div>
      </section>

      {/* Grade & Semester Stratification Selector */}
      <section>
        <GradeSemesterSelector
          selectedGrade={selectedGrade}
          selectedSemester={selectedSemester}
          onSelectSemesterKey={onSelectSemesterKey}
          onSelectGrade={onSelectGrade}
          onSelectSemester={onSelectSemester}
          onOpenExam={onOpenExam}
        />
      </section>

      {/* Cross-Unit Thematic Category Filter */}
      <section className="bg-white rounded-3xl p-5 border-2 border-[#dde9ff] cloud-shadow">
        <div className="flex justify-between items-center mb-3.5">
          <h3 className="text-base md:text-lg font-bold text-[#0d1c2f] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ffb800]" />
            <span>跨单元主题分类 (Theme Topics)</span>
          </h3>
          <span className="text-xs text-[#514532]/70 font-semibold">
            点击主题筛选词卡
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playTap();
                  onSelectCategory(cat.id);
                  onStartCards(undefined, cat.id);
                }}
                className={`p-2.5 rounded-2xl border transition-all text-left flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#ffb800]/20 border-[#ffb800] text-[#7c5800] font-bold shadow-sm'
                    : 'bg-[#f8f9ff] border-[#e6eeff] hover:border-[#ffd666] hover:bg-white text-[#0d1c2f]'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate leading-tight">{cat.name}</p>
                  <p className="text-[10px] text-[#514532]/70 truncate">{cat.englishName}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Bento Grid - Missions & Activities */}
      <section>
        <h3 className="text-lg md:text-xl font-bold text-[#0d1c2f] mb-3 flex items-center gap-2">
          <span>今日探险任务 (Today's Missions)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* 1. Large Card: PEP 3D Flashcards */}
          <div
            onClick={() => {
              sound.playTap();
              onStartCards();
            }}
            className="md:col-span-8 bg-white border border-[#dde9ff] rounded-3xl p-5 md:p-6 cloud-shadow relative overflow-hidden group cursor-pointer hover:border-[#ffb800] transition-all"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#ffb800]/20 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />

            <div className="flex flex-col h-full justify-between relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="bg-[#5ed8ff]/25 text-[#005c72] px-3 py-1 rounded-full text-xs font-bold">
                    3D Flashcards
                  </span>
                  <span className="bg-[#ffb800]/20 text-[#7c5800] px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {currentSemesterMeta.fullTitle}
                  </span>
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-[#0d1c2f]">
                  课本单词卡片学习 (New Vocabulary)
                </h4>
                <p className="text-sm text-[#514532]/80 mt-1">
                  翻转 3D 单词卡，跟读纯正原声音频，快速记忆本学期核心生词。
                </p>
              </div>

              <div className="mt-6 flex flex-wrap justify-between items-center gap-3">
                <div className="flex flex-wrap gap-2">
                  {semesterWords.slice(0, 4).map((w) => (
                    <span
                      key={w.id}
                      className="bg-[#e6eeff] px-3 py-1 rounded-xl text-xs font-bold text-[#0d1c2f]"
                    >
                      {w.word} ({w.translation})
                    </span>
                  ))}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playTap();
                    onStartCards();
                  }}
                  className="bg-[#ffb800] text-[#6b4c00] font-bold text-sm md:text-base px-6 py-2.5 rounded-full button-3d-yellow cursor-pointer"
                >
                  开始学习
                </button>
              </div>
            </div>
          </div>

          {/* 2. Small Card: Quick Quiz */}
          <div
            onClick={() => {
              sound.playTap();
              onStartQuiz();
            }}
            className="md:col-span-4 bg-white border border-[#dde9ff] rounded-3xl p-5 md:p-6 cloud-shadow flex flex-col justify-between cursor-pointer hover:border-[#6fde00] transition-all group"
          >
            <div>
              <div className="bg-[#6fde00]/20 text-[#2b5d00] w-max p-2 rounded-2xl mb-3 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-6 h-6 text-[#2b5d00]" />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-[#0d1c2f]">
                趣味看图测试 (Quick Quiz)
              </h4>
              <p className="text-xs text-[#514532]/80 mt-1">
                3条生命值看图选词闯关，赢取小星星！
              </p>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs font-bold text-[#006780]">
                {semesterWords.length} 题挑战
              </span>
              <span className="w-8 h-8 rounded-full bg-[#e6eeff] flex items-center justify-center text-[#7c5800] group-hover:bg-[#6fde00] group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </span>
            </div>
          </div>

          {/* 3. Small Card: Speak Out Practice */}
          <div
            onClick={() => {
              sound.playTap();
              onOpenSpeakOut();
            }}
            className="md:col-span-6 bg-white border border-[#dde9ff] rounded-3xl p-5 md:p-6 cloud-shadow flex items-center justify-between cursor-pointer hover:border-[#ff7d54] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center group-hover:scale-105 transition-transform text-2xl">
                🎙️
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#ba1a1a] bg-[#ffdad6]/60 px-2 py-0.5 rounded-full">
                  AI 口语测评
                </span>
                <h4 className="text-base md:text-lg font-bold text-[#0d1c2f] mt-0.5">
                  开口说 (Speak Out)
                </h4>
                <p className="text-xs text-[#514532]/80">跟读课本原声，实时发音打分</p>
              </div>
            </div>
            <span className="w-8 h-8 rounded-full bg-[#e6eeff] flex items-center justify-center text-[#7c5800] group-hover:bg-[#ff7d54] group-hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </span>
          </div>

          {/* 4. Homework & Drag Exercises */}
          <div
            onClick={() => {
              sound.playTap();
              if (onOpenHomework) onOpenHomework();
              else onOpenBadges();
            }}
            className="md:col-span-6 bg-white border border-[#dde9ff] rounded-3xl p-5 md:p-6 cloud-shadow flex items-center justify-between cursor-pointer hover:border-[#006780] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#e6f7fa] text-[#006780] flex items-center justify-center group-hover:scale-105 transition-transform text-2xl">
                📝
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#006780] bg-[#e6f7fa] px-2 py-0.5 rounded-full">
                  多学科联动 · 智能作业
                </span>
                <h4 className="text-base md:text-lg font-bold text-[#0d1c2f] mt-0.5">
                  课后作业与拖拽练习 (Homework)
                </h4>
                <p className="text-xs text-[#514532]/80">
                  三年级/五年级 · 语文、数学、英语个性化作业与拖拽归类
                </p>
              </div>
            </div>
            <span className="w-8 h-8 rounded-full bg-[#e6eeff] flex items-center justify-center text-[#7c5800] group-hover:bg-[#006780] group-hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
