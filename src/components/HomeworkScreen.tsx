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
import {
  getUnitHomeworkPackage,
  UnitHomeworkPackage,
  HomeworkQuestionItem,
} from '../data/homework';

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

  // Sync selectedGrade if current student changes
  useEffect(() => {
    if (currentStudent?.gradeLevel) {
      const validGrades: HomeworkGrade[] = ['3', '4', '5', '6'];
      if (validGrades.includes(currentStudent.gradeLevel as HomeworkGrade)) {
        setSelectedGrade(currentStudent.gradeLevel as HomeworkGrade);
      }
    }
  }, [currentStudent?.gradeLevel]);

  // 2. Subject Selection (语文 vs 数学 vs 英语)
  const [selectedSubject, setSelectedSubject] = useState<HomeworkSubject>('chinese');

  // 3. Unit Selection (Unit 1 ~ Unit 6) - 默认第 1 单元
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<number>(1);

  // 4. Drag & Drop state
  const [exerciseIndex, setExerciseIndex] = useState(0);
  // questionId -> chosen optionId
  const [placedMatches, setPlacedMatches] = useState<Record<string, string>>({});
  // Selected option when using click-to-place
  const [selectedOptionForTap, setSelectedOptionForTap] = useState<{ questionId: string; optionId: string } | null>(null);
  const [dragErrorSlotId, setDragErrorSlotId] = useState<string | null>(null);
  const [isDragCompleted, setIsDragCompleted] = useState<boolean>(false);

  // 5. Unit Homework tasks state: questionId -> chosenOptionIndex
  const [taskAnswers, setTaskAnswers] = useState<Record<string, number>>({});
  const [submittedTasks, setSubmittedTasks] = useState<boolean>(false);
  const [submitScoreInfo, setSubmitScoreInfo] = useState<{
    correctCount: number;
    wrongCount: number;
    totalCount: number;
    scorePercent: number;
  } | null>(null);
  // Default to daily unit homework: 10-15 practice questions + 1 extension question
  const [activeTabSub, setActiveTabSub] = useState<'drag' | 'daily'>('daily');

  // 6. Statistics Modal & Real-time tracker for each day, subject, and unit
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
    setSubmitScoreInfo(null);
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
    setSubmitScoreInfo(null);
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
    setSubmitScoreInfo(null);
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

  // Current Unit-specific homework package (contains 10-15 practice questions + 1 extension question)
  const currentUnitPackage = useMemo((): UnitHomeworkPackage | undefined => {
    return getUnitHomeworkPackage(selectedGrade, selectedSubject, selectedUnitNumber);
  }, [selectedGrade, selectedSubject, selectedUnitNumber]);

  // Practice questions (10 questions)
  const practiceQuestions = useMemo((): HomeworkQuestionItem[] => {
    return currentUnitPackage?.questions || [];
  }, [currentUnitPackage]);

  // Extension question (1 question)
  const extensionQuestion = useMemo((): HomeworkQuestionItem | undefined => {
    return currentUnitPackage?.extensionQuestion;
  }, [currentUnitPackage]);

  // All questions in this unit's package (10 practice + 1 extension = 11 total)
  const allUnitQuestions = useMemo((): HomeworkQuestionItem[] => {
    if (!currentUnitPackage) return [];
    return [
      ...currentUnitPackage.questions,
      ...(currentUnitPackage.extensionQuestion ? [currentUnitPackage.extensionQuestion] : []),
    ];
  }, [currentUnitPackage]);

  // Current selected unit info
  const currentUnitInfo = useMemo(() => {
    if (currentUnitPackage) {
      return {
        unitNumber: currentUnitPackage.unitNumber,
        title: currentUnitPackage.unitTitle,
        themeDesc: currentUnitPackage.themeDesc,
      };
    }
    return (
      availableUnits.find((u) => u.unitNumber === selectedUnitNumber) ||
      availableUnits[0] || {
        unitNumber: 1,
        title: `第${selectedUnitNumber}单元`,
        themeDesc: '核心课程重难点',
      }
    );
  }, [availableUnits, currentUnitPackage, selectedUnitNumber]);

  // Strictly only target the selected unit (no cross-unit mixing)
  const coveredUnits = useMemo(() => {
    return availableUnits.filter((u) => u.unitNumber === selectedUnitNumber);
  }, [availableUnits, selectedUnitNumber]);

  // Reset drag states and tasks on grade, subject, unit, or exerciseIndex change
  useEffect(() => {
    setPlacedMatches({});
    setSelectedOptionForTap(null);
    setIsDragCompleted(false);
    setTaskAnswers({});
    setSubmittedTasks(false);
    setSubmitScoreInfo(null);
  }, [selectedGrade, selectedSubject, selectedUnitNumber, exerciseIndex]);

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

  // ==================== Unit-Specific Homework Tasks (10 Practice + 1 Extension) ====================
  const currentUnitTasks = useMemo((): HomeworkQuestionItem[] => {
    if (allUnitQuestions.length > 0) {
      return allUnitQuestions;
    }
    // Fallback if ever needed
    if (coveredUnits.length === 1 && coveredUnits[0].dailyTasks) {
      return coveredUnits[0].dailyTasks.map((t) => ({
        id: t.id,
        type: 'single',
        title: t.title,
        stem: t.stem,
        options: t.options,
        correctIndex: t.correctIndex,
        explanation: t.explanation,
        unitTag: `第${selectedUnitNumber}单元`,
      }));
    }
    return [];
  }, [allUnitQuestions, coveredUnits, selectedUnitNumber]);

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
                单元专项巩固作业
              </span>
              <span className="bg-emerald-500/90 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                现阶段教材：上册
              </span>
              <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                10道精选题 + 1道素养拓展题
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold mt-1 tracking-wide">
              {currentStudent.name} 的多学科课后作业
            </h2>
            <p className="text-xs md:text-sm text-white/90 mt-0.5">
              当前目标：{GRADE_LABELS[selectedGrade]} · {subjectThemes[selectedSubject].title} · 第 {selectedUnitNumber} 单元
              <span className="ml-1 text-white/80 font-normal">（专练本单元：包含 10 道课时基础巩固题 + 1 道培优拓展提升题）</span>
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

      {/* 2. Unit Selector Bar with Unit-Specific Practice Focus */}
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

          <div className="text-xs font-bold text-[#006780] bg-[#e6f7fa] px-3 py-1.5 rounded-xl border border-[#bae6fd] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>专项作业：仅出第 {selectedUnitNumber} 单元考点</span>
          </div>
        </div>

        {/* Unit Detail Bar */}
        <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl px-3 py-2 text-xs text-[#0369a1] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#0284c7] shrink-0" />
            <span>
              <strong>本单元专属精练：</strong>【第 {selectedUnitNumber} 单元：{currentUnitInfo.title}】，已出 10 道课时巩固练习题 + 1 道素养拔高拓展题，无其他单元交叉干扰。
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

      {/* Mode Tabs: 📝 单元练习作业 (10-15题 + 1道拓展题) VS 🧩 趣味拖拽作业 */}
      <div className="flex items-center justify-between border-b border-[#dde9ff] pb-2">
        <div className="flex items-center gap-2">
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
            <span>📝 单元专项作业 (10题练习 + 1道拓展题)</span>
          </button>
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
            <span>🧩 趣味连线/拖拽 (课标考点)</span>
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

      {/* Sub-view B: 📝 单元专项作业 (10-15道练习题 + 1道拓展题) */}
      {activeTabSub === 'daily' && (
        <div className="bg-white rounded-3xl p-4 md:p-6 border-2 border-[#dde9ff] cloud-shadow space-y-5">
          {/* Unit Homework Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#eff4ff] pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#e6f7fa] text-[#006780] text-xs font-black px-2.5 py-0.5 rounded-full border border-[#bae6fd]">
                  {GRADE_LABELS[selectedGrade]} · {subjectThemes[selectedSubject].title}
                </span>
                <span className="bg-[#006780] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  第 {selectedUnitNumber} 单元专练
                </span>
                <span className="bg-[#fff8e6] text-[#7c5800] text-xs font-bold px-2 py-0.5 rounded-full border border-[#ffd666]">
                  共 {currentUnitTasks.length} 题（10题基础 + 1题拔高）
                </span>
              </div>
              <h3 className="text-base md:text-lg font-extrabold text-[#0d1c2f] mt-1">
                【{currentUnitInfo.title}】单元核心考点精练
              </h3>
              <p className="text-xs text-[#514532]/80 mt-0.5">
                严格锁定本单元教学目标出题，无其他单元交叉。包含 10 道基础练习题和 1 道单元素养拓展题。
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-[#7c5800] bg-[#fff8e6] px-2.5 py-1.5 rounded-xl border border-[#ffd666] font-bold">
                <Trophy className="w-3.5 h-3.5 text-[#ffb800]" />
                <span>全对可领 +5 ⭐</span>
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
                  setSubmitScoreInfo(null);
                }}
                className="text-xs bg-[#eff4ff] hover:bg-[#dde9ff] active:scale-95 text-[#006780] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-all border border-[#bae6fd]"
                title="重置当前单元作业做题状态"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>清空重做</span>
              </button>
            </div>
          </div>

          {/* Quick Jump Question Navigation Bar */}
          <div className="bg-[#f8fafc] p-2.5 rounded-2xl border border-[#e2e8f0] flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-[#64748b] px-1">答题导航:</span>
              {currentUnitTasks.map((t, idx) => {
                const isAnswered = taskAnswers[t.id] !== undefined;
                const isCorrect = submittedTasks && taskAnswers[t.id] === t.correctIndex;
                const isWrong = submittedTasks && isAnswered && taskAnswers[t.id] !== t.correctIndex;
                const isExtension = t.type === 'extension' || idx >= 10;

                let btnStyle = 'bg-white text-[#475569] border-[#cbd5e1] hover:border-[#0284c7]';
                if (submittedTasks) {
                  if (isCorrect) {
                    btnStyle = 'bg-[#dcfce7] text-[#15803d] border-[#86efac] font-bold';
                  } else if (isWrong) {
                    btnStyle = 'bg-[#ffe4e6] text-[#be123c] border-[#fda4af] font-bold';
                  }
                } else if (isAnswered) {
                  btnStyle = 'bg-[#006780] text-white border-[#006780] font-bold';
                }

                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      const el = document.getElementById(`homework-q-${t.id}`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className={`w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${btnStyle} ${
                      isExtension ? 'ring-2 ring-[#f59e0b]/40' : ''
                    }`}
                    title={isExtension ? '第11题：拔高拓展题' : `第${idx + 1}题`}
                  >
                    {isExtension ? '★' : idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-bold text-[#006780]">
              进度：{Object.keys(taskAnswers).length} / {currentUnitTasks.length} 题
            </div>
          </div>

          {/* Submitted Score Summary Card */}
          {submittedTasks && submitScoreInfo && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#eff6ff] via-[#f0fdf4] to-[#fefce8] border-2 border-[#86efac] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#22c55e] text-white flex flex-col items-center justify-center shadow-xs">
                  <span className="text-xs font-medium">得分</span>
                  <span className="text-lg font-black leading-none">{submitScoreInfo.scorePercent}</span>
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#0f172a] flex items-center gap-2">
                    <span>作业批改完成！</span>
                    {submitScoreInfo.scorePercent === 100 && (
                      <span className="text-xs bg-[#ffb800] text-[#78350f] px-2 py-0.5 rounded-full font-black">
                        满分通关 🏆
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-[#334155] mt-0.5">
                    共 {submitScoreInfo.totalCount} 道题，正确{' '}
                    <strong className="text-[#16a34a]">{submitScoreInfo.correctCount}</strong> 道，错误{' '}
                    <strong className="text-[#dc2626]">{submitScoreInfo.wrongCount}</strong> 道。已记录学情并奖励星星！
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playTap();
                    setTaskAnswers({});
                    setSubmittedTasks(false);
                    setSubmitScoreInfo(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] shadow-2xs transition-all cursor-pointer"
                >
                  重做本单元
                </button>
                {selectedUnitNumber < 6 && (
                  <button
                    onClick={() => {
                      handleRequestUnit(selectedUnitNumber + 1);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#006780] hover:bg-[#005266] text-white shadow-xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>下一单元作业</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Question List */}
          <div className="space-y-4">
            {/* Section 1: Practice Questions (10 questions) */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#f1f5f9]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006780]" />
              <h4 className="text-sm font-extrabold text-[#0f172a]">
                第一部分：单元基础巩固练习（共 10 题）
              </h4>
              <span className="text-xs text-[#64748b] font-normal">本单元重难点针对性夯实</span>
            </div>

            {practiceQuestions.map((task, qIndex) => {
              const selectedOption = taskAnswers[task.id];
              const isAnswered = selectedOption !== undefined;
              const isCorrect = isAnswered && selectedOption === task.correctIndex;

              return (
                <div
                  id={`homework-q-${task.id}`}
                  key={task.id}
                  className="p-3.5 md:p-4 rounded-2xl bg-[#fafbff] border border-[#dde9ff] space-y-3 transition-all hover:border-[#bae6fd]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-[#006780] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        {qIndex + 1}
                      </span>
                      <span className="text-sm md:text-base font-bold text-[#0d1c2f] leading-relaxed pt-0.5">
                        {task.stem}
                      </span>
                    </div>
                  </div>

                  {/* Options (一行放2个选项) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {task.options.map((opt, optIdx) => {
                      const isChosen = selectedOption === optIdx;
                      const optLabel = String.fromCharCode(65 + optIdx); // A, B, C, D
                      let optStyle = 'bg-white border-[#dde9ff] hover:border-[#0284c7] text-[#1e293b]';

                      if (submittedTasks && isAnswered) {
                        if (optIdx === task.correctIndex) {
                          optStyle = 'bg-[#f0fdf4] border-[#22c55e] text-[#15803d] font-bold';
                        } else if (isChosen && !isCorrect) {
                          optStyle = 'bg-[#fef2f2] border-[#ef4444] text-[#b91c1c]';
                        }
                      } else if (isChosen) {
                        optStyle = 'bg-[#e0f2fe] border-[#0284c7] text-[#0369a1] font-bold shadow-2xs';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={submittedTasks}
                          onClick={() => {
                            sound.playTap();
                            setTaskAnswers((prev) => ({ ...prev, [task.id]: optIdx }));
                          }}
                          className={`p-3 rounded-xl border-2 text-xs md:text-sm text-left transition-all cursor-pointer flex items-center justify-between ${optStyle} ${
                            submittedTasks ? 'cursor-default' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-black/5 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                              {optLabel}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {submittedTasks && optIdx === task.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 ml-1" />
                          )}
                          {submittedTasks && isChosen && !isCorrect && (
                            <AlertCircle className="w-4 h-4 text-[#dc2626] shrink-0 ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {submittedTasks && isAnswered && (
                    <div
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        isCorrect
                          ? 'bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]'
                          : 'bg-[#fffbeb] text-[#92400e] border border-[#fde68a]'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                            <span>回答正确！</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-[#d97706]" />
                            <span>错题解析：正确答案是【{String.fromCharCode(65 + task.correctIndex)}】</span>
                          </>
                        )}
                      </div>
                      <div className="leading-relaxed pl-5.5 text-slate-700">
                        {task.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Section 2: Extension Question (1 question) */}
            {extensionQuestion && (
              <div className="pt-3">
                <div className="flex items-center gap-2 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <h4 className="text-sm font-extrabold text-[#92400e]">
                    第二部分：单元素养拔高拓展题（共 1 题）
                  </h4>
                  <span className="text-xs bg-[#fef3c7] text-[#b45309] font-bold px-2 py-0.5 rounded border border-[#fde68a]">
                    思维提升 · 课标核心素养
                  </span>
                </div>

                <div
                  id={`homework-q-${extensionQuestion.id}`}
                  className="p-4 rounded-2xl bg-gradient-to-br from-[#fffbeb] to-[#fefce8] border-2 border-[#f59e0b]/60 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-[#f59e0b] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        ★
                      </span>
                      <span className="text-sm md:text-base font-extrabold text-[#451a03] leading-relaxed pt-0.5">
                        {extensionQuestion.stem}
                      </span>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {extensionQuestion.options.map((opt, optIdx) => {
                      const isChosen = taskAnswers[extensionQuestion.id] === optIdx;
                      const isAnswered = taskAnswers[extensionQuestion.id] !== undefined;
                      const isCorrect = isAnswered && isChosen && optIdx === extensionQuestion.correctIndex;
                      const optLabel = String.fromCharCode(65 + optIdx);
                      let optStyle = 'bg-white border-[#fde68a] hover:border-[#f59e0b] text-[#451a03]';

                      if (submittedTasks && isAnswered) {
                        if (optIdx === extensionQuestion.correctIndex) {
                          optStyle = 'bg-[#f0fdf4] border-[#22c55e] text-[#15803d] font-bold';
                        } else if (isChosen && !isCorrect) {
                          optStyle = 'bg-[#fef2f2] border-[#ef4444] text-[#b91c1c]';
                        }
                      } else if (isChosen) {
                        optStyle = 'bg-[#fef3c7] border-[#d97706] text-[#78350f] font-bold shadow-2xs';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={submittedTasks}
                          onClick={() => {
                            sound.playTap();
                            setTaskAnswers((prev) => ({ ...prev, [extensionQuestion.id]: optIdx }));
                          }}
                          className={`p-3 rounded-xl border-2 text-xs md:text-sm text-left transition-all cursor-pointer flex items-center justify-between ${optStyle} ${
                            submittedTasks ? 'cursor-default' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-800 shrink-0">
                              {optLabel}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {submittedTasks && optIdx === extensionQuestion.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 ml-1" />
                          )}
                          {submittedTasks && isChosen && !isCorrect && (
                            <AlertCircle className="w-4 h-4 text-[#dc2626] shrink-0 ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {submittedTasks && taskAnswers[extensionQuestion.id] !== undefined && (
                    <div
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        taskAnswers[extensionQuestion.id] === extensionQuestion.correctIndex
                          ? 'bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]'
                          : 'bg-[#fffbeb] text-[#92400e] border border-[#fde68a]'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        {taskAnswers[extensionQuestion.id] === extensionQuestion.correctIndex ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                            <span>恭喜答对拔高拓展题！思维能力极强 🌟</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-[#d97706]" />
                            <span>拓展题名师解析：正确答案是【{String.fromCharCode(65 + extensionQuestion.correctIndex)}】</span>
                          </>
                        )}
                      </div>
                      <div className="leading-relaxed pl-5.5 text-slate-700">
                        {extensionQuestion.explanation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Submit Action */}
          <div className="flex justify-between items-center pt-3 border-t border-[#eff4ff]">
            <span className="text-xs font-semibold text-[#514532]">
              已答：{Object.keys(taskAnswers).length} / {currentUnitTasks.length} 题
            </span>

            {!submittedTasks ? (
              <button
                onClick={() => {
                  const answeredCount = Object.keys(taskAnswers).length;
                  if (answeredCount < currentUnitTasks.length) {
                    sound.playWrong();
                    alert(`还有 ${currentUnitTasks.length - answeredCount} 道题未作答，请全部完成后再提交批改哦！`);
                    return;
                  }

                  // Count correct and wrong answers
                  let wrongCountThisSubmit = 0;
                  let correctCountThisSubmit = 0;
                  currentUnitTasks.forEach((task) => {
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

                  const scorePercent = Math.round((correctCountThisSubmit / currentUnitTasks.length) * 100);
                  setSubmitScoreInfo({
                    correctCount: correctCountThisSubmit,
                    wrongCount: wrongCountThisSubmit,
                    totalCount: currentUnitTasks.length,
                    scorePercent,
                  });

                  sound.playVictory();
                  setSubmittedTasks(true);
                  triggerConfetti();

                  const starReward = scorePercent >= 90 ? 5 : scorePercent >= 60 ? 3 : 2;
                  onAddStars(starReward);
                }}
                className="bg-[#006780] hover:bg-[#005266] active:scale-95 text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>提交本单元作业批改</span>
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
                  setSubmitScoreInfo(null);
                }}
                className="bg-[#ffb800] hover:bg-[#ffa000] active:scale-95 text-[#6b4c00] text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>再做一次本单元练习</span>
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
