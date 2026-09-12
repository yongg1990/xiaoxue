import React, { useState, useEffect, useMemo } from 'react';
import {
  StudentProfile,
  HomeworkGrade,
  HomeworkSubject,
  WordItem,
  DragExercise,
  DragTargetSlot,
  DragMatchItem,
  DragQuestion,
  DragCandidateOption,
  DailyHomeworkTask,
} from '../types';
import {
  BookOpen,
  Calculator,
  Languages,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Move,
  RotateCcw,
  Award,
  Star,
  Check,
  HelpCircle,
  Trophy,
  Filter,
  Layers,
  ChevronRight,
  BarChart2,
  AlertCircle,
} from 'lucide-react';
import { sound, triggerConfetti } from '../utils/speech';
import { HOMEWORK_CURRICULUM } from '../data/homeworkCurriculum';
import { generateSimilarOptionsForQuestion } from '../utils/homeworkOptionGenerator';
import { HomeworkStatsModal } from './HomeworkStatsModal';
import {
  recordHomeworkEvent,
  getUnitDailyStat,
  getTodayDateString,
} from '../utils/homeworkStats';

interface HomeworkScreenProps {
  currentStudent: StudentProfile;
  allWords: WordItem[];
  onAddStars: (amount: number) => void;
  onBackToHome: () => void;
}

const GRADE_LABELS: Record<HomeworkGrade, string> = {
  '3': '三年级上册',
  '4': '四年级上册',
  '5': '五年级上册',
  '6': '六年级上册',
};

