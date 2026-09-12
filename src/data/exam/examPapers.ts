import { GradeLevel } from '../../types';
import { ExamPaper, ExamSubject } from './types';
import { generateChineseExam, generateMathExam, generateEnglishExam } from './generateExamData';

/**
 * Accessor for all grades and subjects in the Exam screen.
 * Each paper contains exactly 50 standard questions (100 points total) + 2 extension challenge questions.
 */
export function getExamPaper(grade: GradeLevel, subject: ExamSubject): ExamPaper {
  if (subject === 'math') {
    return generateMathExam(grade);
  }
  if (subject === 'chinese') {
    return generateChineseExam(grade);
  }
  return generateEnglishExam(grade);
}
