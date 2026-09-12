import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  BookOpen,
  Calculator,
  Compass,
  FileCheck2,
  RotateCcw,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Check,
  Star,
  Flame,
  Filter,
  Lock,
  Unlock,
  KeyRound,
  AlertCircle,
  Send,
} from 'lucide-react';
import { GradeLevel, StudentProfile } from '../types';
import { ExamPaper, ExamQuestion, ExamSubject } from '../data/exam/types';
import { getExamPaper } from '../data/exam/examPapers';
import { sound, triggerConfetti } from '../utils/speech';
import {
  ExamSubmissionRecord,
  getExamSubmission,
  saveExamSubmission,
  clearExamSubmission,
} from '../utils/examStorage';

interface ExamScreenProps {
  initialGrade: GradeLevel;
  currentStudent: StudentProfile;
  onBackToHome: () => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  initialGrade,
  currentStudent,
  onBackToHome,
}) => {
  // Selected grade and subject
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  const [selectedSubject, setSelectedSubject] = useState<ExamSubject>('chinese');

  // Exam mode: 'practice' (instant feedback) vs 'exam' (submit to score)
  const [examMode, setExamMode] = useState<'practice' | 'exam'>('exam');

  // Answers state: questionId -> option index
  const [answers, setAnswers] = useState<Record<string, number>>({});
  // Submitted state for exam mode
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionRecord, setSubmissionRecord] = useState<ExamSubmissionRecord | null>(null);

  // Modals
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState<boolean>(false);
  const [showRetakeModal, setShowRetakeModal] = useState<boolean>(false);
  const [retakePasswordInput, setRetakePasswordInput] = useState<string>('');
  const [retakePasswordError, setRetakePasswordError] = useState<string>('');
  const [retakeSuccessToast, setRetakeSuccessToast] = useState<string>('');

  const [showExplanationAlways, setShowExplanationAlways] = useState<boolean>(false);

  // Pagination / Filter: 'all' | 'ext' | number for section
  const [activeSectionFilter, setActiveSectionFilter] = useState<number | 'all' | 'ext'>('all');
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');
  const pageSize = 10;

  // Floating sheet toggle
  const [showAnswerSheet, setShowAnswerSheet] = useState<boolean>(false);

  // Marked understood mistakes (stored locally in session)
  const [understoodMistakeIds, setUnderstoodMistakeIds] = useState<Set<string>>(new Set());

  // Load paper
  const paper: ExamPaper = useMemo(() => {
    return getExamPaper(selectedGrade, selectedSubject);
  }, [selectedGrade, selectedSubject]);

  // Load existing submission when grade, subject, or student changes
  useEffect(() => {
    const existing = getExamSubmission(currentStudent.id, selectedGrade, selectedSubject);
    if (existing) {
      setSubmissionRecord(existing);
      setAnswers(existing.answers);
      setIsSubmitted(true);
    } else {
      setSubmissionRecord(null);
      setAnswers({});
      setIsSubmitted(false);
    }
    setPageIndex(0);
    setJumpPageInput('1');
    setShowResultModal(false);
    setShowConfirmSubmitModal(false);
    setShowRetakeModal(false);
  }, [currentStudent.id, selectedGrade, selectedSubject]);

  // Reset answers when grade or subject changes
  const handleGradeChange = (g: GradeLevel) => {
    if (g === selectedGrade) return;
    sound.playTap();
    setSelectedGrade(g);
  };

  const handleSubjectChange = (s: ExamSubject) => {
    if (s === selectedSubject) return;
    sound.playTap();
    setSelectedSubject(s);
  };

  // Filtered questions to display
  const displayedQuestions = useMemo(() => {
    if (activeSectionFilter === 'ext') {
      return paper.extensionQuestions;
    }
    if (activeSectionFilter === 'all') {
      return paper.questions;
    }
    const sec = paper.sections[activeSectionFilter];
    if (!sec) return paper.questions;
    return paper.questions.filter(
      (q) => q.number >= sec.startNum && q.number <= sec.endNum
    );
  }, [paper, activeSectionFilter]);

  // Paginated questions if activeSectionFilter === 'all'
  const pagedQuestions = useMemo(() => {
    if (activeSectionFilter !== 'all') {
      return displayedQuestions;
    }
    const start = pageIndex * pageSize;
    return displayedQuestions.slice(start, start + pageSize);
  }, [displayedQuestions, activeSectionFilter, pageIndex]);

  const totalPages = useMemo(() => {
    if (activeSectionFilter !== 'all') return 1;
    return Math.ceil(displayedQuestions.length / pageSize);
  }, [displayedQuestions, activeSectionFilter]);

  // Scroll to questions helper
  const scrollToQuestionsTop = () => {
    const el = document.getElementById('exam-questions-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle direct page jump
  const handleJumpToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      sound.playTap();
      setPageIndex(pageNumber - 1);
      setJumpPageInput(String(pageNumber));
      scrollToQuestionsTop();
    }
  };

  // Handle Next Page on any page
  const handleNextPage = () => {
    sound.playTap();
    if (activeSectionFilter === 'all') {
      if (pageIndex < totalPages - 1) {
        const nextP = pageIndex + 1;
        setPageIndex(nextP);
        setJumpPageInput(String(nextP + 1));
        scrollToQuestionsTop();
      } else {
        // From last page (Page 10), navigate to extension questions
        setActiveSectionFilter('ext');
        scrollToQuestionsTop();
      }
    } else if (activeSectionFilter === 'ext') {
      // From extension questions, scroll to submit section
      const submitEl =
        document.getElementById('submit-exam-end-button') ||
        document.getElementById('submit-exam-button');
      if (submitEl) {
        submitEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (typeof activeSectionFilter === 'number') {
      if (activeSectionFilter < paper.sections.length - 1) {
        setActiveSectionFilter(activeSectionFilter + 1);
        scrollToQuestionsTop();
      } else {
        setActiveSectionFilter('ext');
        scrollToQuestionsTop();
      }
    }
  };

  // Handle Prev Page on any page
  const handlePrevPage = () => {
    sound.playTap();
    if (activeSectionFilter === 'all') {
      if (pageIndex > 0) {
        const prevP = pageIndex - 1;
        setPageIndex(prevP);
        setJumpPageInput(String(prevP + 1));
        scrollToQuestionsTop();
      }
    } else if (activeSectionFilter === 'ext') {
      setActiveSectionFilter('all');
      setPageIndex(totalPages - 1);
      setJumpPageInput(String(totalPages));
      scrollToQuestionsTop();
    } else if (typeof activeSectionFilter === 'number') {
      if (activeSectionFilter > 0) {
        setActiveSectionFilter(activeSectionFilter - 1);
        scrollToQuestionsTop();
      } else {
        setActiveSectionFilter('all');
        setPageIndex(0);
        setJumpPageInput('1');
        scrollToQuestionsTop();
      }
    }
  };

  // Handle answering
  const handleSelectOption = (questionId: string, optIdx: number, isExtension = false) => {
    // If already submitted (locked), cannot modify!
    if (isSubmitted) return;

    sound.playTap();
    setAnswers((prev) => ({ ...prev, [questionId]: optIdx }));

    // If in practice mode, play feedback sound immediately
    if (examMode === 'practice') {
      const q = [...paper.questions, ...paper.extensionQuestions].find(
        (item) => item.id === questionId
      );
      if (q) {
        if (optIdx === q.correctAnswer) {
          sound.playCorrect();
        }
      }
    }
  };

  // Score statistics
  const stats = useMemo(() => {
    let standardCorrect = 0;
    let standardAnswered = 0;

    paper.questions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        standardAnswered++;
        if (answers[q.id] === q.correctAnswer) {
          standardCorrect += q.points;
        }
      }
    });

    let extCorrect = 0;
    let extAnswered = 0;
    paper.extensionQuestions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        extAnswered++;
        if (answers[q.id] === q.correctAnswer) {
          extCorrect++;
        }
      }
    });

    return {
      standardCorrect,
      standardAnswered,
      totalStandard: paper.questionsCount,
      extCorrect,
      extAnswered,
      totalExt: paper.extensionCount,
      percentage: Math.round((standardCorrect / paper.totalScore) * 100),
    };
  }, [paper, answers]);

  // Wrong questions list (when submitted)
  const wrongQuestionsList = useMemo(() => {
    if (!isSubmitted) return [];
    const list: {
      question: ExamQuestion;
      studentAnswerIndex: number | undefined;
      studentAnswerText: string;
      correctAnswerText: string;
      isExtension?: boolean;
    }[] = [];

    // Standard 100 questions
    paper.questions.forEach((q) => {
      const studentAns = answers[q.id];
      if (studentAns !== q.correctAnswer) {
        list.push({
          question: q,
          studentAnswerIndex: studentAns,
          studentAnswerText:
            studentAns !== undefined
              ? `${String.fromCharCode(65 + studentAns)}. ${q.options[studentAns] || ''}`
              : '未作答 (按错误计 0 分)',
          correctAnswerText: `${String.fromCharCode(65 + q.correctAnswer)}. ${
            q.options[q.correctAnswer] || ''
          }`,
          isExtension: false,
        });
      }
    });

    // Extension questions
    paper.extensionQuestions.forEach((eq) => {
      const studentAns = answers[eq.id];
      if (studentAns !== undefined && studentAns !== eq.correctAnswer) {
        list.push({
          question: eq,
          studentAnswerIndex: studentAns,
          studentAnswerText: `${String.fromCharCode(65 + studentAns)}. ${
            eq.options[studentAns] || ''
          }`,
          correctAnswerText: `${String.fromCharCode(65 + eq.correctAnswer)}. ${
            eq.options[eq.correctAnswer] || ''
          }`,
          isExtension: true,
        });
      }
    });

    return list;
  }, [paper, answers, isSubmitted]);

  // Trigger submission prompt or direct submission
  const handleInitiateSubmit = () => {
    if (isSubmitted) return;
    sound.playTap();
    const unansweredCount = paper.questionsCount - stats.standardAnswered;
    if (unansweredCount > 0) {
      setShowConfirmSubmitModal(true);
    } else {
      executeSubmit();
    }
  };

  // Execute and persist submission
  const executeSubmit = () => {
    const wrongIds = paper.questions
      .filter((q) => answers[q.id] !== q.correctAnswer)
      .map((q) => q.id);

    const record: ExamSubmissionRecord = {
      studentId: currentStudent.id,
      grade: selectedGrade,
      subject: selectedSubject,
      score: stats.standardCorrect,
      totalScore: paper.totalScore,
      answers,
      submittedAt: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      standardCorrect: stats.standardCorrect,
      totalStandard: paper.questionsCount,
      extCorrect: stats.extCorrect,
      totalExt: paper.extensionCount,
      wrongQuestionIds: wrongIds,
    };

    saveExamSubmission(record);
    setSubmissionRecord(record);
    setIsSubmitted(true);
    setShowConfirmSubmitModal(false);
    setShowResultModal(true);

    if (stats.percentage >= 80) {
      triggerConfetti();
      sound.playVictory();
    } else {
      sound.playCorrect();
    }
  };

  // Retake authorization with password '2026'
  const handleRetakeConfirm = () => {
    if (retakePasswordInput.trim() === '2026') {
      sound.playTap();
      clearExamSubmission(currentStudent.id, selectedGrade, selectedSubject);
      setSubmissionRecord(null);
      setAnswers({});
      setIsSubmitted(false);
      setShowRetakeModal(false);
      setRetakePasswordInput('');
      setRetakePasswordError('');
      setPageIndex(0);
      setJumpPageInput('1');
      sound.playCorrect();
      setRetakeSuccessToast('已成功解锁重考！试卷已重新重置，请开始作答。');
      setTimeout(() => setRetakeSuccessToast(''), 3500);
    } else {
      sound.playWrong();
      setRetakePasswordError('密码错误！请输入重考授权密码：2026');
    }
  };

  // Jump to specific question
  const handleJumpToQuestion = (qNumber: number, isExt = false) => {
    sound.playTap();
    setShowAnswerSheet(false);

    if (isExt) {
      setActiveSectionFilter('ext');
    } else {
      setActiveSectionFilter('all');
      const targetPage = Math.floor((qNumber - 1) / pageSize);
      setPageIndex(targetPage);
      setJumpPageInput(String(targetPage + 1));
    }

    // Scroll to question element
    setTimeout(() => {
      const el = document.getElementById(`question-card-${qNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Scroll to bottom wrong questions section
  const scrollToWrongQuestions = () => {
    setShowResultModal(false);
    const el = document.getElementById('wrong-questions-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Grade badge color
  const subjectStyles: Record<
    ExamSubject,
    {
      gradient: string;
      bgLight: string;
      border: string;
      text: string;
      accent: string;
      icon: React.ReactNode;
    }
  > = {
    chinese: {
      gradient: 'from-[#ff4757] to-[#ff6b81]',
      bgLight: 'bg-[#fff5f5]',
      border: 'border-[#ffdada]',
      text: 'text-[#d63031]',
      accent: 'bg-[#ff4757]',
      icon: <BookOpen className="w-4 h-4" />,
    },
    math: {
      gradient: 'from-[#00b894] to-[#00cec9]',
      bgLight: 'bg-[#e6faf5]',
      border: 'border-[#b2f2e5]',
      text: 'text-[#00897b]',
      accent: 'bg-[#00b894]',
      icon: <Calculator className="w-4 h-4" />,
    },
    english: {
      gradient: 'from-[#0984e3] to-[#74b9ff]',
      bgLight: 'bg-[#edf6ff]',
      border: 'border-[#c7e3ff]',
      text: 'text-[#0984e3]',
      accent: 'bg-[#0984e3]',
      icon: <Compass className="w-4 h-4" />,
    },
  };

  const currentSubjectStyle = subjectStyles[selectedSubject];

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 space-y-4 pb-32">
      {/* Toast notification */}
      {retakeSuccessToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#2b5d00] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-lime-300" />
          <span>{retakeSuccessToast}</span>
        </div>
      )}

      {/* 1. Header Bar with Back Button & Title */}
      <div className="bg-white rounded-3xl p-4 md:p-5 border-2 border-[#dde9ff] cloud-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="exam-back-home-btn"
            onClick={() => {
              sound.playTap();
              onBackToHome();
            }}
            className="p-2.5 rounded-2xl bg-[#f0f4fc] hover:bg-[#e2eaf9] text-[#193052] transition-all cursor-pointer flex items-center gap-1 text-xs md:text-sm font-bold active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#ff4757] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Award className="w-3.5 h-3.5" />
                第一单元满分卷
              </span>
              <h1 className="text-lg md:text-xl font-black text-[#0d1c2f]">
                {paper.gradeLabel} · {paper.subjectLabel}
              </h1>
            </div>
            <p className="text-xs text-[#514532]/80 mt-0.5">
              满分 100 分 · 共 100 道精选试题 + 2 道拔高思维拓展题
            </p>
          </div>
        </div>

        {/* Status / Retake Button in Header */}
        <div className="flex items-center gap-2">
          {isSubmitted ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>已考锁定 ({stats.standardCorrect}分)</span>
              </div>
              <button
                id="header-retake-btn"
                onClick={() => {
                  sound.playTap();
                  setRetakePasswordInput('');
                  setRetakePasswordError('');
                  setShowRetakeModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ff4757] hover:bg-[#e03a49] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>重考 (密码2026)</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#f4f7fd] p-1.5 rounded-2xl border border-[#dde9ff]">
              <button
                onClick={() => {
                  sound.playTap();
                  setExamMode('practice');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  examMode === 'practice'
                    ? 'bg-white text-[#006780] shadow-sm'
                    : 'text-[#514532]/70 hover:text-[#0d1c2f]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ffb800]" />
                <span>随练即批</span>
              </button>
              <button
                onClick={() => {
                  sound.playTap();
                  setExamMode('exam');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  examMode === 'exam'
                    ? 'bg-[#006780] text-white shadow-sm'
                    : 'text-[#514532]/70 hover:text-[#0d1c2f]'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>全真模考</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Grade & Subject Selector Tabs */}
      <div className="bg-white rounded-3xl p-4 md:p-5 border-2 border-[#dde9ff] cloud-shadow space-y-3">
        {/* Grade Selection Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#514532]/80 mr-1">
            切换年级：
          </span>
          {(['3', '4', '5', '6'] as GradeLevel[]).map((g) => {
            const isSel = g === selectedGrade;
            const labels: Record<GradeLevel, string> = {
              '3': '三年级上册',
              '4': '四年级上册',
              '5': '五年级上册',
              '6': '六年级上册',
            };
            return (
              <button
                key={g}
                onClick={() => handleGradeChange(g)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSel
                    ? 'bg-[#006780] text-white shadow-sm scale-105'
                    : 'bg-[#f0f4fc] text-[#193052] hover:bg-[#e0ebfa]'
                }`}
              >
                {labels[g]}
              </button>
            );
          })}
        </div>

        {/* Subject Selection Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#f0f4fc]">
          <span className="text-xs font-bold text-[#514532]/80 mr-1">
            选择学科：
          </span>
          {(['chinese', 'math', 'english'] as ExamSubject[]).map((sub) => {
            const isSel = sub === selectedSubject;
            const conf = subjectStyles[sub];
            const labels: Record<ExamSubject, string> = {
              chinese: '语文',
              math: '数学',
              english: '英语',
            };
            return (
              <button
                key={sub}
                onClick={() => handleSubjectChange(sub)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                  isSel
                    ? `bg-gradient-to-r ${conf.gradient} text-white shadow-md scale-105`
                    : 'bg-[#f0f4fc] text-[#193052] hover:bg-[#e0ebfa]'
                }`}
              >
                {conf.icon}
                <span>{labels[sub]}</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full ml-0.5">
                  100题+2拓展
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2.5 ALREADY COMPLETED & LOCKED BANNER (if submitted) */}
      {isSubmitted && (
        <div className="bg-gradient-to-r from-[#fff3cd] via-[#fff8e1] to-[#ffeaa7] border-2 border-[#ffe082] rounded-3xl p-4 md:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ffb800] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-black text-[#7c5800]">
                    当前学科已完成考试 (锁定状态)
                  </h3>
                  <span className="bg-[#ff4757] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                    不可再修改答题
                  </span>
                </div>
                <p className="text-xs text-[#7c5800]/80 mt-0.5">
                  学生【{currentStudent.name}】于{' '}
                  {submissionRecord?.submittedAt || '本次测试'} 完成考试 ·
                  最终得分：
                  <strong className="text-base text-[#d63031] font-black mx-1">
                    {stats.standardCorrect}
                  </strong>{' '}
                  分 (共 100 分)
                </p>
              </div>
            </div>

            {/* Quick Action Buttons on Locked Banner */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={scrollToWrongQuestions}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-[#7c5800] border border-amber-300 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
              >
                <AlertCircle className="w-4 h-4 text-[#ff4757]" />
                <span>错题订正 ({wrongQuestionsList.length} 题)</span>
              </button>

              <button
                id="banner-retake-exam-btn"
                onClick={() => {
                  sound.playTap();
                  setRetakePasswordInput('');
                  setRetakePasswordError('');
                  setShowRetakeModal(true);
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff4757] to-[#ee5253] hover:from-[#e03a49] hover:to-[#d63031] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Unlock className="w-4 h-4" />
                <span>重考授权 (密码2026)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Exam Title & Quick Dashboard Card */}
      <div
        className={`rounded-3xl p-5 md:p-6 border-2 ${currentSubjectStyle.border} ${currentSubjectStyle.bgLight} relative overflow-hidden`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full ${currentSubjectStyle.accent}`}
              >
                {paper.unitName}
              </span>
              <span className="text-xs font-bold text-[#514532]/80">
                满分 100 分 · 每题 1 分
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-[#0d1c2f]">
              {paper.title}
            </h2>
            <p className="text-xs md:text-sm text-[#514532]/80 mt-1">
              {paper.subtitle}
            </p>
          </div>

          {/* Quick Stats & Answer Sheet Toggle */}
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-2xl px-4 py-2 border border-[#dde9ff] shadow-sm text-center">
              <span className="text-[10px] text-[#514532]/70 block font-bold">
                {isSubmitted ? '考试最终得分' : '答题进度'}
              </span>
              <span className="text-base font-black text-[#006780]">
                {isSubmitted
                  ? `${stats.standardCorrect} 分`
                  : `${stats.standardAnswered} / ${paper.questionsCount}`}
              </span>
            </div>

            <button
              onClick={() => setShowAnswerSheet(!showAnswerSheet)}
              className="bg-white hover:bg-[#f0f4fc] text-[#006780] border-2 border-[#006780]/30 font-bold px-3.5 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>
                答题卡 (
                {isSubmitted
                  ? `${stats.standardCorrect}分`
                  : `${stats.standardAnswered}/100`}
                )
              </span>
            </button>
          </div>
        </div>

        {/* Floating / Collapsible Answer Sheet (答题卡) */}
        {showAnswerSheet && (
          <div className="mt-4 pt-4 border-t border-[#dde9ff] bg-white rounded-2xl p-4 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0d1c2f]">
                  快速定位题号 (点击跳转)：
                </span>
                <span className="text-[11px] text-gray-500">
                  ⚪ 未作答 · 🟢 正确 · 🔴 错误
                </span>
              </div>
              <button
                onClick={() => setShowAnswerSheet(false)}
                className="text-xs text-gray-400 hover:text-gray-600 font-bold"
              >
                收起
              </button>
            </div>

            <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5 max-h-48 overflow-y-auto p-1">
              {paper.questions.map((q) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCorrect = answers[q.id] === q.correctAnswer;
                let bgClass = 'bg-[#f0f4fc] text-[#193052]';
                if ((isSubmitted || examMode === 'practice') && isAnswered) {
                  bgClass = isCorrect
                    ? 'bg-[#2b5d00] text-white'
                    : 'bg-[#ff4757] text-white';
                } else if (isAnswered) {
                  bgClass = 'bg-[#006780] text-white';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToQuestion(q.number)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${bgClass}`}
                  >
                    {q.number}
                  </button>
                );
              })}
            </div>

            {/* 2 Extension questions in sheet */}
            <div className="mt-3 pt-2 border-t border-dashed border-[#dde9ff] flex items-center gap-3">
              <span className="text-xs font-bold text-[#7c5800] flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#ffb800]" />
                思维拓展题：
              </span>
              {paper.extensionQuestions.map((eq, eIdx) => {
                const isAns = answers[eq.id] !== undefined;
                return (
                  <button
                    key={eq.id}
                    onClick={() => handleJumpToQuestion(eq.number, true)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isAns
                        ? 'bg-[#ffb800] text-[#7c5800] shadow-sm'
                        : 'bg-[#fff5d6] text-[#7c5800] border border-[#ffb800]/40'
                    }`}
                  >
                    拓展 {eIdx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Section Navigation Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white p-2.5 rounded-2xl border border-[#dde9ff]">
        <span className="text-xs font-bold text-gray-500 flex items-center gap-1 ml-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          大题模块：
        </span>
        <button
          onClick={() => {
            sound.playTap();
            setActiveSectionFilter('all');
            setPageIndex(0);
            setJumpPageInput('1');
          }}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSectionFilter === 'all'
              ? 'bg-[#006780] text-white shadow-sm'
              : 'bg-[#f0f4fc] text-[#193052] hover:bg-[#e0ebfa]'
          }`}
        >
          全部 100 题 (分页模式)
        </button>

        {paper.sections.map((sec, sIdx) => {
          const isAct = activeSectionFilter === sIdx;
          return (
            <button
              key={sIdx}
              onClick={() => {
                sound.playTap();
                setActiveSectionFilter(sIdx);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isAct
                  ? 'bg-[#006780] text-white shadow-sm'
                  : 'bg-[#f0f4fc] text-[#193052] hover:bg-[#e0ebfa]'
              }`}
            >
              {sec.title.split(' ')[0]} ({sec.startNum}-{sec.endNum})
            </button>
          );
        })}

        {/* Extension Questions Button */}
        <button
          onClick={() => {
            sound.playTap();
            setActiveSectionFilter('ext');
          }}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            activeSectionFilter === 'ext'
              ? 'bg-gradient-to-r from-[#ff9f43] to-[#ee5253] text-white shadow-sm'
              : 'bg-[#fff5d6] text-[#7c5800] hover:bg-[#ffeaa7]'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-yellow-500" />
          <span>🌟 2道拓展题</span>
        </button>

        {/* Direct Jump to Wrong Questions if Submitted */}
        {isSubmitted && wrongQuestionsList.length > 0 && (
          <button
            onClick={scrollToWrongQuestions}
            className="ml-auto px-3 py-1 rounded-xl text-xs font-bold bg-[#fff0f0] text-[#ff4757] border border-[#ffb8b8] hover:bg-[#ffe0e0] transition-all cursor-pointer flex items-center gap-1"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>直达错题专区 ({wrongQuestionsList.length})</span>
          </button>
        )}
      </div>

      {/* 4.5 PAGE JUMP CONTROLLER (TOP LEVEL) */}
      {activeSectionFilter === 'all' && totalPages > 1 && (
        <div className="bg-[#f7f9fd] rounded-2xl p-3 border border-[#dde9ff] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handlePrevPage}
              disabled={pageIndex === 0}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#e0ebfa] disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-[#193052] border border-[#dde9ff] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>上一页</span>
            </button>

            <span className="font-bold text-[#193052] hidden sm:inline">选择页码：</span>
            {/* Direct select dropdown */}
            <select
              id="select-page-dropdown"
              value={pageIndex + 1}
              onChange={(e) => handleJumpToPage(Number(e.target.value))}
              className="bg-white border-2 border-[#dde9ff] rounded-xl px-2 py-1 text-xs font-extrabold text-[#006780] cursor-pointer focus:outline-none focus:border-[#006780]"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const sNum = (p - 1) * pageSize + 1;
                const eNum = Math.min(p * pageSize, paper.questionsCount);
                return (
                  <option key={p} value={p}>
                    第 {p} 页 (第 {sNum} - {eNum} 题)
                  </option>
                );
              })}
            </select>

            <button
              onClick={handleNextPage}
              className="px-3 py-1 rounded-xl bg-[#006780] hover:bg-[#00556b] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs transition-all active:scale-95"
            >
              <span>下一页</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick page buttons strip */}
          <div className="flex flex-wrap items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handleJumpToPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                  pageIndex + 1 === p
                    ? 'bg-[#006780] text-white shadow-sm font-black'
                    : 'bg-white hover:bg-[#eaf0fa] text-[#193052] border border-[#dde9ff]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Jump input box */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#514532]/70 font-bold">跳至第</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPageInput}
              onChange={(e) => setJumpPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleJumpToPage(Number(jumpPageInput));
                }
              }}
              className="w-12 text-center bg-white border-2 border-[#dde9ff] rounded-lg py-0.5 text-xs font-bold focus:outline-none focus:border-[#006780]"
            />
            <span className="text-[#514532]/70 font-bold">页</span>
            <button
              onClick={() => handleJumpToPage(Number(jumpPageInput))}
              className="px-2.5 py-1 rounded-lg bg-[#006780] hover:bg-[#00556b] text-white text-xs font-bold transition-all cursor-pointer"
            >
              跳转
            </button>
          </div>
        </div>
      )}

      {/* 5. Questions List Container */}
      <div id="exam-questions-container" className="space-y-4">
        {pagedQuestions.map((q) => {
          const chosen = answers[q.id];
          const hasAnswered = chosen !== undefined;
          const isCorrect = chosen === q.correctAnswer;
          const showAnswerFeedback =
            (examMode === 'practice' && hasAnswered) ||
            isSubmitted ||
            showExplanationAlways;

          return (
            <div
              id={`question-card-${q.number}`}
              key={q.id}
              className={`bg-white rounded-3xl p-5 md:p-6 border-2 transition-all ${
                q.isExtension
                  ? 'border-[#ffd32a] bg-gradient-to-b from-[#fffdf0] to-white shadow-md'
                  : isSubmitted && !isCorrect
                  ? 'border-[#ffb8b8] bg-[#fffbfb] shadow-sm'
                  : hasAnswered
                  ? 'border-[#dde9ff] shadow-sm'
                  : 'border-[#edf2f9]'
              }`}
            >
              {/* Question Header: Number & Tag */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                      q.isExtension
                        ? 'bg-[#ffb800] text-[#7c5800]'
                        : isSubmitted && !isCorrect
                        ? 'bg-[#ff4757] text-white'
                        : isSubmitted && isCorrect
                        ? 'bg-[#2b5d00] text-white'
                        : 'bg-[#f0f4fc] text-[#006780]'
                    }`}
                  >
                    {q.number}
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    {q.sectionTitle}
                  </span>
                  {q.isExtension && (
                    <span className="bg-[#ffb800]/20 text-[#7c5800] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#ff9f43]" />
                      拔高挑战 (不计入100分统考)
                    </span>
                  )}
                  {isSubmitted && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                        isCorrect
                          ? 'bg-[#eaffea] text-[#2b5d00]'
                          : 'bg-[#ffebee] text-[#ff4757]'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> 答对 (+{q.points}分)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> 做错 (0分)
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-xs font-extrabold text-[#514532]/70">
                    {q.isExtension ? '额外奖励星' : `${q.points} 分`}
                  </span>
                </div>
              </div>

              {/* Reading Passage if present */}
              {q.readingPassage && (
                <div className="mb-4 p-4 rounded-2xl bg-[#f7f9fd] border border-[#dde9ff] text-xs md:text-sm text-[#2c3e50] leading-relaxed font-serif whitespace-pre-line">
                  {q.readingPassage}
                </div>
              )}

              {/* Question Stem */}
              <h3 className="text-sm md:text-base font-bold text-[#0d1c2f] leading-relaxed mb-4">
                {q.stem}
              </h3>

              {/* Options Grid */}
              <div
                className={`grid gap-2.5 ${
                  q.options.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {q.options.map((opt, optIdx) => {
                  const isThisChosen = chosen === optIdx;
                  let optStyle =
                    'bg-[#f8faff] border-[#dde9ff] text-[#193052] hover:bg-[#eef4ff]';

                  if (showAnswerFeedback) {
                    if (optIdx === q.correctAnswer) {
                      optStyle =
                        'bg-[#eaffea] border-[#2b5d00] text-[#2b5d00] font-bold ring-2 ring-[#2b5d00]/30';
                    } else if (isThisChosen) {
                      optStyle =
                        'bg-[#ffebee] border-[#ff4757] text-[#ff4757] font-bold line-through';
                    } else {
                      optStyle = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60';
                    }
                  } else if (isThisChosen) {
                    optStyle =
                      'bg-[#eff4ff] border-[#006780] text-[#006780] font-bold shadow-sm';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() =>
                        handleSelectOption(q.id, optIdx, q.isExtension)
                      }
                      disabled={isSubmitted}
                      className={`p-3 md:p-3.5 rounded-2xl border-2 text-xs md:text-sm text-left transition-all flex items-center justify-between ${
                        isSubmitted ? 'cursor-default' : 'cursor-pointer'
                      } ${optStyle}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-black shrink-0">
                          {q.options.length === 2
                            ? optIdx === 0
                              ? '√'
                              : '×'
                            : String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {showAnswerFeedback && optIdx === q.correctAnswer && (
                        <span className="flex items-center gap-1 text-[11px] font-black text-[#2b5d00]">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          标准正确
                        </span>
                      )}
                      {showAnswerFeedback &&
                        isThisChosen &&
                        optIdx !== q.correctAnswer && (
                          <span className="flex items-center gap-1 text-[11px] font-black text-[#ff4757]">
                            <XCircle className="w-4 h-4 shrink-0" />
                            你的错误选择
                          </span>
                        )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box when revealed */}
              {showAnswerFeedback && (
                <div className="mt-4 p-3.5 rounded-2xl bg-[#eff4ff] border border-[#c7e3ff] text-xs md:text-sm space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#006780]">
                    <Sparkles className="w-3.5 h-3.5 text-[#ffb800]" />
                    <span>试题解析与名师点拨：</span>
                  </div>
                  <p className="text-[#193052] leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5.5 Prominent Next Page Card at the bottom of the current page */}
      <div className="bg-gradient-to-r from-[#eff4ff] via-white to-[#e8faf5] rounded-3xl p-4 md:p-5 border-2 border-[#b2e5dc] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <button
          onClick={handlePrevPage}
          disabled={activeSectionFilter === 'all' && pageIndex === 0}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white hover:bg-[#e0ebfa] disabled:opacity-30 disabled:pointer-events-none text-xs md:text-sm font-bold text-[#193052] border border-[#dde9ff] flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>上一页</span>
        </button>

        <div className="text-center">
          {activeSectionFilter === 'all' ? (
            <div>
              <span className="text-xs md:text-sm font-bold text-[#193052]">
                当前：第 <strong className="text-base text-[#006780] font-black">{pageIndex + 1}</strong> / {totalPages} 页
              </span>
              <span className="text-xs text-gray-500 block">
                (已作答 {stats.standardAnswered} / 100 题)
              </span>
            </div>
          ) : activeSectionFilter === 'ext' ? (
            <span className="text-xs md:text-sm font-bold text-[#7c5800]">
              🌟 拔高思维拓展题 (共 2 题)
            </span>
          ) : (
            <span className="text-xs md:text-sm font-bold text-[#193052]">
              当前：{paper.sections[activeSectionFilter]?.title}
            </span>
          )}
        </div>

        <button
          id="questions-bottom-next-page-btn"
          onClick={handleNextPage}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#006780] via-[#00b894] to-[#006780] hover:from-[#00556b] hover:to-[#00a383] text-white font-black text-xs md:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <span>
            {activeSectionFilter === 'all' && pageIndex < totalPages - 1
              ? `进入下一页 (第 ${pageIndex + 2} 页) ➡️`
              : activeSectionFilter === 'all' && pageIndex === totalPages - 1
              ? '进入思维拓展题 🌟'
              : '进入下一模块 ➡️'}
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 6. Pagination Controls (when viewing All 100 questions) */}
      {activeSectionFilter === 'all' && totalPages > 1 && (
        <div className="bg-white rounded-3xl p-4 md:p-5 border-2 border-[#dde9ff] cloud-shadow space-y-3">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handlePrevPage}
              disabled={pageIndex === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-[#f0f4fc] hover:bg-[#e0ebfa] disabled:opacity-40 disabled:pointer-events-none text-xs md:text-sm font-bold text-[#193052] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>上一页</span>
            </button>

            <span className="text-xs md:text-sm font-bold text-[#514532]/80 text-center">
              第 <strong className="text-[#006780]">{pageIndex + 1}</strong> /{' '}
              {totalPages} 页 (显示 {pageIndex * pageSize + 1} -{' '}
              {Math.min((pageIndex + 1) * pageSize, paper.questionsCount)} 题)
            </span>

            <button
              onClick={handleNextPage}
              className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-[#006780] hover:bg-[#00556b] text-xs md:text-sm font-bold text-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span>{pageIndex === totalPages - 1 ? '思维拓展题 🌟' : '下一页'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Jump to Page Interactive Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-[#f0f4fc]">
            <span className="text-xs font-bold text-[#514532]/80">
              选择页码快速跳转：
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handleJumpToPage(p)}
                  className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    pageIndex + 1 === p
                      ? 'bg-[#006780] text-white shadow-sm scale-110'
                      : 'bg-[#f0f4fc] text-[#193052] hover:bg-[#e0ebfa]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-500 font-bold">跳至第</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleJumpToPage(Number(jumpPageInput));
                  }
                }}
                className="w-12 text-center bg-[#f0f4fc] border border-[#dde9ff] rounded-xl py-1 text-xs font-black text-[#006780]"
              />
              <span className="text-gray-500 font-bold">页</span>
              <button
                onClick={() => handleJumpToPage(Number(jumpPageInput))}
                className="px-3 py-1 bg-[#006780] text-white rounded-xl font-bold cursor-pointer hover:bg-[#00556b]"
              >
                跳转
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6.5 PROMINENT SUBMIT BUTTON AT THE END OF THE EXAM QUESTIONS */}
      <div className="bg-white rounded-3xl p-6 border-2 border-[#dde9ff] cloud-shadow text-center space-y-4">
        {isSubmitted ? (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>本试卷已提交并完成评分</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-[#0d1c2f]">
              考试最终成绩：
              <span className="text-3xl text-[#006780] mx-1">
                {stats.standardCorrect}
              </span>{' '}
              / 100 分
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              当前学科已被系统锁定，无法再次提交答题。如需重新测试，请点击下方「重新考试」按钮输入教师/家长密码。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={scrollToWrongQuestions}
                className="px-5 py-2.5 rounded-2xl bg-[#eff4ff] hover:bg-[#dde9ff] text-[#006780] font-extrabold text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <AlertCircle className="w-4 h-4 text-[#ff4757]" />
                <span>查看所有错题与解析 ({wrongQuestionsList.length} 题)</span>
              </button>
              <button
                id="end-retake-exam-btn"
                onClick={() => {
                  sound.playTap();
                  setRetakePasswordInput('');
                  setRetakePasswordError('');
                  setShowRetakeModal(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#ff4757] hover:bg-[#e03a49] text-white font-extrabold text-xs md:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Unlock className="w-4 h-4" />
                <span>重新考试 (输入密码2026)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Award className="w-6 h-6 text-[#ffb800]" />
              <h3 className="text-lg md:text-xl font-black text-[#0d1c2f]">
                试卷作答完毕？准备交卷！
              </h3>
            </div>
            <p className="text-xs text-[#514532]/80">
              当前已完成答题：
              <strong className="text-base text-[#006780] font-black mx-1">
                {stats.standardAnswered}
              </strong>
              / {paper.questionsCount} 题。交卷后系统将自动评分并收录错题。
            </p>
            <button
              id="submit-exam-end-button"
              onClick={handleInitiateSubmit}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#006780] via-[#00b894] to-[#006780] hover:from-[#00556b] hover:to-[#00a383] text-white font-black text-sm md:text-base flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer mx-auto"
            >
              <Send className="w-5 h-5 text-yellow-300" />
              <span>提交试卷 · 查看最终得分与错题订正</span>
            </button>
          </div>
        )}
      </div>

      {/* 7. DEDICATED WRONG QUESTIONS SECTION AT THE VERY BOTTOM (错题专区) */}
      {isSubmitted && (
        <div
          id="wrong-questions-section"
          className="bg-white rounded-3xl p-5 md:p-7 border-2 border-[#ffb8b8] cloud-shadow space-y-6"
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#ffe0e0]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ff4757] text-white flex items-center justify-center shadow-md shrink-0">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-black text-[#0d1c2f]">
                    错题订正与知识点复盘专区
                  </h2>
                  <span className="bg-[#ff4757] text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                    共 {wrongQuestionsList.length} 题
                  </span>
                </div>
                <p className="text-xs text-[#514532]/80 mt-1">
                  单独集中展示本次测试中做错的题目，请对照错误答案与标准正确答案，查漏补缺！
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-gray-500 font-bold block">
                本次测试得分
              </span>
              <span className="text-2xl font-black text-[#006780]">
                {stats.standardCorrect}{' '}
                <span className="text-xs text-gray-400">/ 100 分</span>
              </span>
            </div>
          </div>

          {/* If 0 wrong questions -> Perfection Celebration */}
          {wrongQuestionsList.length === 0 ? (
            <div className="bg-gradient-to-br from-[#eaffea] to-[#f2fff2] border-2 border-[#a3e9a4] rounded-3xl p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#2b5d00] text-white flex items-center justify-center mx-auto shadow-lg">
                <Award className="w-8 h-8 text-yellow-300" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-[#2b5d00]">
                太厉害了！全对满分，零错题！🎉
              </h3>
              <p className="text-xs md:text-sm text-[#2b5d00]/80 max-w-md mx-auto">
                恭喜你在本次第一单元全真测试中获得了 100
                分满分的优异成绩，知识点掌握极为扎实！
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {wrongQuestionsList.map((item, idx) => {
                const q = item.question;
                const isUnderstood = understoodMistakeIds.has(q.id);

                return (
                  <div
                    key={q.id}
                    className={`rounded-3xl p-5 md:p-6 border-2 transition-all ${
                      isUnderstood
                        ? 'border-green-300 bg-[#fafffa]'
                        : 'border-[#ffcdd2] bg-[#fffbfb]'
                    }`}
                  >
                    {/* Mistake Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-[#ff4757] text-white flex items-center justify-center font-black text-xs">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-gray-500">
                          原试卷第 {q.number} 题 · {q.sectionTitle}
                        </span>
                        {item.isExtension && (
                          <span className="bg-[#ffb800]/20 text-[#7c5800] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            思维拓展题
                          </span>
                        )}
                      </div>

                      {/* Mark as understood button */}
                      <button
                        onClick={() => {
                          sound.playTap();
                          setUnderstoodMistakeIds((prev) => {
                            const next = new Set(prev);
                            if (next.has(q.id)) {
                              next.delete(q.id);
                            } else {
                              next.add(q.id);
                            }
                            return next;
                          });
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          isUnderstood
                            ? 'bg-[#2b5d00] text-white shadow-sm'
                            : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isUnderstood ? '已标记掌握' : '标记已掌握'}</span>
                      </button>
                    </div>

                    {/* Reading passage if any */}
                    {q.readingPassage && (
                      <div className="mb-4 p-4 rounded-2xl bg-white border border-[#ffcdd2] text-xs md:text-sm text-[#2c3e50] leading-relaxed font-serif whitespace-pre-line">
                        {q.readingPassage}
                      </div>
                    )}

                    {/* Question Stem */}
                    <h4 className="text-sm md:text-base font-bold text-[#0d1c2f] leading-relaxed mb-4">
                      {q.stem}
                    </h4>

                    {/* COMPARISON BLOCKS: Student Wrong Answer vs Correct Answer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {/* Student's Wrong Answer Block */}
                      <div className="bg-[#ffebee] border-2 border-[#ff4757] rounded-2xl p-3.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-black text-[#d63031]">
                          <XCircle className="w-4 h-4 text-[#ff4757]" />
                          <span>你的错误作答：</span>
                        </div>
                        <div className="text-sm md:text-base font-black text-[#d63031] pl-5">
                          {item.studentAnswerText}
                        </div>
                      </div>

                      {/* Correct Answer Highlighted Block */}
                      <div className="bg-[#e8f5e9] border-2 border-[#2b5d00] rounded-2xl p-3.5 space-y-1 shadow-sm">
                        <div className="flex items-center gap-1.5 text-xs font-black text-[#2b5d00]">
                          <CheckCircle2 className="w-4 h-4 text-[#2b5d00]" />
                          <span>标准正确答案：</span>
                        </div>
                        <div className="text-sm md:text-base font-black text-[#2b5d00] pl-5">
                          {item.correctAnswerText}
                        </div>
                      </div>
                    </div>

                    {/* All Options Breakdown */}
                    <div className="space-y-1.5 mb-4">
                      <span className="text-[11px] font-bold text-gray-500 block">
                        全部选项明细：
                      </span>
                      {q.options.map((opt, optIdx) => {
                        const isStudentChosen = item.studentAnswerIndex === optIdx;
                        const isCorrectOpt = optIdx === q.correctAnswer;

                        let style = 'bg-white border-gray-200 text-gray-600';
                        if (isCorrectOpt) {
                          style =
                            'bg-[#e8f5e9] border-[#2b5d00] text-[#2b5d00] font-black ring-2 ring-[#2b5d00]/30';
                        } else if (isStudentChosen) {
                          style =
                            'bg-[#ffebee] border-[#ff4757] text-[#ff4757] font-bold line-through';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${style}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>

                            {isCorrectOpt && (
                              <span className="text-[10px] font-black bg-[#2b5d00] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3" /> 正确选项
                              </span>
                            )}
                            {isStudentChosen && !isCorrectOpt && (
                              <span className="text-[10px] font-black bg-[#ff4757] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                                你的选择 (错误)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Deep Explanation Box */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#eff4ff] to-[#f4f7fd] border border-[#c7e3ff] space-y-1">
                      <div className="flex items-center gap-1.5 font-black text-xs md:text-sm text-[#006780]">
                        <Sparkles className="w-4 h-4 text-[#ffb800]" />
                        <span>名师点拨与深度解析：</span>
                      </div>
                      <p className="text-xs md:text-sm text-[#193052] leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 8. Bottom Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-[#dde9ff] p-2.5 md:p-3.5 shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {isSubmitted ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-xs">
                <span className="text-gray-500 font-bold">考试已交卷：</span>
                <span className="font-black text-[#006780] text-sm">
                  {stats.standardCorrect}
                </span>
                <span className="text-gray-400"> / 100 分</span>
              </div>
              <button
                onClick={scrollToWrongQuestions}
                className="text-xs font-bold text-[#ff4757] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>查看错题 ({wrongQuestionsList.length})</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="text-xs">
                <span className="text-gray-500 font-bold">已答：</span>
                <span className="font-extrabold text-[#006780]">
                  {stats.standardAnswered}
                </span>
                <span className="text-gray-400"> / {paper.questionsCount}</span>
              </div>

              {examMode === 'practice' && (
                <button
                  onClick={() =>
                    setShowExplanationAlways(!showExplanationAlways)
                  }
                  className="hidden sm:flex text-xs text-[#006780] hover:underline font-bold items-center gap-1 cursor-pointer"
                >
                  {showExplanationAlways ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {showExplanationAlways ? '隐藏未答解析' : '展开所有解析'}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Center: Always-Visible Page Switcher on Every Page */}
          <div className="flex items-center gap-1 bg-[#f0f4fc] p-1 rounded-2xl border border-[#dde9ff]">
            <button
              id="footer-prev-page-btn"
              onClick={handlePrevPage}
              disabled={activeSectionFilter === 'all' && pageIndex === 0}
              title="上一页"
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#e0ebfa] disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-[#193052] flex items-center gap-1 cursor-pointer shadow-xs transition-all active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">上一页</span>
            </button>

            <span className="text-xs font-black text-[#006780] px-2 whitespace-nowrap">
              {activeSectionFilter === 'all'
                ? `第 ${pageIndex + 1} / ${totalPages} 页`
                : activeSectionFilter === 'ext'
                ? '拓展题'
                : `模块 ${Number(activeSectionFilter) + 1}`}
            </span>

            <button
              id="footer-next-page-btn"
              onClick={handleNextPage}
              title="切换下一页"
              className="px-3 py-1.5 rounded-xl bg-[#006780] hover:bg-[#00556b] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs transition-all active:scale-95"
            >
              <span>下一页</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isSubmitted ? (
              <button
                id="footer-retake-btn"
                onClick={() => {
                  sound.playTap();
                  setRetakePasswordInput('');
                  setRetakePasswordError('');
                  setShowRetakeModal(true);
                }}
                className="px-4 md:px-5 py-2 md:py-2.5 rounded-2xl bg-gradient-to-r from-[#ff4757] to-[#ee5253] hover:from-[#e03a49] hover:to-[#d63031] text-white font-extrabold text-xs md:text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>重新考试 (密码2026)</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    sound.playTap();
                    setAnswers({});
                  }}
                  className="hidden sm:flex px-3 py-2 rounded-2xl bg-[#f0f4fc] hover:bg-[#e0ebfa] text-xs font-bold text-[#193052] items-center gap-1 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重填</span>
                </button>

                <button
                  id="submit-exam-button"
                  onClick={handleInitiateSubmit}
                  className="px-4 md:px-5 py-2 md:py-2.5 rounded-2xl bg-gradient-to-r from-[#006780] to-[#00b894] hover:from-[#00556b] hover:to-[#00a383] text-white font-extrabold text-xs md:text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-yellow-300" />
                  <span>交卷评分</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 9. Score Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-[#dde9ff] cloud-shadow text-center space-y-4 animate-in fade-in zoom-in duration-200">
            {/* Header Icon */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#ffb800] to-[#ffda79] mx-auto flex items-center justify-center shadow-lg transform -rotate-6">
              <Award className="w-10 h-10 text-white" />
            </div>

            <div>
              <span className="text-xs font-extrabold text-[#7c5800] bg-[#fff5d6] px-3 py-1 rounded-full">
                {paper.title}
              </span>
              <h3 className="text-2xl font-black text-[#0d1c2f] mt-2">
                测试成绩报告
              </h3>
            </div>

            {/* Score Big Display */}
            <div className="bg-gradient-to-br from-[#eff4ff] to-[#f7faff] rounded-2xl p-5 border border-[#dde9ff]">
              <span className="text-xs font-bold text-gray-500 block">
                本次测试得分 (满分 100 分)
              </span>
              <div className="text-5xl font-black text-[#006780] my-1">
                {stats.standardCorrect}
                <span className="text-lg font-bold text-gray-400"> / 100</span>
              </div>
              <p className="text-xs font-bold text-[#2b5d00] mt-1">
                {stats.standardCorrect >= 90
                  ? '🌟 卓越神童！第一单元知识全通透！'
                  : stats.standardCorrect >= 80
                  ? '🎉 优秀！基础扎实，继续保持！'
                  : stats.standardCorrect >= 60
                  ? '👍 及格！错题认真订正还能更上一层楼！'
                  : '💪 加油！配合解析查漏补缺，迎头赶上！'}
              </p>
            </div>

            {/* Detailed stats pills */}
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="p-3 rounded-xl bg-[#f0f4fc] text-xs">
                <span className="text-gray-500 block">基础题答对</span>
                <strong className="text-sm text-[#006780]">
                  {stats.standardCorrect} / {paper.questionsCount} 题
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-[#fff0f0] text-xs">
                <span className="text-[#ff4757] block">❌ 需订正错题</span>
                <strong className="text-sm text-[#ff4757]">
                  共 {wrongQuestionsList.length} 道错题
                </strong>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={scrollToWrongQuestions}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#ff4757] to-[#ee5253] hover:from-[#e03a49] hover:to-[#d63031] text-white font-bold text-xs md:text-sm transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <AlertCircle className="w-4 h-4" />
                <span>直达底部错题订正 ({wrongQuestionsList.length}题)</span>
              </button>
              <button
                onClick={() => setShowResultModal(false)}
                className="px-4 py-3 rounded-2xl bg-[#f0f4fc] hover:bg-[#e0ebfa] text-[#193052] font-bold text-xs md:text-sm transition-all cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. UNANSWERED CONFIRMATION MODAL */}
      {showConfirmSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border-2 border-[#dde9ff] cloud-shadow text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-[#0d1c2f]">
                还有未作答题目
              </h3>
              <p className="text-xs text-[#514532]/80 mt-1">
                试卷中还有{' '}
                <strong className="text-[#ff4757] font-black">
                  {paper.questionsCount - stats.standardAnswered}
                </strong>{' '}
                道题尚未作答。未作答题目将按 0 分计入总成绩。确认现在交卷吗？
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowConfirmSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#f0f4fc] text-[#193052] font-bold text-xs hover:bg-[#e0ebfa] cursor-pointer"
              >
                返回继续答题
              </button>
              <button
                onClick={executeSubmit}
                className="flex-1 py-2.5 rounded-xl bg-[#006780] text-white font-bold text-xs hover:bg-[#00556b] cursor-pointer shadow-sm"
              >
                确认交卷
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. RETAKE PASSWORD MODAL (Password: 2026) */}
      {showRetakeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border-2 border-[#dde9ff] cloud-shadow text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-3xl bg-[#fff0f0] border-2 border-[#ffcdd2] text-[#ff4757] mx-auto flex items-center justify-center shadow-inner">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-[#0d1c2f]">
                教师 / 家长重考授权
              </h3>
              <p className="text-xs text-[#514532]/80 mt-1">
                当前学科已完成考试。为了保证测试严肃性，重新考试需输入授权密码（默认密码：
                <strong className="text-[#ff4757]">2026</strong>）
              </p>
            </div>

            {/* Password input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-gray-500">
                请输入授权密码：
              </label>
              <input
                type="text"
                autoFocus
                value={retakePasswordInput}
                placeholder="请输入密码 2026"
                onChange={(e) => {
                  setRetakePasswordInput(e.target.value);
                  setRetakePasswordError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRetakeConfirm();
                  }
                }}
                className="w-full px-4 py-3 rounded-2xl bg-[#f0f4fc] border-2 border-[#dde9ff] text-center font-mono font-black text-lg text-[#0d1c2f] focus:outline-none focus:border-[#ff4757]"
              />
              {retakePasswordError && (
                <p className="text-[11px] text-[#ff4757] font-bold mt-1 text-center">
                  {retakePasswordError}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowRetakeModal(false)}
                className="flex-1 py-3 rounded-2xl bg-[#f0f4fc] text-[#193052] font-bold text-xs hover:bg-[#e0ebfa] cursor-pointer"
              >
                取消
              </button>
              <button
                id="btn-confirm-retake-password"
                onClick={handleRetakeConfirm}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#ff4757] to-[#ee5253] hover:from-[#e03a49] hover:to-[#d63031] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                确认解锁重考
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