export const HomeworkScreen: React.FC<HomeworkScreenProps> = ({
  currentStudent,
  allWords,
  onAddStars,
  onBackToHome,
}) => {
  // 1. Grade Selection (三年级 / 四年级 / 五年级 / 六年级)
  const [selectedGrade, setSelectedGrade] = useState<HomeworkGrade>(() => {
    const validGrades: HomeworkGrade[] = ['3', '4', '5', '6'];
    return validGrades.includes(currentStudent.gradeLevel as HomeworkGrade)
      ? (currentStudent.gradeLevel as HomeworkGrade)
      : '3';
  });

  // 2. Subject Selection (语文 vs 数学 vs 英语)
  const [selectedSubject, setSelectedSubject] = useState<HomeworkSubject>('chinese');

  // 3. Unit Selection (Unit 1 ~ Unit 6) - 默认第 1 单元
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<number>(1);

  // 4. Cumulative Review Toggle (是否包含前置已学单元，如选第3单元包含1,2单元)
  const [includePreviousUnits, setIncludePreviousUnits] = useState<boolean>(true);

  // 5. Drag & Drop state
  const [exerciseIndex, setExerciseIndex] = useState(0);
  // questionId -> chosen optionId
  const [placedMatches, setPlacedMatches] = useState<Record<string, string>>({});
  // Selected option when using click-to-place
  const [selectedOptionForTap, setSelectedOptionForTap] = useState<{ questionId: string; optionId: string } | null>(null);
  const [dragErrorSlotId, setDragErrorSlotId] = useState<string | null>(null);
  const [isDragCompleted, setIsDragCompleted] = useState<boolean>(false);

  // 6. Daily tasks state: questionId -> chosenOptionIndex
  const [taskAnswers, setTaskAnswers] = useState<Record<string, number>>({});
  const [submittedTasks, setSubmittedTasks] = useState<boolean>(false);
  const [activeTabSub, setActiveTabSub] = useState<'drag' | 'daily'>('drag');

  // 7. Statistics Modal & Real-time tracker for each day, subject, and unit
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [statsUpdateKey, setStatsUpdateKey] = useState<number>(0);
  const todayStr = useMemo(() => getTodayDateString(), []);

  // Switching handlers: directly change grade, subject, unit without password block
  // 需求：切换年级和学科时，默认选择第一单元
  const handleRequestGrade = (newGrade: HomeworkGrade) => {
    if (newGrade === selectedGrade && selectedUnitNumber === 1) return;
    sound.playTap();
    setSelectedGrade(newGrade);
    setSelectedUnitNumber(1);
    setExerciseIndex(0);
    setPlacedMatches({});
    setSelectedOptionForTap(null);
    setTaskAnswers({});
    setSubmittedTasks(false);
  };

  const handleRequestSubject = (newSubject: HomeworkSubject) => {
    if (newSubject === selectedSubject && selectedUnitNumber === 1) return;
    sound.playTap();
    setSelectedSubject(newSubject);
    setSelectedUnitNumber(1);
    setExerciseIndex(0);
    setPlacedMatches({});
    setSelectedOptionForTap(null);
    setTaskAnswers({});
    setSubmittedTasks(false);
  };

  const handleRequestUnit = (newUnit: number) => {
    if (newUnit === selectedUnitNumber) return;
    sound.playTap();
    setSelectedUnitNumber(newUnit);
    setExerciseIndex(0);
    setPlacedMatches({});
    setSelectedOptionForTap(null);
    setTaskAnswers({});
    setSubmittedTasks(false);
  };

  useEffect(() => {
    const handleStatsUpdated = () => {
      setStatsUpdateKey((prev) => prev + 1);
    };
    window.addEventListener('homework-stats-updated', handleStatsUpdated);
    return () => {
      window.removeEventListener('homework-stats-updated', handleStatsUpdated);
    };
  }, []);

  // Today's stats for currently active grade, subject, and unit
  const currentUnitStat = useMemo(() => {
    return getUnitDailyStat(
      currentStudent.id,
      todayStr,
      selectedGrade,
      selectedSubject,
      selectedUnitNumber
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStudent.id, todayStr, selectedGrade, selectedSubject, selectedUnitNumber, statsUpdateKey]);

  // Available units for the current grade & subject
  const availableUnits = useMemo(() => {
    return HOMEWORK_CURRICULUM[selectedGrade]?.[selectedSubject] || [];
  }, [selectedGrade, selectedSubject]);

  // Current selected unit info
  const currentUnitInfo = useMemo(() => {
    return (
      availableUnits.find((u) => u.unitNumber === selectedUnitNumber) ||
      availableUnits[0] || {
        unitNumber: 1,
        title: `第${selectedUnitNumber}单元`,
        themeDesc: '核心课程重难点',
      }
    );
  }, [availableUnits, selectedUnitNumber]);

  // Covered units list (e.g. if Unit 3 and cumulative=true -> [1, 2, 3])
  const coveredUnits = useMemo(() => {
    if (!includePreviousUnits || selectedUnitNumber <= 1) {
      return availableUnits.filter((u) => u.unitNumber === selectedUnitNumber);
    }
    return availableUnits.filter((u) => u.unitNumber <= selectedUnitNumber);
  }, [availableUnits, selectedUnitNumber, includePreviousUnits]);

  // Reset drag states and tasks on grade, subject, unit, or cumulative toggle
  useEffect(() => {
    setPlacedMatches({});
    setSelectedOptionForTap(null);
    setIsDragCompleted(false);
    setTaskAnswers({});
    setSubmittedTasks(false);
  }, [selectedGrade, selectedSubject, selectedUnitNumber, includePreviousUnits, exerciseIndex]);

  // ==================== Dynamic Cumulative Drag Exercise Generation ====================
  const currentDragExercise = useMemo((): DragExercise | null => {
    if (coveredUnits.length === 0) return null;

    // A: For English, alternate between vocabulary matching from actual curriculum words and dialogue matching
    if (selectedSubject === 'english' && exerciseIndex % 2 === 0) {
      // Pick words belonging to covered units
      const coveredUnitIds = coveredUnits.map((u) => `${selectedGrade}A-U${u.unitNumber}`);
      const matchedWords = allWords.filter(
        (w) =>
          w.grade === selectedGrade &&
          w.translation &&
          w.word &&
          (coveredUnits.length === 1 || coveredUnitIds.includes(w.unitId))
      );
      const fallbackWords = allWords.filter((w) => w.grade === selectedGrade && w.translation);
      const pool = matchedWords.length >= 4 ? matchedWords : fallbackWords;

      // Group words by unit if multiple units are covered
      let chosenWords: WordItem[] = [];
      if (coveredUnits.length > 1 && pool.length >= 4) {
        // Pick words across units: previous units + current unit
        const currentWords = pool.filter((w) => w.unitId.includes(`U${selectedUnitNumber}`));
        const previousWords = pool.filter((w) => !w.unitId.includes(`U${selectedUnitNumber}`));

        if (currentWords.length >= 2 && previousWords.length >= 2) {
          chosenWords = [
            ...previousWords.slice(0, 2),
            ...currentWords.slice(0, 2),
          ];
        } else {
          chosenWords = pool.slice(0, 4);
        }
      } else {
        chosenWords = pool.slice(0, 4);
      }

      if (chosenWords.length >= 4) {
        // Generate each question with 4 similar options
        const questions: DragQuestion[] = chosenWords.map((w, idx) => {
          const matchUnit = w.unitId.match(/U(\d+)/i);
          const uNum = matchUnit ? parseInt(matchUnit[1], 10) : selectedUnitNumber;
          const isReview = uNum < selectedUnitNumber;
          const unitTag = isReview ? `第${uNum}单元复习` : `第${uNum}单元本课`;
          const qId = `eng-q-${idx}-${w.id}`;

          const options = generateSimilarOptionsForQuestion({
            questionId: qId,
            label: w.word,
            subLabel: w.categoryLabel || '重点词汇',
            correctItemLabel: w.translation,
            subject: 'english',
            grade: selectedGrade,
            allWords,
          });

          return {
            id: qId,
            questionNumber: idx + 1,
            label: w.word,
            subLabel: w.categoryLabel || '重点词汇',
            hint: w.phonetic,
            unitTag,
            unitNumber: uNum,
            correctItemLabel: w.translation,
            options,
          };
        });

        const slots: DragTargetSlot[] = chosenWords.map((w, idx) => {
          const matchUnit = w.unitId.match(/U(\d+)/i);
          const uNum = matchUnit ? parseInt(matchUnit[1], 10) : selectedUnitNumber;
          const isReview = uNum < selectedUnitNumber;
          const unitTag = isReview ? `第${uNum}单元复习` : `第${uNum}单元本课`;

          return {
            id: `eng-q-${idx}-${w.id}`,
            label: w.word,
            subLabel: w.categoryLabel || '重点词汇',
            hint: w.phonetic,
            unitTag,
            unitNumber: uNum,
            correctItemId: `eng-i-${idx}`,
          };
        });

        const items: DragMatchItem[] = chosenWords
          .map((w, idx) => ({
            id: `eng-i-${idx}`,
            label: w.translation,
            extra: w.pinyin || '释义',
            targetId: `eng-q-${idx}-${w.id}`,
          }))
          .sort(() => 0.5 - Math.random());

        const isMulti = coveredUnits.length > 1;
        return {
          id: `eng-drag-${selectedGrade}-u${selectedUnitNumber}`,
          title: `${GRADE_LABELS[selectedGrade]}英语 ${
            isMulti ? `第 1 ~ ${selectedUnitNumber} 单元滚动作业` : `第 ${selectedUnitNumber} 单元专项作业`
          }`,
          instruction: isMulti
            ? `已融合第 1 ~ ${selectedUnitNumber} 单元词汇，每题下方有 4 个相似中文选项，请将正确卡片拖入对应英文单词中：`
            : `每道题目下方有 4 个相似选项，请将正确卡片拖入第 ${selectedUnitNumber} 单元英文单词框中：`,
          unitNumber: selectedUnitNumber,
          isCumulative: isMulti,
          slots,
          items,
          questions,
        };
      }
    }

    // B: For Chinese, Math, or English dialogue matching:
    // Gather candidate slots from covered units
    let selectedSlotsRaw: Array<{
      id: string;
      label: string;
      subLabel: string;
      correctItemLabel: string;
      options?: string[];
      extra?: string;
      unitTag: string;
      unitNumber: number;
    }> = [];

    if (coveredUnits.length > 1) {
      // Multi-unit cumulative review!
      const currentUnitObj = coveredUnits.find((u) => u.unitNumber === selectedUnitNumber);
      const prevUnits = coveredUnits.filter((u) => u.unitNumber < selectedUnitNumber);

      // Slots from current unit (2 items)
      const currentUnitSlots = (currentUnitObj?.dragSlots || []).map((s) => ({
        ...s,
        unitTag: `第${selectedUnitNumber}单元本课`,
        unitNumber: selectedUnitNumber,
      }));

      // Slots from previous units (2 items)
      const prevUnitSlots: typeof selectedSlotsRaw = [];
      prevUnits.forEach((pu) => {
        pu.dragSlots.forEach((s) => {
          prevUnitSlots.push({
            ...s,
            unitTag: `第${pu.unitNumber}单元复习`,
            unitNumber: pu.unitNumber,
          });
        });
      });

      // Sample 2 from current unit and 2 from previous units
      const pickCurrent = currentUnitSlots.slice(0, 2);
      const pickPrev = prevUnitSlots.slice(0, 2);
      selectedSlotsRaw = [...pickPrev, ...pickCurrent];
    } else {
      // Single unit only
      const uObj = coveredUnits[0];
      selectedSlotsRaw = (uObj.dragSlots || []).map((s) => ({
        ...s,
        unitTag: `第${uObj.unitNumber}单元`,
        unitNumber: uObj.unitNumber,
      }));
    }

    // Ensure 4 questions
    const finalRaw = selectedSlotsRaw.slice(0, 4);
    if (finalRaw.length === 0) return null;

    // Generate questions with 4 similar options each
    const questions: DragQuestion[] = finalRaw.map((r, idx) => {
      const qId = `drag-q-${idx}-${r.id}`;
      const options = generateSimilarOptionsForQuestion({
        questionId: qId,
        label: r.label,
        subLabel: r.subLabel,
        correctItemLabel: r.correctItemLabel,
        subject: selectedSubject,
        grade: selectedGrade,
        allWords,
        customOptions: r.options,
      });

      return {
        id: qId,
        questionNumber: idx + 1,
        label: r.label,
        subLabel: r.subLabel,
        hint: r.extra,
        unitTag: r.unitTag,
        unitNumber: r.unitNumber,
        correctItemLabel: r.correctItemLabel,
        options,
      };
    });

    const slots: DragTargetSlot[] = finalRaw.map((r, idx) => ({
      id: `drag-q-${idx}-${r.id}`,
      label: r.label,
      subLabel: r.subLabel,
      unitTag: r.unitTag,
      unitNumber: r.unitNumber,
      correctItemId: `item-${idx}-${r.id}`,
    }));

    const items: DragMatchItem[] = finalRaw
      .map((r, idx) => ({
        id: `item-${idx}-${r.id}`,
        label: r.correctItemLabel,
        extra: r.extra || '匹配答案',
        targetId: `drag-q-${idx}-${r.id}`,
      }))
      .sort(() => 0.5 - Math.random());

    const isMulti = coveredUnits.length > 1;
    const subjName = selectedSubject === 'chinese' ? '语文' : selectedSubject === 'math' ? '数学' : '英语';

    return {
      id: `drag-${selectedGrade}-${selectedSubject}-u${selectedUnitNumber}`,
      title: `${GRADE_LABELS[selectedGrade]}${subjName} ${
        isMulti ? `第 1 ~ ${selectedUnitNumber} 单元滚动作业` : `第 ${selectedUnitNumber} 单元专项作业`
      }`,
      instruction: isMulti
        ? `本次作业融合第 1 ~ ${selectedUnitNumber} 单元知识点，每道题目下方配有 4 个相似答案，请将正确卡片拖入题目方框中：`
        : `每道题目下方配有 4 个相似答案，请将正确卡片拖入对应题目的方框中完成第 ${selectedUnitNumber} 单元巩固：`,
      unitNumber: selectedUnitNumber,
      isCumulative: isMulti,
      slots,
      items,
      questions,
    };
  }, [
    coveredUnits,
    selectedGrade,
    selectedSubject,
    selectedUnitNumber,
    exerciseIndex,
    allWords,
  ]);

  // ==================== Dynamic Cumulative Daily Tasks Generation ====================
  const currentDailyTasks = useMemo((): DailyHomeworkTask[] => {
    if (coveredUnits.length === 0) return [];

    if (coveredUnits.length === 1) {
      return coveredUnits[0].dailyTasks || [];
    }

    // Combine tasks across covered units
    const tasks: DailyHomeworkTask[] = [];
    coveredUnits.forEach((u) => {
      const isReview = u.unitNumber < selectedUnitNumber;
      (u.dailyTasks || []).forEach((t) => {
        tasks.push({
          ...t,
          unitNumber: u.unitNumber,
          unitTag: isReview ? `第${u.unitNumber}单元复习` : `第${u.unitNumber}单元本课`,
        });
      });
    });

    // Limit to 4 questions max for kid's optimal attention span
    return tasks.slice(0, 4);
  }, [coveredUnits, selectedUnitNumber]);

  // Handle Drag / Click to Place an Option into a Question's Slot
  const handlePlaceOptionIntoSlot = (questionId: string, optionIdOrLabel: string) => {
    if (!currentDragExercise?.questions) return;
    const question = currentDragExercise.questions.find((q) => q.id === questionId);
    if (!question) return;

    const option = question.options.find(
      (o) => o.id === optionIdOrLabel || o.label === optionIdOrLabel
    );
    if (!option) return;

    if (option.isCorrect || option.label === question.correctItemLabel) {
      // Correct!
      sound.playCorrect();
      recordHomeworkEvent({
        studentId: currentStudent.id,
        grade: selectedGrade,
        subject: selectedSubject,
        unitNumber: selectedUnitNumber,
        type: 'correct',
      });
      const updated = { ...placedMatches, [questionId]: option.id };
      setPlacedMatches(updated);
      setSelectedOptionForTap(null);

      // Check if all questions in the exercise are completed correctly
      const allDone = currentDragExercise.questions.every((q) => {
        const pId = updated[q.id];
        const pOpt = q.options.find((o) => o.id === pId);
        return pOpt ? pOpt.isCorrect : false;
      });

      if (allDone) {
        setIsDragCompleted(true);
        triggerConfetti();
        sound.playVictory();
        onAddStars(3);
      }
    } else {
      // Wrong distractor!
      sound.playWrong();
      recordHomeworkEvent({
        studentId: currentStudent.id,
        grade: selectedGrade,
        subject: selectedSubject,
        unitNumber: selectedUnitNumber,
        type: 'wrong',
      });
      setDragErrorSlotId(questionId);
      setTimeout(() => setDragErrorSlotId(null), 850);
      setSelectedOptionForTap(null);
    }
  };

  // Remove placed item from question slot
  const handleRemoveFromSlot = (questionId: string) => {
    sound.playTap();
    const updated = { ...placedMatches };
    delete updated[questionId];
    setPlacedMatches(updated);
    setIsDragCompleted(false);
  };

  // Subject Meta Styling
  const subjectThemes: Record<
    HomeworkSubject,
    { title: string; icon: React.ReactNode; color: string; badge: string; bg: string }
  > = {
    chinese: {
      title: '语文',
      icon: <BookOpen className="w-4 h-4" />,
      color: '#ba1a1a',
      badge: 'bg-[#ffdad6] text-[#ba1a1a]',
      bg: 'hover:border-[#ffdad6]',
    },
    math: {
      title: '数学',
      icon: <Calculator className="w-4 h-4" />,
      color: '#006780',
      badge: 'bg-[#e6f7fa] text-[#006780]',
      bg: 'hover:border-[#bae6fd]',
    },
    english: {
      title: '英语',
      icon: <Languages className="w-4 h-4" />,
      color: '#0284c7',
      badge: 'bg-[#eff4ff] text-[#0284c7]',
      bg: 'hover:border-[#c3daf9]',
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-6 pb-28 space-y-4">
      {/* Top Banner: Progress-Linked Adaptive Homework */}
      <div className="bg-gradient-to-r from-[#006780] to-[#0284c7] rounded-3xl p-4 md:p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#ffb800] text-[#6b4c00] text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                个性化智能滚动作业单
              </span>
              <span className="bg-emerald-500/90 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                现阶段教材：上册
              </span>
              <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                温故而知新 · 滚动复习
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold mt-1 tracking-wide">
              {currentStudent.name} 的多学科综合课后作业
            </h2>
            <p className="text-xs md:text-sm text-white/90 mt-0.5">
              当前目标：{GRADE_LABELS[selectedGrade]} · 第 {selectedUnitNumber} 单元
              <span className="ml-1 text-white/80 font-normal">（基于统编版/人教版各年级<strong>上册</strong>课本内容生成）</span>
              {includePreviousUnits && selectedUnitNumber > 1 ? ` · 已融合第 1 ~ ${selectedUnitNumber} 单元综合考点` : ' · 本单元专项巩固'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                sound.playTap();
                setShowStatsModal(true);
              }}
              className="bg-[#ffb800] hover:bg-[#ffa000] text-[#5e4100] active:scale-95 transition-all text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="查看每天每科每单元刷新与答错统计"
            >
              <BarChart2 className="w-3.5 h-3.5 text-[#5e4100]" />
              <span>学情统计</span>
            </button>
            <button
              onClick={() => {
                sound.playTap();
                recordHomeworkEvent({
                  studentId: currentStudent.id,
                  grade: selectedGrade,
                  subject: selectedSubject,
                  unitNumber: selectedUnitNumber,
                  type: 'refresh',
                });
                setExerciseIndex((prev) => prev + 1);
                setTaskAnswers({});
                setSubmittedTasks(false);
              }}
              className="bg-white text-[#006780] hover:bg-[#f0f9ff] active:scale-95 transition-all text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>换一套题库</span>
            </button>
            <button
              onClick={() => {
                sound.playTap();
                onBackToHome();
              }}
              className="bg-white/20 hover:bg-white/30 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>

      {/* 1. Grade & Subject Selector Bar (Clean design, removed "当前" span) */}
      <div className="bg-white rounded-2xl p-2.5 border-2 border-[#dde9ff] cloud-shadow space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Grade tabs: cancelled the selected span tag */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-[#514532] px-2">年级选择:</span>
            {(['3', '4', '5', '6'] as HomeworkGrade[]).map((grade) => {
              const isSelected = selectedGrade === grade;
              const label = GRADE_LABELS[grade];
              return (
                <button
                  key={grade}
                  onClick={() => handleRequestGrade(grade)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#006780] text-white shadow-sm'
                      : 'text-[#514532] hover:bg-[#eff4ff]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Subject Tabs (语文, 数学, 英语) */}
          <div className="flex items-center gap-1 bg-[#f0f4fc] p-1 rounded-xl border border-[#dde9ff]">
            {(['chinese', 'math', 'english'] as HomeworkSubject[]).map((subj) => {
              const meta = subjectThemes[subj];
              const isSelected = selectedSubject === subj;
              return (
                <button
                  key={subj}
                  onClick={() => handleRequestSubject(subj)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#0d1c2f] shadow-xs scale-102 border border-[#dde9ff]'
                      : 'text-[#514532]/80 hover:text-[#0d1c2f]'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Textbook Semester Remark Note */}
        <div className="flex items-center justify-between bg-[#f8fafc] px-3 py-1.5 rounded-xl border border-[#e2e8f0] text-[11px] text-[#64748b]">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#006780]"></span>
            <span>
              <strong className="text-[#334155]">课本册次说明：</strong>当前作业库题目均严格基于人教版/统编版教材<strong>【上册】</strong>（第一学期）课程大纲与单元核心知识点生成。下册题库筹备中。
            </span>
          </div>
          <span className="text-[#0284c7] font-semibold shrink-0">默认：第 1 单元</span>
        </div>
      </div>

      {/* 2. Unit Selector Bar with Cumulative Review Capability */}
      <div className="bg-white rounded-2xl p-3 border-2 border-[#dde9ff] cloud-shadow space-y-2.5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          {/* Unit selector buttons (Unit 1 to 6) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-[#514532] px-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#006780]" />
              <span>单元选择:</span>
            </span>
            {[1, 2, 3, 4, 5, 6].map((uNum) => {
              const isCurrentUnit = selectedUnitNumber === uNum;
              return (
                <button
                  key={uNum}
                  onClick={() => handleRequestUnit(uNum)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer flex items-center gap-1 ${
                    isCurrentUnit
                      ? 'bg-[#006780] text-white shadow-xs scale-102'
                      : 'bg-[#fafbff] text-[#514532] border border-[#dde9ff] hover:bg-[#eff4ff]'
                  }`}
                >
                  <span>第 {uNum} 单元</span>
                </button>
              );
            })}
          </div>

          {/* Cumulative Review Toggle Button */}
          <button
            onClick={() => {
              sound.playTap();
              setIncludePreviousUnits((prev) => !prev);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              includePreviousUnits && selectedUnitNumber > 1
                ? 'bg-[#e6f7fa] text-[#006780] border-[#006780] shadow-xs'
                : 'bg-gray-100 text-gray-600 border-gray-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>
              {includePreviousUnits && selectedUnitNumber > 1
                ? `已包含 1~${selectedUnitNumber} 单元滚动作业`
                : `仅练第 ${selectedUnitNumber} 单元`}
            </span>
          </button>
        </div>

        {/* Cumulative Information Bar */}
        <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl px-3 py-2 text-xs text-[#0369a1] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#0284c7] shrink-0" />
            <span>
              {includePreviousUnits && selectedUnitNumber > 1 ? (
                <>
                  <strong>滚动作业机制已开启：</strong>当前生成【第 {selectedUnitNumber} 单元】作业，已自动融合【第 1 ~ {selectedUnitNumber - 1} 单元】的已学考点进行滚动温故，新旧知识结合！
                </>
              ) : (
                <>
                  <strong>本单元专项强化：</strong>正在进行【第 {selectedUnitNumber} 单元：{currentUnitInfo.title}】的专项练习。
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#006780] font-semibold bg-white/80 px-2 py-0.5 rounded-md border border-[#bae6fd]">
            <span>主题：{currentUnitInfo.themeDesc}</span>
          </div>
        </div>
      </div>

      {/* 3. Daily Unit Learning & Statistics Ribbon (每天每科每单元刷新与答错统计展示) */}
      <div className="bg-gradient-to-r from-[#eff6ff] via-[#f0fdfa] to-[#fff7ed] rounded-2xl p-3 border border-[#bae6fd] flex items-center justify-between gap-3 flex-wrap shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-[#cbd5e1] text-xs font-bold text-[#0f172a] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span>今日学情统计</span>
            <span className="text-[#64748b] font-normal">({todayStr})</span>
          </div>
          <span className="text-xs text-[#334155] font-semibold">
            {GRADE_LABELS[selectedGrade]} · {subjectThemes[selectedSubject].title} · 第 {selectedUnitNumber} 单元：
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-[#e0f2fe] text-[#0369a1] text-xs font-extrabold px-2.5 py-1 rounded-xl border border-[#bae6fd]">
              <RefreshCw className="w-3 h-3 text-[#0284c7]" />
              已刷新 <span className="text-sm font-black">{currentUnitStat.refreshCount}</span> 次
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-xl border ${
                currentUnitStat.wrongCount > 0
                  ? 'bg-[#ffe4e6] text-[#be123c] border-[#fecdd3]'
                  : 'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              已答错 <span className="text-sm font-black">{currentUnitStat.wrongCount}</span> 次
            </span>
            {currentUnitStat.correctCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#15803d] text-xs font-extrabold px-2.5 py-1 rounded-xl border border-[#bbf7d0]">
                <CheckCircle2 className="w-3 h-3 text-[#16a34a]" />
                已答对 {currentUnitStat.correctCount} 次
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            setShowStatsModal(true);
          }}
          className="text-xs font-bold text-[#006780] hover:text-[#005266] bg-white hover:bg-[#f0f9ff] px-3 py-1.5 rounded-xl border border-[#bae6fd] flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
        >
          <BarChart2 className="w-3.5 h-3.5 text-[#006780]" />
          <span>查看全科/全单元学情看板</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#006780]" />
        </button>
      </div>

      {/* Mode Tabs: 🧩 趣味拖拽作业 VS 📝 随堂闯关练一练 */}
      <div className="flex items-center justify-between border-b border-[#dde9ff] pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playTap();
              setActiveTabSub('drag');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeTabSub === 'drag'
                ? 'bg-[#ffb800] text-[#6b4c00] shadow-sm'
                : 'text-[#514532] hover:bg-[#eff4ff]'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            <span>🧩 趣味拖拽作业 (匹配归位)</span>
          </button>
          <button
            onClick={() => {
              sound.playTap();
              setActiveTabSub('daily');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeTabSub === 'daily'
                ? 'bg-[#006780] text-white shadow-sm'
                : 'text-[#514532] hover:bg-[#eff4ff]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>📝 课后巩固小测 (随堂闯关)</span>
          </button>
        </div>

        <span className="text-[11px] text-[#514532]/70 font-semibold hidden sm:inline">
          支持电脑直接拖拽与触屏点击放入
        </span>
      </div>

      {/* Sub-view A: 🧩 Interactive Drag & Drop Homework */}
      {activeTabSub === 'drag' && currentDragExercise && (
        <div className="bg-white rounded-3xl p-4 md:p-6 border-2 border-[#dde9ff] cloud-shadow space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#eff4ff] pb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#ffb800]/20 text-[#7c5800] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#ffd666]">
                  {GRADE_LABELS[selectedGrade]} · {subjectThemes[selectedSubject].title}
                </span>
                {currentDragExercise.isCumulative && (
                  <span className="bg-[#e6f7fa] text-[#006780] text-xs font-bold px-2 py-0.5 rounded-full border border-[#bae6fd]">
                    1~{selectedUnitNumber}单元滚动作业
                  </span>
                )}
                <h3 className="text-base md:text-lg font-bold text-[#0d1c2f]">
                  {currentDragExercise.title}
                </h3>
              </div>
              <p className="text-xs text-[#514532]/80 mt-1">
                {currentDragExercise.instruction}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playTap();
                  setPlacedMatches({});
                  setIsDragCompleted(false);
                }}
                className="text-xs text-[#514532] hover:text-[#006780] font-semibold flex items-center gap-1 bg-[#eff4ff] px-2.5 py-1 rounded-lg cursor-pointer"
                title="清空当前放置"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重置</span>
              </button>
              <button
                onClick={() => {
                  sound.playTap();
                  recordHomeworkEvent({
                    studentId: currentStudent.id,
                    grade: selectedGrade,
                    subject: selectedSubject,
                    unitNumber: selectedUnitNumber,
                    type: 'refresh',
                  });
                  setExerciseIndex((prev) => prev + 1);
                }}
                className="text-xs bg-[#eff4ff] hover:bg-[#dde9ff] text-[#006780] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>换一批</span>
              </button>
            </div>
          </div>

          {/* Drag Success Celebration Banner */}
          {isDragCompleted && (
            <div className="bg-[#f3fee6] border-2 border-[#6fde00] rounded-2xl p-3.5 flex items-center justify-between text-[#2b5d00] animate-fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#6fde00] text-white flex items-center justify-center font-bold text-xl">
                  🎉
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-extrabold">太棒了！全部匹配归位正确！</h4>
                  <p className="text-xs text-[#2b5d00]/80">
                    获得 +3 颗星星奖励 ⭐，已扎实掌握第 1 ~ {selectedUnitNumber} 单元的综合重点！
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playTap();
                  recordHomeworkEvent({
                    studentId: currentStudent.id,
                    grade: selectedGrade,
                    subject: selectedSubject,
                    unitNumber: selectedUnitNumber,
                    type: 'refresh',
                  });
                  setExerciseIndex((prev) => prev + 1);
                }}
                className="bg-[#2b5d00] text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#224b00] active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                挑战下一套
              </button>
            </div>
          )}

          {/* List of Questions: Each with 4 similar options directly below */}
          <div className="space-y-4">
            {(currentDragExercise.questions || []).map((q, qIndex) => {
              const placedOptionId = placedMatches[q.id];
              const placedOption = q.options.find((o) => o.id === placedOptionId);
              const isSolved = placedOption ? placedOption.isCorrect : false;
              const isError = dragErrorSlotId === q.id;
              const isTargetActive = selectedOptionForTap?.questionId === q.id;

              return (
                <div
                  key={q.id}
                  className={`bg-[#fafbff] rounded-2xl p-4 border-2 transition-all space-y-3 ${
                    isSolved
                      ? 'border-[#6fde00]/80 bg-[#f9fff2]'
                      : 'border-[#dde9ff] hover:border-[#bae6fd]'
                  }`}
                >
                  {/* Top Bar: Question index, Unit tag, Sub-label */}
                  <div className="flex justify-between items-center border-b border-[#f0f4fc] pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-5 h-5 rounded-md bg-[#006780] text-white text-xs font-black flex items-center justify-center">
                        {qIndex + 1}
                      </span>
                      {q.unitTag && (
                        <span className="text-[11px] font-bold text-[#006780] bg-[#e6f7fa] px-2 py-0.5 rounded-full border border-[#bae6fd]">
                          {q.unitTag}
                        </span>
                      )}
                      {q.subLabel && (
                        <span className="text-[11px] text-[#7c5800] bg-[#fff8e6] px-2 py-0.5 rounded-full border border-[#ffd666] font-semibold">
                          {q.subLabel}
                        </span>
                      )}
                    </div>

                    {isSolved ? (
                      <span className="text-xs font-bold text-[#2b5d00] bg-[#f3fee6] border border-[#6fde00] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#6fde00]" />
                        <span>已正确归位</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#7c5800] bg-[#fff8e6] px-2 py-0.5 rounded-full border border-[#ffd666]">
                        待拖入解答
                      </span>
                    )}
                  </div>

                  {/* Question Prompt + Drop Target Slot Area */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#dde9ff]">
                    <div className="flex-1">
                      <div className="text-[11px] font-bold text-[#514532]/70 mb-0.5">题目考点：</div>
                      <div className="text-base md:text-lg font-extrabold text-[#0d1c2f] flex items-center gap-2 flex-wrap">
                        <span>{q.label}</span>
                        {q.hint && (
                          <span className="text-xs font-semibold text-[#0284c7] bg-[#eff4ff] px-2 py-0.5 rounded-md border border-[#c3daf9]">
                            {q.hint}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="hidden md:flex items-center text-gray-300">
                      <ChevronRight className="w-5 h-5 text-[#006780]/60" />
                    </div>

                    {/* Drop Target Slot */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const raw = e.dataTransfer.getData('text/plain');
                        try {
                          const data = JSON.parse(raw);
                          if (data && (data.questionId === q.id || data.optionId)) {
                            handlePlaceOptionIntoSlot(q.id, data.optionId);
                          } else {
                            handlePlaceOptionIntoSlot(q.id, raw);
                          }
                        } catch {
                          handlePlaceOptionIntoSlot(q.id, raw);
                        }
                      }}
                      onClick={() => {
                        if (selectedOptionForTap && selectedOptionForTap.questionId === q.id) {
                          handlePlaceOptionIntoSlot(q.id, selectedOptionForTap.optionId);
                        } else if (placedOption) {
                          handleRemoveFromSlot(q.id);
                        }
                      }}
                      className={`min-w-[200px] md:min-w-[240px] min-h-[48px] rounded-xl p-2.5 border-2 transition-all flex items-center justify-between cursor-pointer ${
                        isSolved
                          ? 'bg-[#f3fee6] border-[#6fde00] shadow-xs'
                          : isError
                          ? 'bg-[#ffdad6] border-[#ba1a1a] animate-shake'
                          : isTargetActive
                          ? 'bg-[#eff4ff] border-dashed border-[#0284c7] ring-2 ring-[#0284c7]/40'
                          : 'bg-[#fafbff] border-dashed border-[#006780]/40 hover:border-[#006780]'
                      }`}
                    >
                      {placedOption ? (
                        <div className="w-full flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#6fde00] text-white flex items-center justify-center text-xs">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                            <span className="font-extrabold text-[#2b5d00] text-xs md:text-sm">
                              {placedOption.label}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromSlot(q.id);
                            }}
                            className="text-[11px] text-gray-400 hover:text-red-500 font-semibold px-2 py-0.5 rounded-md hover:bg-white/60 transition-colors cursor-pointer"
                            title="重选"
                          >
                            ✕ 重选
                          </button>
                        </div>
                      ) : (
                        <div className="w-full text-center text-xs text-[#006780] font-semibold flex items-center justify-center gap-1 py-0.5">
                          <Move className="w-3.5 h-3.5" />
                          <span>
                            {isTargetActive ? '👉 点击此处放入选中的选项' : '将下方正确答案拖入此处'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4 Similar Candidate Options Underneath Each Question */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#514532] mb-2">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#ffb800]" />
                        <span>备选答案（4个相似选项，请拖入上方框中）：</span>
                      </span>
                      <span className="text-[11px] text-[#514532]/60 font-medium hidden sm:inline">
                        支持拖拽或直接点击卡片放入
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {q.options.map((opt) => {
                        const isPlacedThis = placedOptionId === opt.id;
                        const isSelectedThis =
                          selectedOptionForTap?.questionId === q.id &&
                          selectedOptionForTap.optionId === opt.id;

                        return (
                          <div
                            key={opt.id}
                            draggable={!isSolved}
                            onDragStart={(e) => {
                              e.dataTransfer.setData(
                                'text/plain',
                                JSON.stringify({ questionId: q.id, optionId: opt.id, label: opt.label })
                              );
                              sound.playTap();
                            }}
                            onClick={() => {
                              sound.playTap();
                              if (isSolved) return;
                              if (isSelectedThis) {
                                setSelectedOptionForTap(null);
                              } else {
                                setSelectedOptionForTap({ questionId: q.id, optionId: opt.id });
                                handlePlaceOptionIntoSlot(q.id, opt.id);
                              }
                            }}
                            className={`p-2.5 md:p-3 rounded-xl border-2 text-xs md:text-sm font-bold text-center transition-all flex items-center justify-center gap-1.5 min-h-[44px] ${
                              isPlacedThis
                                ? 'bg-[#f3fee6] text-[#2b5d00] border-[#6fde00] shadow-xs cursor-default'
                                : isSelectedThis
                                ? 'bg-[#006780] text-white border-[#006780] scale-102 shadow-md ring-2 ring-[#5ed8ff]'
                                : 'bg-white text-[#0d1c2f] border-[#dde9ff] hover:border-[#0284c7] hover:shadow-xs cursor-grab active:cursor-grabbing active:scale-98'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isPlacedThis && <Check className="w-3.5 h-3.5 text-[#2b5d00] shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-view B: 📝 随堂闯关课后小测 (含前置单元复习) */}
      {activeTabSub === 'daily' && (
        <div className="bg-white rounded-3xl p-4 md:p-6 border-2 border-[#dde9ff] cloud-shadow space-y-4">
          <div className="flex justify-between items-center border-b border-[#eff4ff] pb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold px-2 py-0.5 rounded-full">
                  多学科联动 · 随堂小测
                </span>
                {includePreviousUnits && selectedUnitNumber > 1 && (
                  <span className="bg-[#e6f7fa] text-[#006780] text-xs font-bold px-2 py-0.5 rounded-full border border-[#bae6fd]">
                    覆盖 1~{selectedUnitNumber} 单元滚动考点
                  </span>
                )}
                <h3 className="text-base md:text-lg font-bold text-[#0d1c2f]">
                  {GRADE_LABELS[selectedGrade]}
                  {subjectThemes[selectedSubject].title}课后巩固小测
                </h3>
              </div>
              <p className="text-xs text-[#514532]/80 mt-0.5">
                认真读题并选出正确答案，提交后可查看详细名师解析并获取奖励星星！
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[#7c5800] bg-[#fff8e6] px-2.5 py-1 rounded-xl border border-[#ffd666] font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>全对可领 +2 ⭐</span>
              </div>
              <button
                onClick={() => {
                  sound.playTap();
                  recordHomeworkEvent({
                    studentId: currentStudent.id,
                    grade: selectedGrade,
                    subject: selectedSubject,
                    unitNumber: selectedUnitNumber,
                    type: 'refresh',
                  });
                  setTaskAnswers({});
                  setSubmittedTasks(false);
                  setExerciseIndex((prev) => prev + 1);
                }}
                className="text-xs bg-[#eff4ff] hover:bg-[#dde9ff] text-[#006780] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                title="换一套小测考题"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>换一批</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {currentDailyTasks.map((task, qIndex) => {
              const selectedOption = taskAnswers[task.id];
              const isAnswered = selectedOption !== undefined;
              const isCorrect = isAnswered && selectedOption === task.correctIndex;

              return (
                <div
                  key={task.id}
                  className="p-3.5 md:p-4 rounded-2xl bg-[#fafbff] border border-[#dde9ff] space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#006780] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {qIndex + 1}
                      </span>
                      <div>
                        {task.unitTag && (
                          <span className="text-xs font-bold text-[#006780] bg-[#e6f7fa] px-2 py-0.5 rounded border border-[#bae6fd] mr-1.5">
                            {task.unitTag}
                          </span>
                        )}
                        <span className="text-xs font-bold text-[#7c5800] bg-[#fff8e6] px-2 py-0.5 rounded border border-[#ffd666] mr-1.5">
                          {task.title}
                        </span>
                        <span className="text-sm md:text-base font-bold text-[#0d1c2f]">
                          {task.stem}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Options (一行放2个) */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {task.options.map((opt, optIdx) => {
                      const isChosen = selectedOption === optIdx;
                      let optStyle = 'bg-white border-[#dde9ff] hover:border-[#0284c7]';

                      if (submittedTasks && isAnswered) {
                        if (optIdx === task.correctIndex) {
                          optStyle = 'bg-[#f3fee6] border-[#6fde00] text-[#2b5d00] font-bold';
                        } else if (isChosen && !isCorrect) {
                          optStyle = 'bg-[#ffdad6] border-[#ba1a1a] text-[#ba1a1a]';
                        }
                      } else if (isChosen) {
                        optStyle = 'bg-[#eff4ff] border-[#0284c7] text-[#0284c7] font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            sound.playTap();
                            setTaskAnswers((prev) => ({ ...prev, [task.id]: optIdx }));
                          }}
                          className={`p-2.5 rounded-xl border-2 text-xs md:text-sm text-left transition-all cursor-pointer flex items-center justify-between ${optStyle}`}
                        >
                          <span>{opt}</span>
                          {submittedTasks && optIdx === task.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-[#2b5d00]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {submittedTasks && isAnswered && (
                    <div
                      className={`p-2.5 rounded-xl text-xs ${
                        isCorrect
                          ? 'bg-[#f3fee6] text-[#2b5d00] border border-[#6fde00]'
                          : 'bg-[#fff8e6] text-[#7c5800] border border-[#ffd666]'
                      }`}
                    >
                      <span className="font-bold mr-1">
                        {isCorrect ? '✅ 回答正确！' : '❌ 解析：'}
                      </span>
                      <span>{task.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Submit Action */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-[#514532]">
              已完成: {Object.keys(taskAnswers).length} / {currentDailyTasks.length} 题
            </span>

            {!submittedTasks ? (
              <button
                onClick={() => {
                  if (Object.keys(taskAnswers).length < currentDailyTasks.length) {
                    sound.playWrong();
                    alert('请先完成所有题目再提交哦！');
                    return;
                  }

                  // Count correct and wrong answers to record stats per unit
                  let wrongCountThisSubmit = 0;
                  let correctCountThisSubmit = 0;
                  currentDailyTasks.forEach((task) => {
                    const chosen = taskAnswers[task.id];
                    if (chosen !== undefined) {
                      if (chosen === task.correctIndex) {
                        correctCountThisSubmit++;
                      } else {
                        wrongCountThisSubmit++;
                      }
                    }
                  });

                  if (wrongCountThisSubmit > 0) {
                    recordHomeworkEvent({
                      studentId: currentStudent.id,
                      grade: selectedGrade,
                      subject: selectedSubject,
                      unitNumber: selectedUnitNumber,
                      type: 'wrong',
                      count: wrongCountThisSubmit,
                    });
                  }

                  if (correctCountThisSubmit > 0) {
                    recordHomeworkEvent({
                      studentId: currentStudent.id,
                      grade: selectedGrade,
                      subject: selectedSubject,
                      unitNumber: selectedUnitNumber,
                      type: 'correct',
                      count: correctCountThisSubmit,
                    });
                  }

                  sound.playCorrect();
                  setSubmittedTasks(true);
                  triggerConfetti();
                  onAddStars(2);
                }}
                className="bg-[#006780] hover:bg-[#005266] active:scale-95 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                提交作业批改
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playTap();
                  recordHomeworkEvent({
                    studentId: currentStudent.id,
                    grade: selectedGrade,
                    subject: selectedSubject,
                    unitNumber: selectedUnitNumber,
                    type: 'refresh',
                  });
                  setTaskAnswers({});
                  setSubmittedTasks(false);
                  setExerciseIndex((prev) => prev + 1);
                }}
                className="bg-[#ffb800] hover:bg-[#ffa000] active:scale-95 text-[#6b4c00] text-xs md:text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                再练一套新题
              </button>
            )}
          </div>
        </div>
      )}

      {/* Homework Learning & Statistics Modal (全科全单元刷新/答错矩阵分析) */}
      <HomeworkStatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        currentStudent={currentStudent}
        initialGrade={selectedGrade}
        initialSubject={selectedSubject}
        onSelectUnit={(g, s, u) => {
          setShowStatsModal(false);
          setSelectedGrade(g);
          setSelectedSubject(s);
          setSelectedUnitNumber(u);
          setExerciseIndex(0);
          setPlacedMatches({});
          setSelectedOptionForTap(null);
          setTaskAnswers({});
          setSubmittedTasks(false);
        }}
      />
    </div>
  );
};
