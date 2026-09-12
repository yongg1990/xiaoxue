import { GradeLevel } from '../../types';

export type ExamSubject = 'chinese' | 'math' | 'english';

export type ExamQuestionType = 'choice' | 'judge' | 'calc' | 'reading' | 'application' | 'extension';

export interface ExamQuestion {
  id: string;
  number: number;
  type: ExamQuestionType;
  sectionTitle: string;
  stem: string;
  readingPassage?: string;
  options: string[];
  correctAnswer: number; // Index in options
  explanation: string;
  points: number; // 1 point each for standard, bonus for extension
  isExtension?: boolean;
}

export interface ExamPaper {
  id: string;
  grade: GradeLevel;
  gradeLabel: string;
  subject: ExamSubject;
  subjectLabel: string;
  title: string;
  subtitle: string;
  unitName: string;
  totalScore: 100;
  questionsCount: 50;
  extensionCount: 2;
  sections: {
    title: string;
    startNum: number;
    endNum: number;
    description: string;
  }[];
  questions: ExamQuestion[]; // Exactly 50 questions
  extensionQuestions: ExamQuestion[]; // Exactly 2 questions
}
