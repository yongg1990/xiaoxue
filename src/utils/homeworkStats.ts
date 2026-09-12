import { HomeworkGrade, HomeworkSubject } from '../types';

export interface HomeworkUnitDailyStat {
  refreshCount: number;
  wrongCount: number;
  correctCount: number;
  lastUpdated: string;
}

// Full key structure: Record<studentId, Record<dateStr, Record<grade, Record<subject, Record<unitNumber, HomeworkUnitDailyStat>>>>>
export type HomeworkStatsStorage = Record<
  string, // studentId
  Record<
    string, // date 'YYYY-MM-DD'
    Record<
      string, // grade '3' | '4' | '5' | '6'
      Record<
        string, // subject 'chinese' | 'math' | 'english'
        Record<string, HomeworkUnitDailyStat> // unitNumber '1'..'6'
      >
    >
  >
>;

const STORAGE_KEY = 'pep_homework_daily_stats_v1';

export const getTodayDateString = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const loadAllHomeworkStats = (): HomeworkStatsStorage => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load homework stats', err);
    return {};
  }
};

export const saveAllHomeworkStats = (stats: HomeworkStatsStorage): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save homework stats', err);
  }
};

/**
 * Get stats for a specific student, date, grade, subject, and unit
 */
export const getUnitDailyStat = (
  studentId: string,
  date: string,
  grade: HomeworkGrade,
  subject: HomeworkSubject,
  unitNumber: number
): HomeworkUnitDailyStat => {
  const all = loadAllHomeworkStats();
  const s = all[studentId]?.[date]?.[grade]?.[subject]?.[String(unitNumber)];
  return (
    s || {
      refreshCount: 0,
      wrongCount: 0,
      correctCount: 0,
      lastUpdated: '',
    }
  );
};

/**
 * Record an event (refresh, wrong, correct)
 */
export const recordHomeworkEvent = (params: {
  studentId: string;
  date?: string;
  grade: HomeworkGrade;
  subject: HomeworkSubject;
  unitNumber: number;
  type: 'refresh' | 'wrong' | 'correct';
  count?: number;
}): HomeworkUnitDailyStat => {
  const {
    studentId,
    date = getTodayDateString(),
    grade,
    subject,
    unitNumber,
    type,
    count = 1,
  } = params;

  const all = loadAllHomeworkStats();
  if (!all[studentId]) all[studentId] = {};
  if (!all[studentId][date]) all[studentId][date] = {};
  if (!all[studentId][date][grade]) all[studentId][date][grade] = {};
  if (!all[studentId][date][grade][subject]) all[studentId][date][grade][subject] = {};

  const uKey = String(unitNumber);
  const current = all[studentId][date][grade][subject][uKey] || {
    refreshCount: 0,
    wrongCount: 0,
    correctCount: 0,
    lastUpdated: '',
  };

  if (type === 'refresh') {
    current.refreshCount += count;
  } else if (type === 'wrong') {
    current.wrongCount += count;
  } else if (type === 'correct') {
    current.correctCount += count;
  }
  current.lastUpdated = new Date().toISOString();

  all[studentId][date][grade][subject][uKey] = current;
  saveAllHomeworkStats(all);

  // Dispatch custom window event so any listeners/components can re-render reactively
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('homework-stats-updated', {
        detail: { studentId, date, grade, subject, unitNumber, current },
      })
    );
  }

  return current;
};

/**
 * Get all available dates that have records for a student
 */
export const getStudentRecordedDates = (studentId: string): string[] => {
  const all = loadAllHomeworkStats();
  const studentData = all[studentId];
  if (!studentData) return [getTodayDateString()];
  const dates = Object.keys(studentData);
  const today = getTodayDateString();
  if (!dates.includes(today)) {
    dates.push(today);
  }
  return dates.sort((a, b) => b.localeCompare(a));
};

/**
 * Compute total summary for a given day across all subjects/units or specific grade/subject
 */
export const getDaySummary = (
  studentId: string,
  date: string,
  filterGrade?: HomeworkGrade,
  filterSubject?: HomeworkSubject
) => {
  const all = loadAllHomeworkStats();
  const dateData = all[studentId]?.[date];
  if (!dateData) {
    return {
      totalRefreshes: 0,
      totalWrongs: 0,
      totalCorrects: 0,
      mostWrongUnit: null as { grade: string; subject: string; unitNumber: number; wrongCount: number } | null,
    };
  }

  let totalRefreshes = 0;
  let totalWrongs = 0;
  let totalCorrects = 0;
  let maxWrongCount = 0;
  let mostWrongUnit: { grade: string; subject: string; unitNumber: number; wrongCount: number } | null = null;

  Object.entries(dateData).forEach(([gradeKey, subjects]) => {
    if (filterGrade && gradeKey !== filterGrade) return;
    Object.entries(subjects).forEach(([subjectKey, units]) => {
      if (filterSubject && subjectKey !== filterSubject) return;
      Object.entries(units).forEach(([unitKey, stat]) => {
        totalRefreshes += stat.refreshCount || 0;
        totalWrongs += stat.wrongCount || 0;
        totalCorrects += stat.correctCount || 0;
        if (stat.wrongCount > maxWrongCount) {
          maxWrongCount = stat.wrongCount;
          mostWrongUnit = {
            grade: gradeKey,
            subject: subjectKey,
            unitNumber: Number(unitKey),
            wrongCount: stat.wrongCount,
          };
        }
      });
    });
  });

  return {
    totalRefreshes,
    totalWrongs,
    totalCorrects,
    mostWrongUnit,
  };
};

/**
 * Clear stats for a specific date or all dates for a student
 */
export const clearHomeworkStats = (studentId: string, date?: string): void => {
  const all = loadAllHomeworkStats();
  if (!all[studentId]) return;

  if (date) {
    delete all[studentId][date];
  } else {
    delete all[studentId];
  }
  saveAllHomeworkStats(all);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('homework-stats-updated', { detail: { studentId } }));
  }
};
