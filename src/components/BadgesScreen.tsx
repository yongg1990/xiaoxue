import React, { useState } from 'react';
import { BadgeItem, StudentProfile } from '../types';
import { Trophy, Star, Flame, Award, CheckCircle2, Lock, Sparkles, X } from 'lucide-react';
import { sound, triggerConfetti } from '../utils/speech';

interface BadgesScreenProps {
  currentStudent: StudentProfile;
  badges: BadgeItem[];
}

export const BadgesScreen: React.FC<BadgesScreenProps> = ({ currentStudent, badges }) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const unlockedCount = badges.filter(b => b.unlocked).length;

  const handleOpenBadge = (badge: BadgeItem) => {
    sound.playTap();
    if (badge.unlocked) {
      triggerConfetti();
    }
    setSelectedBadge(badge);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-6 pb-28">
      {/* Student Achievement Banner */}
      <section className="bg-gradient-to-br from-[#ffb800]/20 via-[#dde9ff]/40 to-white rounded-3xl p-6 border-2 border-[#dde9ff] cloud-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-[#ffb800] shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#ffb800] text-[#6b4c00] p-1 rounded-full">
              <Trophy className="w-4 h-4 fill-[#6b4c00]" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0d1c2f]">
              {currentStudent.name} 的成就馆
            </h2>
            <p className="text-xs md:text-sm text-[#514532]">
              已解锁 {unlockedCount} / {badges.length} 枚荣誉徽章
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-2">
          <div className="bg-white px-3 py-2 rounded-2xl border border-[#dde9ff] text-center min-w-[70px]">
            <div className="flex items-center justify-center text-[#ffb800]">
              <Star className="w-4 h-4 fill-[#ffb800]" />
            </div>
            <p className="text-base font-bold text-[#7c5800] font-quicksand">
              {currentStudent.totalStars}
            </p>
            <p className="text-[10px] text-[#514532]/70 font-semibold">总星星</p>
          </div>

          <div className="bg-white px-3 py-2 rounded-2xl border border-[#dde9ff] text-center min-w-[70px]">
            <div className="flex items-center justify-center text-[#6fde00]">
              <Flame className="w-4 h-4 fill-[#6fde00]" />
            </div>
            <p className="text-base font-bold text-[#2b5d00] font-quicksand">
              {currentStudent.streakDays} 天
            </p>
            <p className="text-[10px] text-[#514532]/70 font-semibold">连续学习</p>
          </div>

          <div className="bg-white px-3 py-2 rounded-2xl border border-[#dde9ff] text-center min-w-[70px]">
            <div className="flex items-center justify-center text-[#006780]">
              <Award className="w-4 h-4" />
            </div>
            <p className="text-base font-bold text-[#006780] font-quicksand">
              {currentStudent.wordsMastered.length}
            </p>
            <p className="text-[10px] text-[#514532]/70 font-semibold">掌握单词</p>
          </div>
        </div>
      </section>

      {/* Badges Grid */}
      <section>
        <h3 className="text-lg md:text-xl font-bold text-[#0d1c2f] mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#ffb800]" />
          荣誉徽章 (Badges & Medals)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge) => {
            return (
              <div
                key={badge.id}
                onClick={() => handleOpenBadge(badge)}
                className={`rounded-3xl p-5 border-2 transition-all cursor-pointer cloud-shadow flex flex-col justify-between relative group ${
                  badge.unlocked
                    ? 'bg-white border-[#ffd666] hover:border-[#ffb800] hover:scale-[1.02]'
                    : 'bg-[#eff4ff]/60 border-[#dde9ff] opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        badge.unlocked
                          ? 'bg-[#ffb800]/25 text-[#6b4c00] group-hover:scale-110 transition-transform'
                          : 'bg-[#dde9ff] text-[#514532]/50'
                      }`}
                    >
                      <Trophy className="w-7 h-7" />
                    </div>
                    {badge.unlocked ? (
                      <span className="bg-[#6fde00]/20 text-[#2b5d00] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 已获得
                      </span>
                    ) : (
                      <span className="bg-[#dde9ff] text-[#514532]/70 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> 未解锁
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-[#0d1c2f] mb-0.5">
                    {badge.chineseTitle}
                  </h4>
                  <p className="text-xs font-semibold text-[#006780] mb-2 font-quicksand">
                    {badge.title}
                  </p>
                  <p className="text-xs text-[#514532]/80 leading-relaxed mb-4">
                    {badge.description}
                  </p>
                </div>

                {/* Progress bar or unlock date */}
                {badge.unlocked ? (
                  <div className="text-[11px] text-[#7c5800] font-semibold bg-[#fff8e6] px-3 py-1.5 rounded-xl">
                    🌟 获得于 {badge.unlockedDate || '最近'}
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-[#514532] mb-1">
                      <span>{badge.progressText}</span>
                      <span>
                        {badge.currentCount}/{badge.targetCount}
                      </span>
                    </div>
                    <div className="h-2.5 bg-[#dde9ff] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ffb800] rounded-full"
                        style={{
                          width: `${Math.min(100, (badge.currentCount / badge.targetCount) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm text-center shadow-2xl border-2 border-[#dde9ff] relative">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#ffb800]/20 flex items-center justify-center mb-4 border-2 border-[#ffb800]">
              <Trophy className="w-10 h-10 text-[#ffb800]" />
            </div>

            <h3 className="text-2xl font-bold text-[#0d1c2f] mb-1">
              {selectedBadge.chineseTitle}
            </h3>
            <p className="text-sm font-bold text-[#006780] mb-3 font-quicksand">
              {selectedBadge.title}
            </p>
            <p className="text-sm text-[#514532] mb-6">{selectedBadge.description}</p>

            {selectedBadge.unlocked ? (
              <div className="bg-[#f3fee6] text-[#2b5d00] p-4 rounded-2xl font-bold text-sm mb-4 border border-[#b4f26b]">
                🎉 祝贺你！已成功解锁该荣誉称号！
              </div>
            ) : (
              <div className="bg-[#fff8e6] text-[#7c5800] p-4 rounded-2xl font-bold text-sm mb-4 border border-[#ffd666]">
                🚀 加油！{selectedBadge.progressText}
              </div>
            )}

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full bg-[#ffb800] text-[#6b4c00] font-bold py-3 rounded-full button-3d-yellow"
            >
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
