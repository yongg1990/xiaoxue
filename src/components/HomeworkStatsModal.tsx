import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Calendar,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  BarChart2,
  BookOpen,
  Calculator,
  Languages,
  TrendingUp,
  Sparkles,
  Trash2,
  Flame,
} from 'lucide-react';
import { HomeworkGrade, HomeworkSubject, StudentProfile } from '../types';
import {
  getTodayDateString,
  getStudentRecordedDates,
  getDaySummary,
  getUnitDailyStat,
  clearHomeworkStats,
  loadAllHomeworkStats,
} from '../utils/homeworkStats';
import { HOMEWORK_CURRICULUM } from '../data/homeworkCurriculum';

interface HomeworkStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: StudentProfile;
  initialGrade: HomeworkGrade;
  initialSubject: HomeworkSubject;
  onSelectUnit?: (grade: HomeworkGrade, subject: HomeworkSubject, unitNumber: number) => void;
}

const GRADE_NAMES: Record<HomeworkGrade, string> = {
  '3': '三年级上册',
  '4': '四年级上册',
  '5': '五年级上册',
  '6': '六年级上册',
};

const SUBJECT_INFOS: Record<
  HomeworkSubject,
  { label: string; icon: React.ReactNode; color: string; bg: string; text: string }
> = {
  chinese: {
    label: '语文',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: '#ba1a1a',
    bg: 'bg-[#ffdad6]/40',
    text: 'text-[#ba1a1a]',
  },
  math: {
    label: '数学',
    icon: <Calculator className="w-3.5 h-3.5" />,
    color: '#006780',
    bg: 'bg-[#e6f7fa]',
    text: 'text-[#006780]',
  },
  english: {
    label: '英语',
    icon: <Languages className="w-3.5 h-3.5" />,
    color: '#0284c7',
    bg: 'bg-[#eff4ff]',
    text: 'text-[#0284c7]',
  },
};

