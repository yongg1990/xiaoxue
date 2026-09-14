import { HomeworkGrade, HomeworkSubject } from '../../types';

export interface HomeworkQuestionItem {
  id: string;
  num: number;
  category: string; // e.g. "生字字音", "核心词汇", "语法句型", "算理计算", "实际应用", "阅读理解", "交际表达"
  stem: string;
  subStem?: string;
  options: string[];
  ans: number; // 0, 1, 2, 3
  exp: string; // Detailed explanation
  isExtension?: boolean;
}

export interface UnitHomeworkPackage {
  grade: HomeworkGrade;
  subject: HomeworkSubject;
  unitNumber: number;
  unitTitle: string;
  themeDesc: string;
  practiceCount: number; // 10-15
  questions: HomeworkQuestionItem[]; // 10-15 practice questions
  extensionQuestion: HomeworkQuestionItem; // 1 extension question
}
