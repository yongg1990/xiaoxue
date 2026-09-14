import { HomeworkGrade, HomeworkSubject } from '../../types';
import { UnitHomeworkPackage } from './types';
import { GRADE_3_HOMEWORK } from './grade3Homework';
import { GRADE_4_HOMEWORK } from './grade4Homework';
import { GRADE_5_HOMEWORK } from './grade5Homework';
import { GRADE_6_HOMEWORK } from './grade6Homework';

export * from './types';
export { GRADE_3_HOMEWORK } from './grade3Homework';
export { GRADE_4_HOMEWORK } from './grade4Homework';
export { GRADE_5_HOMEWORK } from './grade5Homework';
export { GRADE_6_HOMEWORK } from './grade6Homework';

const ALL_HOMEWORK: Record<HomeworkGrade, Record<HomeworkSubject, Record<number, UnitHomeworkPackage>>> = {
  '3': GRADE_3_HOMEWORK,
  '4': GRADE_4_HOMEWORK,
  '5': GRADE_5_HOMEWORK,
  '6': GRADE_6_HOMEWORK,
};

export function getUnitHomeworkPackage(
  grade: HomeworkGrade,
  subject: HomeworkSubject,
  unitNumber: number
): UnitHomeworkPackage | undefined {
  const gradeData = ALL_HOMEWORK[grade];
  if (!gradeData) return undefined;
  const subjectData = gradeData[subject];
  if (!subjectData) return undefined;
  return subjectData[unitNumber];
}

export function getAllUnitsForSubject(
  grade: HomeworkGrade,
  subject: HomeworkSubject
): UnitHomeworkPackage[] {
  const gradeData = ALL_HOMEWORK[grade];
  if (!gradeData) return [];
  const subjectData = gradeData[subject];
  if (!subjectData) return [];
  return Object.values(subjectData).sort((a, b) => a.unitNumber - b.unitNumber);
}
