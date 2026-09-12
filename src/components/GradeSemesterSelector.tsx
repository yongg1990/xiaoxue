import React from 'react';
import { GradeLevel, SemesterType, SemesterKey } from '../types';
import { PEP_SEMESTERS } from '../data/pepCurriculum';
import { BookOpen, Sparkles, Award } from 'lucide-react';
import { sound } from '../utils/speech';

interface GradeSemesterSelectorProps {
  selectedGrade: GradeLevel;
  selectedSemester: SemesterType;
  onSelectSemesterKey: (key: SemesterKey) => void;
  onSelectGrade: (grade: GradeLevel) => void;
  onSelectSemester: (semester: SemesterType) => void;
  onOpenExam?: (grade: GradeLevel) => void;
}

export const GradeSemesterSelector: React.FC<GradeSemesterSelectorProps> = ({
  selectedGrade,
  selectedSemester,
  onSelectSemesterKey,
  onSelectGrade,
  onSelectSemester,
  onOpenExam,
}) => {
  const currentSemesterKey: SemesterKey = `${selectedGrade}${selectedSemester}` as SemesterKey;
  const currentMeta = PEP_SEMESTERS.find(s => s.key === currentSemesterKey) || PEP_SEMESTERS[0];

  const grades: { level: GradeLevel; label: string; subLabel: string }[] = [
    { level: '3', label: '三年级', subLabel: 'Grade 3' },
    { level: '4', label: '四年级', subLabel: 'Grade 4' },
    { level: '5', label: '五年级', subLabel: 'Grade 5' },
    { level: '6', label: '六年级', subLabel: 'Grade 6' },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 md:p-5 border-2 border-[#dde9ff] cloud-shadow space-y-3.5">
      {/* Top Title, PEP Textbook Indicator & Exam Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-[#f0f4fc]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-[#ffb800]/20 text-[#7c5800]">
            <BookOpen className="w-5 h-5 text-[#ffb800]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-bold text-[#0d1c2f]">
                人教版 (PEP) 学习分层体系
              </h3>
              {currentMeta.isNew2024 && (
                <span className="bg-[#ff4757] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
                  <Sparkles className="w-3 h-3" />
                  2024全新版
                </span>
              )}
            </div>
            <p className="text-xs text-[#514532]/80">
              当前同步：<span className="font-bold text-[#006780]">{currentMeta.fullTitle}</span> · {currentMeta.curriculumEdition}
            </p>
          </div>
        </div>

        {/* 考试 (Exam) Action Button */}
        <button
          id="btn-unit-exam"
          onClick={() => {
            sound.playTap();
            onOpenExam?.(selectedGrade);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#ff4757] via-[#ff6b81] to-[#ff4757] hover:from-[#e84118] hover:to-[#ff4757] text-white px-4 py-2 rounded-2xl font-black shadow-md hover:shadow-lg active:scale-95 transition-all text-xs sm:text-sm cursor-pointer shrink-0"
        >
          <Award className="w-4 h-4 text-yellow-200 animate-bounce" />
          <span>考试</span>
          <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold">
            第一单元100分卷
          </span>
        </button>
      </div>

      {/* Grade Level Tabs (3-6 年级分层) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {grades.map((g) => {
          const isSelected = selectedGrade === g.level;
          const semesterAKey: SemesterKey = `${g.level}A` as SemesterKey;
          const metaA = PEP_SEMESTERS.find(s => s.key === semesterAKey);

          return (
            <button
              key={g.level}
              onClick={() => {
                sound.playTap();
                onSelectGrade(g.level);
              }}
              className={`p-3 rounded-2xl border-2 text-left transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-[#fffdf5] to-[#fff6de] border-[#ffb800] shadow-md scale-[1.02]'
                  : 'bg-[#fcfdff] border-[#e6eeff] hover:border-[#dde9ff] hover:bg-[#f5f8ff]'
              }`}
            >
              {g.level === '3' && (
                <span className="absolute top-1 right-1 bg-[#ff4757] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                  2024新版
                </span>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-bold text-sm md:text-base ${isSelected ? 'text-[#7c5800]' : 'text-[#0d1c2f]'}`}>
                    {g.label}
                  </p>
                  <p className="text-[11px] text-[#514532]/70 font-quicksand font-semibold">
                    {g.subLabel}
                  </p>
                </div>
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs font-quicksand ${
                    isSelected
                      ? 'bg-[#ffb800] text-[#6b4c00]'
                      : 'bg-[#dde9ff] text-[#514532]'
                  }`}
                >
                  {g.level}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Semester Bar (3上, 3下, 4上, 4下, 5上, 5下, 6上, 6下) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        <span className="text-[11px] font-bold text-[#514532]/70 whitespace-nowrap pl-1">
          快速直达：
        </span>
        {PEP_SEMESTERS.map((sem) => {
          const isActive = sem.key === currentSemesterKey;
          return (
            <button
              key={sem.key}
              onClick={() => {
                sound.playTap();
                onSelectSemesterKey(sem.key);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#ffb800] text-[#6b4c00] border-[#ffd666] shadow-sm font-extrabold'
                  : 'bg-[#f4f7fc] text-[#514532] border-[#e1e9f7] hover:bg-[#e8effa]'
              }`}
            >
              {sem.gradeLabel.slice(0, 1)}{sem.semesterLabel.slice(0, 1)}
              {sem.isNew2024 && ' (新版)'}
            </button>
          );
        })}
      </div>
    </div>
  );
};