export const HomeworkStatsModal: React.FC<HomeworkStatsModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  initialGrade,
  initialSubject,
  onSelectUnit,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedGrade, setSelectedGrade] = useState<HomeworkGrade>(initialGrade);
  const [selectedSubjectTab, setSelectedSubjectTab] = useState<HomeworkSubject | 'all'>(initialSubject);
  const [, setTriggerUpdate] = useState(0);

  // Sync with initial props when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedGrade(initialGrade);
      setSelectedSubjectTab(initialSubject);
      setSelectedDate(getTodayDateString());
    }
  }, [isOpen, initialGrade, initialSubject]);

  // Listen to custom event for real-time reactive updates
  useEffect(() => {
    const handleUpdate = () => {
      setTriggerUpdate((prev) => prev + 1);
    };
    window.addEventListener('homework-stats-updated', handleUpdate);
    return () => {
      window.removeEventListener('homework-stats-updated', handleUpdate);
    };
  }, []);

  // Available dates with records for current student
  const recordedDates = useMemo(() => {
    return getStudentRecordedDates(currentStudent.id);
  }, [currentStudent.id]);

  // Overall summary for current selected date
  const daySummary = useMemo(() => {
    return getDaySummary(
      currentStudent.id,
      selectedDate,
      selectedGrade,
      selectedSubjectTab === 'all' ? undefined : selectedSubjectTab
    );
  }, [currentStudent.id, selectedDate, selectedGrade, selectedSubjectTab]);

  // Read per-unit stats
  const unitStatsList = useMemo(() => {
    const subjectsToInclude: HomeworkSubject[] =
      selectedSubjectTab === 'all'
        ? (['chinese', 'math', 'english'] as HomeworkSubject[])
        : [selectedSubjectTab];

    const result: Array<{
      subject: HomeworkSubject;
      unitNumber: number;
      unitTitle: string;
      themeDesc: string;
      refreshCount: number;
      wrongCount: number;
      correctCount: number;
      accuracy: number | null;
      lastUpdated: string;
    }> = [];

    subjectsToInclude.forEach((subj) => {
      const curriculumUnits = HOMEWORK_CURRICULUM[selectedGrade]?.[subj] || [];
      for (let uNum = 1; uNum <= 6; uNum++) {
        const cUnit = curriculumUnits.find((u) => u.unitNumber === uNum);
        const stat = getUnitDailyStat(currentStudent.id, selectedDate, selectedGrade, subj, uNum);
        const totalAnswers = stat.wrongCount + stat.correctCount;
        const accuracy = totalAnswers > 0 ? Math.round((stat.correctCount / totalAnswers) * 100) : null;

        result.push({
          subject: subj,
          unitNumber: uNum,
          unitTitle: cUnit ? cUnit.title : `第${uNum}单元`,
          themeDesc: cUnit ? cUnit.themeDesc : '核心重难点训练',
          refreshCount: stat.refreshCount,
          wrongCount: stat.wrongCount,
          correctCount: stat.correctCount,
          accuracy,
          lastUpdated: stat.lastUpdated,
        });
      }
    });

    return result;
  }, [currentStudent.id, selectedDate, selectedGrade, selectedSubjectTab]);

  const isToday = selectedDate === getTodayDateString();

  const handleClearTodayStats = () => {
    if (window.confirm(`确定要清空 ${currentStudent.name} 在 ${selectedDate} 的作业刷新与答错记录吗？`)) {
      clearHomeworkStats(currentStudent.id, selectedDate);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-[#dde9ff] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#006780] to-[#0284c7] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">作业学情统计看板</h3>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
                  {currentStudent.name}
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                实时统计每天、每科、每单元的刷新次数与答错次数
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* 1. Filter Bar: Date & Grade */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-[#f8fafc] p-3 rounded-2xl border border-[#e2e8f0]">
            {/* Date Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#006780]" />
              <span className="text-xs font-bold text-[#334155]">日期:</span>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white text-xs font-bold text-[#0f172a] border border-[#cbd5e1] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#006780] cursor-pointer"
              >
                {recordedDates.map((d) => (
                  <option key={d} value={d}>
                    {d === getTodayDateString() ? `今天 (${d})` : d}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Selector */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-[#334155] mr-1">年级:</span>
              {(['3', '4', '5', '6'] as HomeworkGrade[]).map((grade) => {
                const active = selectedGrade === grade;
                return (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      active
                        ? 'bg-[#006780] text-white shadow-xs'
                        : 'bg-white text-[#64748b] hover:text-[#0f172a] border border-[#e2e8f0]'
                    }`}
                  >
                    {GRADE_NAMES[grade]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Today's Summary Scorecards */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Total Refreshes */}
            <div className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] border border-[#bae6fd] p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#0284c7]">
                <span className="text-[11px] font-bold">累计刷新次数</span>
                <RefreshCw className="w-3.5 h-3.5" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#0369a1]">
                  {daySummary.totalRefreshes}
                </span>
                <span className="text-xs text-[#0284c7] font-semibold">次</span>
              </div>
              <p className="text-[10px] text-[#0284c7]/80 mt-1">
                含换一批、重练与重置
              </p>
            </div>

            {/* Total Wrongs */}
            <div className="bg-gradient-to-br from-[#fff1f2] to-[#ffe4e6] border border-[#fecdd3] p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#e11d48]">
                <span className="text-[11px] font-bold">累计答错次数</span>
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#be123c]">
                  {daySummary.totalWrongs}
                </span>
                <span className="text-xs text-[#e11d48] font-semibold">次</span>
              </div>
              <p className="text-[10px] text-[#e11d48]/80 mt-1">
                {daySummary.totalWrongs > 0 ? '需针对错题重点巩固' : '暂无错题，状态极佳'}
              </p>
            </div>

            {/* Total Corrects */}
            <div className="bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border border-[#bbf7d0] p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#16a34a]">
                <span className="text-[11px] font-bold">答对达成次数</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#15803d]">
                  {daySummary.totalCorrects}
                </span>
                <span className="text-xs text-[#16a34a] font-semibold">次</span>
              </div>
              <p className="text-[10px] text-[#16a34a]/80 mt-1">
                扎实掌握知识点
              </p>
            </div>
          </div>

          {/* 3. Subject Tabs */}
          <div className="flex items-center gap-1.5 border-b border-[#e2e8f0] pb-2">
            <button
              onClick={() => setSelectedSubjectTab('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedSubjectTab === 'all'
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
              }`}
            >
              全部学科
            </button>
            {(['chinese', 'math', 'english'] as HomeworkSubject[]).map((subj) => {
              const active = selectedSubjectTab === subj;
              const info = SUBJECT_INFOS[subj];
              return (
                <button
                  key={subj}
                  onClick={() => setSelectedSubjectTab(subj)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? `${info.bg} ${info.text} border border-current shadow-xs`
                      : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                  }`}
                >
                  {info.icon}
                  <span>{info.label}</span>
                </button>
              );
            })}
          </div>

          {/* 4. Per-Unit Detailed Statistics Table / Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#334155] flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#006780]" />
                {GRADE_NAMES[selectedGrade]}各单元学情明细清单
              </span>
              <span className="text-[11px] text-[#64748b]">
                共 {unitStatsList.length} 个单元记录
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {unitStatsList.map((item) => {
                const sInfo = SUBJECT_INFOS[item.subject];
                const hasActivity = item.refreshCount > 0 || item.wrongCount > 0 || item.correctCount > 0;

                return (
                  <div
                    key={`${item.subject}-${item.unitNumber}`}
                    className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      hasActivity
                        ? 'bg-white border-[#cbd5e1] hover:border-[#006780] shadow-2xs'
                        : 'bg-[#f8fafc] border-[#e2e8f0] opacity-80'
                    }`}
                  >
                    {/* Unit Info */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${sInfo.bg} ${sInfo.text}`}
                      >
                        U{item.unitNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${sInfo.bg} ${sInfo.text}`}
                          >
                            {sInfo.label}
                          </span>
                          <span className="text-xs font-bold text-[#0f172a]">
                            第 {item.unitNumber} 单元 · {item.unitTitle}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748b] mt-0.5 line-clamp-1">
                          {item.themeDesc}
                        </p>
                      </div>
                    </div>

                    {/* Stats Metrics for this unit */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#f1f5f9]">
                      {/* Refresh count */}
                      <div className="flex items-center gap-1.5 bg-[#f0f9ff] px-2.5 py-1 rounded-xl border border-[#bae6fd]">
                        <RefreshCw className="w-3 h-3 text-[#0284c7]" />
                        <span className="text-[11px] text-[#0369a1] font-medium">刷新:</span>
                        <span className="text-xs font-extrabold text-[#0284c7]">
                          {item.refreshCount} 次
                        </span>
                      </div>

                      {/* Wrong count */}
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${
                          item.wrongCount > 0
                            ? 'bg-[#fff1f2] border-[#fecdd3] text-[#e11d48]'
                            : 'bg-[#f8fafc] border-[#e2e8f0] text-[#94a3b8]'
                        }`}
                      >
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-[11px] font-medium">答错:</span>
                        <span className="text-xs font-extrabold">
                          {item.wrongCount} 次
                        </span>
                      </div>

                      {/* Practice Button */}
                      {onSelectUnit && (
                        <button
                          onClick={() => {
                            onSelectUnit(selectedGrade, item.subject, item.unitNumber);
                            onClose();
                          }}
                          className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-[#006780] hover:bg-[#005266] text-white transition-all cursor-pointer shadow-2xs"
                        >
                          去做题
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Helpful Diagnostic Note */}
          <div className="bg-[#fffbeb] border border-[#fef3c7] p-3 rounded-2xl flex items-start gap-2.5 text-xs text-[#92400e]">
            <Sparkles className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">名师学情导读：</p>
              <p className="mt-0.5 text-[#b45309]">
                • <strong>刷新次数</strong>：记录孩子在该单元使用「换一批」、「再练一套」或重置换题的频次，反映探索活跃度与做题套数。
                <br />
                • <strong>答错次数</strong>：记录匹配混淆或小测选错的次数。若某单元答错较多，建议勾选「前置单元滚动练习」巩固强化。
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between shrink-0">
          <button
            onClick={handleClearTodayStats}
            className="text-xs text-[#ef4444] hover:text-[#b91c1c] font-medium flex items-center gap-1 cursor-pointer transition-colors"
            title="清空当前日期的统计数据"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>清空该日记录</span>
          </button>

          <button
            onClick={onClose}
            className="bg-[#006780] hover:bg-[#005266] active:scale-95 text-white text-xs sm:text-sm font-bold px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};
