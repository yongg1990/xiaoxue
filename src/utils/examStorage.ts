import { GradeLevel } from '../types';
import { ExamSubject } from '../data/exam/types';

export interface ExamSubmissionRecord {
  studentId: string;
  grade: GradeLevel;
  subject: ExamSubject;
  score: number;
  totalScore: number;
  answers: Record<string, number>;
  submittedAt: string;
  standardCorrect: number;
  totalStandard: number;
  extCorrect: number;
  totalExt: number;
  wrongQuestionIds: string[];
}

const STORAGE_KEY_PREFIX = 'pep_exam_records_v1';

function getAllStoredRecords(): Record<string, ExamSubmissionRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load exam records from localStorage:', e);
    return {};
  }
}

function saveAllStoredRecords(records: Record<string, ExamSubmissionRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save exam records to localStorage:', e);
  }
}

function makeKey(studentId: string, grade: GradeLevel, subject: ExamSubject): string {
  return `${studentId}_${grade}_${subject}`;
}

export function getExamSubmission(
  studentId: string,
  grade: GradeLevel,
  subject: ExamSubject
): ExamSubmissionRecord | null {
  const all = getAllStoredRecords();
  return all[makeKey(studentId, grade, subject)] || null;
}

export function saveExamSubmission(record: ExamSubmissionRecord): void {
  const all = getAllStoredRecords();
  all[makeKey(record.studentId, record.grade, record.subject)] = record;
  saveAllStoredRecords(all);
}

export function clearExamSubmission(
  studentId: string,
  grade: GradeLevel,
  subject: ExamSubject
): void {
  const all = getAllStoredRecords();
  delete all[makeKey(studentId, grade, subject)];
  saveAllStoredRecords(all);
}
