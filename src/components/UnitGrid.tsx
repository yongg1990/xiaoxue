import React from 'react';
import { UnitInfo, WordItem, StudentProfile } from '../types';
import { BookOpen, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/speech';

interface UnitGridProps {
  units: UnitInfo[];
  allWords: WordItem[];
  currentStudent: StudentProfile;
  selectedUnitId?: string;
  onSelectUnit: (unitId: string) => void;
  onStartUnitLearning: (unitId: string) => void;
}

export const UnitGrid: React.FC<UnitGridProps> = ({
  units,
  allWords,
  currentStudent,
  selectedUnitId,
  onSelectUnit,
  onStartUnitLearning,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg md:text-xl font-bold text-[#0d1c2f] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#ffb800]" />
          <span>课本单元单词库 (PEP Units)</span>
        </h3>
        <span className="text-xs font-bold text-[#006780] bg-[#e6f8fc] px-2.5 py-1 rounded-full border border-[#a3ecf7]">
          共 {units.length} 个教学单元
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {units.map((unit) => {
          const unitWords = allWords.filter((w) => w.unitId === unit.id);
          const masteredInUnit = unitWords.filter((w) =>
            currentStudent.wordsMastered.includes(w.id)
          ).length;
          const isSelected = selectedUnitId === unit.id;
          const isFullyMastered = unitWords.length > 0 && masteredInUnit === unitWords.length;

          return (
            <div
              key={unit.id}
              onClick={() => {
                sound.playTap();
                onSelectUnit(unit.id);
              }}
              className={`rounded-3xl p-4 md:p-5 border-2 transition-all cursor-pointer cloud-shadow flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-gradient-to-br from-[#fffdf5] to-[#fff6de] border-[#ffb800] shadow-md scale-[1.02]'
                  : 'bg-white border-[#dde9ff] hover:border-[#ffd666] hover:bg-[#fffdf8]'
              }`}
            >
              {/* Badge for 2024 New Edition */}
              {unit.isNew2024 && (
                <div className="absolute -top-2.5 right-4 bg-[#ff4757] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" />
                  2024新版
                </div>
              )}

              <div>
                {/* Header Icon + Unit Number */}
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm"
                    style={{ backgroundColor: unit.bgLight }}
                  >
                    {unit.icon}
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full font-quicksand"
                    style={{
                      backgroundColor: unit.bgLight,
                      color: unit.color,
                      border: `1px solid ${unit.borderColor}`,
                    }}
                  >
                    Unit {unit.unitNumber}
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#0d1c2f] leading-snug mb-1">
                  {unit.chineseTitle}
                </h4>
                <p className="text-xs font-bold text-[#006780] font-quicksand mb-2">
                  {unit.title}
                </p>
                <p className="text-xs text-[#514532]/80 line-clamp-2 leading-relaxed mb-3">
                  {unit.theme}
                </p>

                {/* Word preview badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {unitWords.slice(0, 3).map((w) => (
                    <span
                      key={w.id}
                      className="bg-[#eff4ff] text-[#0d1c2f] text-[11px] font-semibold px-2 py-0.5 rounded-lg"
                    >
                      {w.word.toLowerCase()} {w.translation}
                    </span>
                  ))}
                  {unitWords.length > 3 && (
                    <span className="text-[10px] text-[#514532]/70 font-semibold self-center">
                      +{unitWords.length - 3} 词
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Progress & Action Button */}
              <div className="pt-2 border-t border-[#f0f4fc]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#514532] font-semibold">
                    掌握度：{masteredInUnit}/{unitWords.length} 词
                  </span>
                  {isFullyMastered && (
                    <span className="text-[#2b5d00] font-bold text-[11px] flex items-center gap-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 已全部掌握
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playTap();
                    onStartUnitLearning(unit.id);
                  }}
                  className="w-full bg-[#ffb800] text-[#6b4c00] font-bold py-2 rounded-2xl button-3d-yellow text-xs md:text-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>进入单元学习</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
