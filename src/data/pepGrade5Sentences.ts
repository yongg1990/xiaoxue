import { SentenceItem } from '../types';
import { PEP_GRADE_5A_SENTENCES } from './pepGrade5Sentences5A';
import { PEP_GRADE_5B_SENTENCES } from './pepGrade5Sentences5B';

export const PEP_GRADE_5_SENTENCES: SentenceItem[] = [
  ...PEP_GRADE_5A_SENTENCES,
  ...PEP_GRADE_5B_SENTENCES,
];

export { PEP_GRADE_5A_SENTENCES, PEP_GRADE_5B_SENTENCES };
