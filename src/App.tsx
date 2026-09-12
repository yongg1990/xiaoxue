import React, { useState, useEffect, useMemo } from 'react';
import {
  ActiveTab,
  StudentProfile,
  BadgeItem,
  GradeLevel,
  SemesterType,
  SemesterKey,
} from './types';
import { INITIAL_STUDENTS, WORDS_DATA, INITIAL_BADGES, CATEGORIES } from './data/words';
import { PEP_UNITS, PEP_SEMESTERS, PEP_WORDS } from './data/pepCurriculum';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { SentencesScreen } from './components/SentencesScreen';
import { CardsScreen } from './components/CardsScreen';
import { QuizScreen } from './components/QuizScreen';
import { BadgesScreen } from './components/BadgesScreen';
import { HomeworkScreen } from './components/HomeworkScreen';
import { ExamScreen } from './components/ExamScreen';
import { ProfileSelectorModal } from './components/ProfileSelectorModal';
import { SpeakOutModal } from './components/SpeakOutModal';
import { triggerConfetti } from './utils/speech';

export const getTodayDateString = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export default function App() {
  const todayStr = getTodayDateString();

  // Load state from localStorage or initial, applying daily reset if needed
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('pep_word_explorer_students');
    let loadedStudents: StudentProfile[] = INITIAL_STUDENTS;
    if (saved) {
      try {
        loadedStudents = JSON.parse(saved);
      } catch {
        loadedStudents = INITIAL_STUDENTS;
      }
    }
    // Daily reset check on startup
    return loadedStudents.map((s) => {
      const isSameDay = s.lastActiveDate === todayStr;
      const todayWords = isSameDay ? (s.todayLearnedWords || []) : [];
      const calculatedProgress = Math.min(100, Math.round((todayWords.length / 10) * 100));
      return {
        ...s,
        dailyGoal: 10,
        lastActiveDate: todayStr,
        todayLearnedWords: todayWords,
        todayProgress: isSameDay ? (s.todayProgress ?? calculatedProgress) : 0,
      };
    });
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    return localStorage.getItem('pep_word_explorer_active_student') || 'student-leo';
  });

  const currentStudent =
    students.find((s) => s.id === currentStudentId) || students[0] || INITIAL_STUDENTS[0];

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Curriculum stratification state
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(
    currentStudent.gradeLevel || '3'
  );
  const [selectedSemester, setSelectedSemester] = useState<SemesterType>(
    currentStudent.semester || 'A'
  );
  const [selectedUnitId, setSelectedUnitId] = useState<string>('3a-unit3');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('animals');
  const [sentenceTargetUnitId, setSentenceTargetUnitId] = useState<string | null>(null);

  const [showProfileSelector, setShowProfileSelector] = useState<boolean>(false);
  const [showSpeakOut, setShowSpeakOut] = useState<boolean>(false);

  const [badges, setBadges] = useState<BadgeItem[]>(() => {
    const saved = localStorage.getItem('pep_word_explorer_badges');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_BADGES;
      }
    }
    return INITIAL_BADGES;
  });

  // Check and perform daily reset whenever the date changes or on mount
  useEffect(() => {
    const currentToday = getTodayDateString();
    setStudents((prev) =>
      prev.map((student) => {
        if (student.lastActiveDate !== currentToday) {
          return {
            ...student,
            lastActiveDate: currentToday,
            todayLearnedWords: [],
            todayProgress: 0,
            dailyGoal: 10,
          };
        }
        return student;
      })
    );
  }, []);

  // Calculate selectedSemesterKey
  const selectedSemesterKey: SemesterKey = `${selectedGrade}${selectedSemester}` as SemesterKey;

  // Filter units for current semester
  const currentSemesterUnits = useMemo(() => {
    return PEP_UNITS.filter((u) => u.semesterKey === selectedSemesterKey);
  }, [selectedSemesterKey]);

  // Sync selectedUnitId when semester changes
  useEffect(() => {
    if (currentSemesterUnits.length > 0) {
      const exists = currentSemesterUnits.some((u) => u.id === selectedUnitId);
      if (!exists) {
        setSelectedUnitId(currentSemesterUnits[0].id);
      }
    }
  }, [currentSemesterUnits, selectedUnitId]);

  // Filter words for active unit, active semester, and active category
  const activeUnitWords = useMemo(() => {
    const unitWords = PEP_WORDS.filter((w) => w.unitId === selectedUnitId);
    if (unitWords.length > 0) return unitWords;
    // fallback to semester words
    const semWords = PEP_WORDS.filter((w) => w.semesterKey === selectedSemesterKey);
    return semWords.length > 0 ? semWords : PEP_WORDS;
  }, [selectedUnitId, selectedSemesterKey]);

  const activeCategoryWords = useMemo(() => {
    return PEP_WORDS.filter((w) => w.category === selectedCategoryId);
  }, [selectedCategoryId]);

  const activeCategory =
    CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0];

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('pep_word_explorer_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('pep_word_explorer_active_student', currentStudentId);
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem('pep_word_explorer_badges', JSON.stringify(badges));
  }, [badges]);

  // Handler to add a new student
  const handleAddStudent = (
    newStudentData: Omit<
      StudentProfile,
      | 'id'
      | 'streakDays'
      | 'totalStars'
      | 'wordsMastered'
      | 'completedQuizzesCount'
      | 'badgesUnlocked'
      | 'dailyGoal'
      | 'todayProgress'
      | 'todayLearnedWords'
      | 'lastActiveDate'
    >
  ) => {
    const currentToday = getTodayDateString();
    const newStudent: StudentProfile = {
      ...newStudentData,
      id: `student-${Date.now()}`,
      streakDays: 1,
      totalStars: 50,
      wordsMastered: [],
      todayLearnedWords: [],
      lastActiveDate: currentToday,
      completedQuizzesCount: 0,
      badgesUnlocked: ['first_step', 'pep_explorer'],
      dailyGoal: 10,
      todayProgress: 0,
      gradeLevel: newStudentData.gradeLevel || '3',
      semester: newStudentData.semester || 'A',
    };
    setStudents((prev) => [...prev, newStudent]);
    setCurrentStudentId(newStudent.id);
    setSelectedGrade(newStudent.gradeLevel || '3');
    setSelectedSemester(newStudent.semester || 'A');
    setShowProfileSelector(false);
  };

  // Handler when a word is remembered in Cards (10 words = 100% daily progress)
  const handleWordMastered = (wordId: string) => {
    const currentToday = getTodayDateString();
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === currentStudentId) {
          const isSameDay = student.lastActiveDate === currentToday;
          const currentTodayWords = isSameDay ? (student.todayLearnedWords || []) : [];

          const mastered = student.wordsMastered.includes(wordId)
            ? student.wordsMastered
            : [...student.wordsMastered, wordId];

          const newTodayWords = currentTodayWords.includes(wordId)
            ? currentTodayWords
            : [...currentTodayWords, wordId];

          // 10 new words learned today = 100%
          const newTodayProgress = Math.min(
            100,
            Math.round((newTodayWords.length / 10) * 100)
          );

          // Celebrate reaching 100% (10 words)
          if (currentTodayWords.length < 10 && newTodayWords.length >= 10) {
            triggerConfetti();
          }

          return {
            ...student,
            lastActiveDate: currentToday,
            totalStars: student.totalStars + 10,
            wordsMastered: mastered,
            todayLearnedWords: newTodayWords,
            todayProgress: newTodayProgress,
          };
        }
        return student;
      })
    );
  };

  // Manual reset for today's progress (or testing reset functionality)
  const handleResetTodayProgress = () => {
    const currentToday = getTodayDateString();
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === currentStudentId) {
          return {
            ...student,
            lastActiveDate: currentToday,
            todayLearnedWords: [],
            todayProgress: 0,
          };
        }
        return student;
      })
    );
  };

  // Handler when finishing quiz
  const handleFinishQuiz = (score: number, starsEarned: number) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === currentStudentId) {
          return {
            ...student,
            totalStars: student.totalStars + starsEarned,
            completedQuizzesCount: student.completedQuizzesCount + 1,
          };
        }
        return student;
      })
    );

    // Check if explorer badge unlocked
    if (score >= 90) {
      setBadges((prev) =>
        prev.map((b) => {
          if (b.id === 'quiz_master') {
            return {
              ...b,
              unlocked: true,
              unlockedDate: '今天',
              currentCount: score,
            };
          }
          return b;
        })
      );
    }
  };

  // Handler to add stars from SpeakOut
  const handleAddStars = (stars: number) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === currentStudentId) {
          return {
            ...student,
            totalStars: student.totalStars + stars,
          };
        }
        return student;
      })
    );
  };

  const handleSelectSemesterKey = (key: SemesterKey) => {
    const grade = key.slice(0, 1) as GradeLevel;
    const sem = key.slice(1, 2) as SemesterType;
    setSelectedGrade(grade);
    setSelectedSemester(sem);
    const firstUnit = PEP_UNITS.find((u) => u.semesterKey === key);
    if (firstUnit) {
      setSelectedUnitId(firstUnit.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0d1c2f] flex flex-col justify-between selection:bg-[#ffb800]/30 selection:text-[#6b4c00]">
      {/* Main View Switching */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <HomeScreen
            currentStudent={currentStudent}
            selectedGrade={selectedGrade}
            selectedSemester={selectedSemester}
            selectedSemesterKey={selectedSemesterKey}
            units={currentSemesterUnits}
            allWords={PEP_WORDS}
            categories={CATEGORIES}
            selectedCategoryId={selectedCategoryId}
            selectedUnitId={selectedUnitId}
            onSelectGrade={(g) => setSelectedGrade(g)}
            onSelectSemester={(s) => setSelectedSemester(s)}
            onSelectSemesterKey={handleSelectSemesterKey}
            onSelectCategory={(catId) => {
              setSelectedCategoryId(catId);
            }}
            onSelectUnit={(uId) => {
              setSelectedUnitId(uId);
            }}
            onOpenProfileSwitch={() => setShowProfileSelector(true)}
            onStartCards={(unitId, catId) => {
              if (unitId) setSelectedUnitId(unitId);
              if (catId) setSelectedCategoryId(catId);
              setActiveTab('cards');
            }}
            onStartQuiz={(unitId) => {
              if (unitId) setSelectedUnitId(unitId);
              setActiveTab('quiz');
            }}
            onOpenSpeakOut={() => setShowSpeakOut(true)}
            onOpenBadges={() => setActiveTab('badges')}
            onOpenHomework={() => setActiveTab('homework')}
            onResetTodayProgress={handleResetTodayProgress}
            onOpenSentences={(semKey, uId) => {
              if (semKey) handleSelectSemesterKey(semKey);
              setSentenceTargetUnitId(uId || null);
              setActiveTab('sentences');
            }}
            onOpenExam={(grade) => {
              if (grade) setSelectedGrade(grade);
              setActiveTab('exam');
            }}
          />
        )}

        {activeTab === 'sentences' && (
          <SentencesScreen
            initialSemesterKey={selectedSemesterKey}
            initialUnitId={sentenceTargetUnitId || undefined}
            onBackToHome={() => {
              setSentenceTargetUnitId(null);
              setActiveTab('home');
            }}
            onNavigateToWords={(uId) => {
              if (uId) setSelectedUnitId(uId);
              setActiveTab('cards');
            }}
            onAddStars={handleAddStars}
          />
        )}

        {activeTab === 'cards' && (
          <CardsScreen
            words={activeUnitWords}
            allUnits={PEP_UNITS}
            selectedUnitId={selectedUnitId}
            selectedSemesterKey={selectedSemesterKey}
            currentStudent={currentStudent}
            onSelectUnit={(uId) => setSelectedUnitId(uId)}
            onWordMastered={handleWordMastered}
            onCompleteSession={() => setActiveTab('quiz')}
            onBackToHome={() => setActiveTab('home')}
            onNavigateToSentences={(uId) => {
              if (uId) setSelectedUnitId(uId);
              setActiveTab('sentences');
            }}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizScreen
            words={activeUnitWords.length >= 4 ? activeUnitWords : PEP_WORDS}
            allUnits={PEP_UNITS}
            selectedUnitId={selectedUnitId}
            currentStudent={currentStudent}
            onFinishQuiz={handleFinishQuiz}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'homework' && (
          <HomeworkScreen
            currentStudent={currentStudent}
            allWords={PEP_WORDS}
            onAddStars={handleAddStars}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'badges' && (
          <BadgesScreen currentStudent={currentStudent} badges={badges} />
        )}

        {activeTab === 'exam' && (
          <ExamScreen
            initialGrade={selectedGrade}
            currentStudent={currentStudent}
            onBackToHome={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Bottom Sticky Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'sentences') {
            setSentenceTargetUnitId(null);
          }
          setActiveTab(tab);
        }}
      />

      {/* Modal: Profile Switcher (Screen 3) */}
      {showProfileSelector && (
        <ProfileSelectorModal
          students={students}
          currentStudentId={currentStudentId}
          onSelectStudent={(id) => {
            const found = students.find((s) => s.id === id);
            if (found) {
              if (found.gradeLevel) setSelectedGrade(found.gradeLevel);
              if (found.semester) setSelectedSemester(found.semester);
            }
            setCurrentStudentId(id);
            setShowProfileSelector(false);
          }}
          onAddStudent={handleAddStudent}
          onClose={() => setShowProfileSelector(false)}
        />
      )}

      {/* Modal: Speak Out Practice */}
      {showSpeakOut && (
        <SpeakOutModal
          words={activeUnitWords}
          onClose={() => setShowSpeakOut(false)}
          onAddStars={handleAddStars}
        />
      )}
    </div>
  );
}
