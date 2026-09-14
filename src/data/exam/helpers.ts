import { ExamQuestion } from './types';

// Helper to make true/false judge questions (2 points each)
export function makeJudge(
  id: string,
  number: number,
  sectionTitle: string,
  stem: string,
  isTrue: boolean,
  explanation: string
): ExamQuestion {
  return {
    id,
    number,
    type: 'judge',
    sectionTitle,
    stem,
    options: ['正确 (√)', '错误 (×)'],
    correctAnswer: isTrue ? 0 : 1,
    explanation,
    points: 2,
  };
}

// Helper to make multiple choice questions (2 points each)
export function makeChoice(
  id: string,
  number: number,
  sectionTitle: string,
  stem: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  readingPassage?: string,
  type: 'choice' | 'calc' | 'reading' | 'application' = 'choice'
): ExamQuestion {
  return {
    id,
    number,
    type,
    sectionTitle,
    stem,
    readingPassage,
    options,
    correctAnswer: correctIndex,
    explanation,
    points: 2,
  };
}

// Helper to make extension questions (5 points bonus each)
export function makeExtension(
  id: string,
  number: number,
  stem: string,
  options: string[],
  correctIndex: number,
  explanation: string
): ExamQuestion {
  return {
    id,
    number,
    type: 'extension',
    sectionTitle: '🌟 思维拓展冲顶题 (Bonus Challenge)',
    stem,
    options,
    correctAnswer: correctIndex,
    explanation,
    points: 5,
    isExtension: true,
  };
}
