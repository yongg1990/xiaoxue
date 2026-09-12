import React from 'react';
import { ActiveTab } from '../types';
import { Home, BookOpen, Layers, HelpCircle, ClipboardCheck, Award } from 'lucide-react';
import { sound } from '../utils/speech';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const navItems: { id: ActiveTab; labelZh: string; labelEn: string; icon: React.ReactNode; isNew?: boolean }[] = [
    {
      id: 'home',
      labelZh: '首页',
      labelEn: 'Home',
      icon: <Home className="w-5 h-5 md:w-6 md:h-6" />,
    },
    {
      id: 'sentences',
      labelZh: '课文句子',
      labelEn: 'Sentences',
      icon: <BookOpen className="w-5 h-5 md:w-6 md:h-6" />,
      isNew: true,
    },
    {
      id: 'cards',
      labelZh: '单词卡',
      labelEn: 'Cards',
      icon: <Layers className="w-5 h-5 md:w-6 md:h-6" />,
    },
    {
      id: 'quiz',
      labelZh: '练习',
      labelEn: 'Quiz',
      icon: <HelpCircle className="w-5 h-5 md:w-6 md:h-6" />,
    },
    {
      id: 'homework',
      labelZh: '作业',
      labelEn: 'Homework',
      icon: <ClipboardCheck className="w-5 h-5 md:w-6 md:h-6" />,
      isNew: true,
    },
    {
      id: 'exam',
      labelZh: '考试',
      labelEn: 'Exam',
      icon: <Award className="w-5 h-5 md:w-6 md:h-6" />,
      isNew: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 md:px-4 pb-4 pt-2 bg-white/95 backdrop-blur-md border-t-2 border-[#e6eeff] shadow-[0px_-10px_40px_0px_rgba(0,103,128,0.08)] rounded-t-3xl max-w-lg mx-auto left-0 right-0 md:max-w-2xl">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              sound.playTap();
              onSelectTab(item.id);
            }}
            className={`relative flex flex-col items-center justify-center transition-all duration-150 py-1.5 px-2.5 md:px-4 rounded-2xl cursor-pointer ${
              isActive
                ? 'bg-[#ffb800] text-[#6b4c00] font-bold shadow-sm scale-105'
                : 'text-[#514532]/70 hover:text-[#7c5800] active:scale-95'
            }`}
          >
            {item.isNew && !isActive && (
              <span className="absolute -top-1.5 right-1 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full animate-bounce">
                新
              </span>
            )}
            <div className="mb-0.5">{item.icon}</div>
            <span className="text-[10px] md:text-xs font-semibold whitespace-nowrap">
              {item.labelZh}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

