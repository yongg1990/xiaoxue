export type GradeLevel = '3' | '4' | '5' | '6';
export type SemesterType = 'A' | 'B'; // 'A' = 上册 (First Semester), 'B' = 下册 (Second Semester)
export type SemesterKey = '3A' | '3B' | '4A' | '4B' | '5A' | '5B' | '6A' | '6B';

export interface StudentProfile {
  id: string;
  name: string;
  chineseName?: string;
  grade: string; // e.g. 'Grade 3' or '三年级'
  gradeLevel: GradeLevel; // '3' | '4' | '5' | '6'
  semester: SemesterType; // 'A' | 'B'
  avatar: string;
  streakDays: number;
  totalStars: number;
  wordsMastered: string[]; // cumulative word IDs
  todayLearnedWords: string[]; // word IDs learned today (10 words = 100%)
  lastActiveDate: string; // 'YYYY-MM-DD' for daily reset
  completedQuizzesCount: number;
  badgesUnlocked: string[]; // badge IDs
  dailyGoal: number; // exactly 10 words (= 100%)
  todayProgress: number; // 0 - 100%
}

export interface UnitInfo {
  id: string; // e.g. '3A-U1'
  semesterKey: SemesterKey; // e.g. '3A'
  grade: GradeLevel;
  semester: SemesterType;
  unitNumber: number;
  title: string; // English title, e.g. 'Making Friends'
  chineseTitle: string; // Chinese title, e.g. '交朋友'
  theme: string; // Theme description, e.g. '认识新朋友与自我介绍'
  icon: string; // Emoji icon
  color: string;
  bgLight: string;
  borderColor: string;
  isNew2024?: boolean; // Highlight for 2024 new PEP edition
}

export interface WordItem {
  id: string;
  word: string; // e.g. 'ELEPHANT'
  phonetic?: string; // e.g. '/ˈelɪfənt/'
  phonics?: string; // e.g. 'ear', 'm-ou-th', 'ar-m', 'h-a-n-d'
  pinyin: string; // e.g. 'dà xiàng'
  translation: string; // e.g. '大象'
  partOfSpeech?: string; // e.g. 'n.', 'v.', 'adj.'
  grade: GradeLevel;
  semester: SemesterType;
  semesterKey: SemesterKey;
  unitId: string; // e.g. '3A-U3'
  unitName: string; // e.g. 'Unit 3 Amazing Animals'
  category: string; // e.g. 'animals', 'colors', 'family', 'food', etc.
  categoryLabel: string; // e.g. '动物', '颜色'
  imageUrl: string;
  quizImageUrl?: string;
  englishDefinition: string;
  exampleSentence: string;
  exampleTranslation: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  englishName: string;
  icon: string;
  color: string;
  bgLight: string;
  borderColor: string;
}

export interface QuizQuestion {
  id: string;
  targetWord: WordItem;
  options: WordItem[]; // 4 options
  correctOptionId: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  chineseTitle: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progressText: string;
  targetCount: number;
  currentCount: number;
}

export interface WordToken {
  word: string; // bare word without punctuation
  display: string; // displayed token with punctuation if any
  meaning: string; // Chinese meaning in context
  phonetic?: string; // IPA phonetic
  partOfSpeech?: string; // n., v., pron., adj., etc.
  highlight?: boolean; // highlight curriculum key words
}

export interface SentenceItem {
  id: string;
  grade: GradeLevel; // '3'
  semester: SemesterType; // 'A' | 'B'
  semesterKey: SemesterKey; // '3A' | '3B'
  unitId: string; // e.g. '3A-U1'
  unitName: string; // e.g. 'Unit 1 Making Friends'
  unitChineseTitle: string; // e.g. '交朋友'
  pageNumber: number; // e.g. 4
  pageLabel: string; // e.g. '第4页'
  section: string; // e.g. "Let's talk", "Let's learn", "Listen and chant", "Reading", "Project"
  speaker?: string; // e.g. "Wu Binbin", "John", "Miss White", "Teacher", "Amy"
  sentence: string; // Full English sentence
  chineseTranslation: string; // Complete Chinese translation
  wordsBreakdown: WordToken[]; // Word-by-word breakdown with Chinese meanings
  grammarTip?: string; // Sentence structure / grammar / daily usage notes
  audioText?: string;
}

export type ActiveTab = 'home' | 'sentences' | 'cards' | 'quiz' | 'homework' | 'badges' | 'exam';

export type HomeworkGrade = '3' | '4' | '5' | '6';
export type HomeworkSubject = 'chinese' | 'math' | 'english';

export interface DragCandidateOption {
  id: string;
  label: string;
  extra?: string;
  isCorrect: boolean;
}

export interface DragQuestion {
  id: string;
  questionNumber: number;
  label: string;
  subLabel?: string;
  hint?: string;
  correctItemLabel: string;
  unitTag?: string;
  unitNumber?: number;
  options: DragCandidateOption[]; // 4 similar candidate answers for this question
}

export interface DragMatchItem {
  id: string;
  label: string;
  extra?: string;
  targetId: string;
}

export interface DragTargetSlot {
  id: string;
  label: string;
  subLabel?: string;
  hint?: string;
  correctItemId: string;
  unitTag?: string;
  unitNumber?: number;
}

export interface DragExercise {
  id: string;
  title: string;
  instruction: string;
  unitNumber?: number;
  isCumulative?: boolean;
  slots: DragTargetSlot[];
  items: DragMatchItem[];
  questions?: DragQuestion[];
}

export interface DailyHomeworkTask {
  id: string;
  title: string;
  unitNumber?: number;
  unitTag?: string;
  type: 'choice' | 'calc' | 'complete';
  stem: string;
  hint?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UnitCurriculumData {
  unitNumber: number;
  title: string;
  themeDesc: string;
  dragSlots: Array<{
    id: string;
    label: string;
    subLabel: string;
    correctItemLabel: string;
    options?: string[];
    extra?: string;
  }>;
  dailyTasks: DailyHomeworkTask[];
}

