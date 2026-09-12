import { WordItem, HomeworkSubject, HomeworkGrade } from '../types';

export interface GeneratedOption {
  id: string;
  label: string;
  isCorrect: boolean;
  extra?: string;
}

// Curated database of 4 similar options for high-frequency curriculum items
const CURATED_SIMILAR_OPTIONS: Record<string, string[]> = {
  // === 三年级 & 五年级 语文拼音 ===
  'róng máo': ['róng máo', 'yóng máo', 'róng miáo', 'lóng máo'],
  'huāng yě': ['huāng yě', 'huāng lǐ', 'guāng yě', 'huāng shān'],
  'cū zhuàng': ['cū zhuàng', 'chū zhuàng', 'cū shuàng', 'cū zhuāng'],
  'jié bái': ['jié bái', 'jié pái', 'jiē bái', 'jí bái'],
  'bǐng xī': ['bǐng xī', 'píng xī', 'bǐng qì', 'bǐng qī'],
  'fù shuì': ['fù shuì', 'fú shuì', 'fù suì', 'fù ruì'],
  'kǎi xuán': ['kǎi xuán', 'kǎi xuàn', 'gǎi xuán', 'kāi xuán'],
  'dān wù': ['dān wù', 'dān wu', 'dǎn wù', 'tān wù'],
  'zhǎn xīn': ['zhǎn xīn', 'zhǎn xīng', 'chǎn xīn', 'zǎn xīn'],
  'dǎo gào': ['dǎo gào', 'dào gào', 'dǎo gáo', 'tǎo gào'],
  'chà nà': ['chà nà', 'shà nà', 'chā nà', 'cà nà'],

  // === 语文成语与词语搭配 ===
  '气爽': ['气爽', '气急', '云淡', '气和'],
  '正经': ['正经', '万利', '正道', '经传'],
  '缤纷': ['缤纷', '斑斓', '绚丽', '多姿'],
  '云淡': ['云淡', '气爽', '地厚', '日暖'],
  '慢咽': ['慢咽', '细咽', '快咽', '轻吞'],
  '恐后': ['恐后', '向前', '落后', '不让'],
  '一惊': ['一惊', '大喝', '一跳', '一震'],
  '八方': ['八方', '七方', '楚歌', '八面'],
  '苦脸': ['苦脸', '展颜', '不展', '紧锁'],
  '口呆': ['口呆', '神呆', '咋舌', '口张'],
  '呼啸而过': ['呼啸而过', '狂风大作', '风驰电掣', '呼啸而来'],
  '窗户和屋顶': ['窗户和屋顶', '门板和墙壁', '窗棂与梁柱', '屋檐与青砖'],
  '动作轻捷迅速': ['动作轻捷迅速', '行动迟缓沉重', '展翅低空滑翔', '盘旋飞舞不停'],
  '草地变绿变金': ['草地变绿变金', '花瓣随风飘散', '绿树抽出新芽', '草地一片枯黄'],
  '没有一点声响': ['没有一点声响', '传来阵阵声响', '声如巨雷阵阵', '歌声清脆悠扬'],
  '注目': ['注目', '入胜', '深思', '注意'],
  '结队': ['结队', '结群', '伴行', '连片'],
  '忘食': ['忘食', '忘餐', '忘忧', '忘我'],
  '归赵': ['归赵', '归汉', '归燕', '还朝'],
  '请罪': ['请罪', '请战', '认错', '谢罪'],
  '协力': ['协力', '合力', '同德', '一心'],
  '气壮': ['气壮', '气和', '词穷', '气盛'],
  '不拔': ['不拔', '不折', '坚定', '不屈'],
  '有方': ['有方', '有道', '得力', '有术'],
  '勃勃': ['勃勃', '生辉', '焕发', '昂扬'],

  // === 语文古诗接龙 ===
  '晴方好': ['晴方好', '雨亦奇', '山色空', '波光粼'],
  '雨亦奇': ['雨亦奇', '晴方好', '草色青', '柳色新'],
  '相对出': ['相对出', '日边来', '相映红', '分外明'],
  '日边来': ['日边来', '相对出', '向东流', '碧水流'],
  '二月花': ['二月花', '春风面', '江南岸', '晚晴天'],
  '绿映红': ['绿映红', '水村郭', '酒旗风', '春光好'],
  '入竹去': ['入竹去', '出林来', '隐石间', '落深潭'],
  '处处闻啼鸟': ['处处闻啼鸟', '夜来风雨声', '花落知多少', '春眠不觉晓'],
  '春风花草香': ['春风花草香', '沙暖睡鸳鸯', '泥融飞燕子', '迟日江山丽'],
  '疑是地上霜': ['疑是地上霜', '举头望明月', '低头思故乡', '床前明月光'],
  '不及汪伦送我情': ['不及汪伦送我情', '桃花潭水深千尺', '李白乘舟将欲行', '忽闻岸上踏歌声'],
  '春风送暖入屠苏': ['春风送暖入屠苏', '爆竹声中一岁除', '千门万户曈曈日', '总把新桃换旧符'],

  // === 数学时间与测量进率 ===
  '60 秒': ['60 秒', '100 秒', '60 分钟', '30 秒'],
  '60 分钟': ['60 分钟', '100 分钟', '60 秒', '3600 秒'],
  '60 个小格': ['60 个小格', '12 个小格', '100 个小格', '5 个小格'],
  '5 分钟': ['5 分钟', '1 分钟', '10 分钟', '15 分钟'],
  '10 毫米': ['10 毫米', '100 毫米', '1 毫米', '10 分米'],
  '10 分米': ['10 分米', '100 分米', '10 厘米', '1000 毫米'],
  '1000 米': ['1000 米', '100 米', '10000 米', '10 分米'],
  '1000 千克': ['1000 千克', '100 千克', '1000 克', '10000 千克'],
  '100 平方分米': ['100 平方分米', '10 平方分米', '1000 平方分米', '100 平方厘米'],
  '10000 平方米': ['10000 平方米', '1000 平方米', '100000 平方米', '100 平方米'],
  '100 公顷': ['100 公顷', '10 公顷', '1000 公顷', '10000 公顷'],

  // === 数学口算与得数 ===
  '59': ['59', '69', '58', '49'],
  '42': ['42', '52', '41', '32'],
  '92': ['92', '82', '91', '88'],
  '45': ['45', '55', '35', '40'],
  '545': ['545', '535', '544', '645'],
  '355': ['355', '365', '455', '345'],
  '815': ['815', '805', '825', '715'],
  '264': ['264', '274', '364', '254'],
  '4 个 (4倍)': ['4 个 (4倍)', '2 个 (2倍)', '6 个 (6倍)', '8 个 (8倍)'],
  '18': ['18', '9', '12', '24'],
  '6 倍': ['6 倍', '4 倍', '8 倍', '5 倍'],
  '35': ['35', '25', '42', '30'],
  '80': ['80', '60', '800', '24'],
  '36': ['36', '32', '26', '48'],
  '315': ['315', '305', '345', '310'],
  '1000': ['1000', '100', '800', '900'],
  '1': ['1', '0.1', '10', '1.25'],
  '0.6': ['0.6', '6', '0.06', '0.56'],
  '0.72': ['0.72', '7.2', '0.072', '0.62'],
  '2.5': ['2.5', '0.25', '25', '2.05'],
  '6': ['6', '0.6', '60', '0.06'],
  '0.12': ['0.12', '1.2', '0.012', '0.22'],
  '8': ['8', '0.8', '80', '0.72'],
  'x = 5': ['x = 5', 'x = 10', 'x = 4', 'x = 6'],
  'x = 6': ['x = 6', 'x = 4', 'x = 8', 'x = 2'],
  'x = 2.4': ['x = 2.4', 'x = 2.2', 'x = 3.2', 'x = 1.8'],
  'x = 3': ['x = 3', 'x = 2.5', 'x = 3.5', 'x = 4'],
  'S = a × h': ['S = a × h', 'S = a + h', 'S = 2(a + h)', 'S = a × h ÷ 2'],
  'S = a × h ÷ 2': ['S = a × h ÷ 2', 'S = a × h', 'S = (a + h) ÷ 2', 'S = 2(a + h)'],
  'S = (a + b) × h ÷ 2': ['S = (a + b) × h ÷ 2', 'S = (a + b) × h', 'S = a × b ÷ 2', 'S = a + b + h'],
  '条形统计图': ['条形统计图', '折线统计图', '扇形统计图', '复式统计表'],
  '折线统计图': ['折线统计图', '条形统计图', '扇形统计图', '柱状统计图'],
  '扇形统计图': ['扇形统计图', '折线统计图', '条形统计图', '雷达统计图'],

  // === 英语日常情景交际 ===
  '你好！': ['你好！', '再见！', '谢谢你！', '早上好！'],
  '我的名字叫麦克。': ['我的名字叫麦克。', '我是三年级学生。', '我今年9岁了。', '这是我的书包。'],
  '摸摸你的眼睛。': ['摸摸你的眼睛。', '摸摸你的鼻子。', '摸摸你的耳朵。', '挥动你的手。'],
  '挥动你的手。': ['挥动你的手。', '拍拍你的手。', '踩踩你的脚。', '摸摸你的头。'],
  '早上好！': ['早上好！', '下午好！', '晚安！', '再见！'],
  '下午好！': ['下午好！', '早上好！', '晚上好！', '明天见！'],
  '这是一只小狗。': ['这是一只小狗。', '这是一只小猫。', '这是一只小鸭。', '这是一只小鸟。'],
  '看这只可爱的猴子。': ['看这只可爱的猴子。', '看这只大象。', '看这只熊猫。', '看这只老虎。'],
  '我有一支红色的钢笔。': ['我有一支红色的钢笔。', '我有一个书包。', '我有一把蓝色的尺子。', '我有一块橡皮。'],
  '把文具盒给我看看。': ['把文具盒给我看看。', '把铅笔给我看看。', '把书包拿过来。', '打开你的书。'],
  '我想要一些果汁。': ['我想要一些果汁。', '我想要一块面包。', '我喜欢喝牛奶。', '这是给你的蛋糕。'],
  '我可以吃一些米饭吗？': ['我可以吃一些米饭吗？', '你想喝水吗？', '我们去吃晚饭吧。', '请给我一杯茶。'],
  '我今年八岁了。': ['我今年八岁了。', '我喜欢跳舞。', '我有五只铅笔。', '我有一个弟弟。'],
  '你有多少只蜡笔？': ['你有多少只蜡笔？', '你的书包在哪里？', '这支蜡笔是什么颜色？', '你想要多少支钢笔？'],
  '他很和蔼亲切。': ['他很和蔼亲切。', '他很严格。', '他很高大强壮。', '他很有幽默感。'],
  '我们的数学老师很年轻。': ['我们的数学老师很年轻。', '我们的英语老师很有趣。', '我们的班主任很严厉。', '我的语文老师很慈祥。'],
  '我们星期四有体育课。': ['我们星期四有体育课。', '我们星期二有音乐课。', '我们星期五有美术课。', '我们在操场上跑步。'],
  '我经常在周末看书。': ['我经常在周末看书。', '我经常在周末踢足球。', '我喜欢去公园散步。', '我偶尔听音乐放松。'],
  '冰淇淋很甜。': ['冰淇淋很甜。', '炸鸡很香脆。', '辣椒很辛辣。', '沙拉很新鲜。'],
  '我最喜欢的食物是牛肉。': ['我最喜欢的食物是牛肉。', '我最喜欢的水果是苹果。', '我更喜欢喝苹果汁。', '我今天想吃面条。'],
  '树上有许多红苹果。': ['树上有许多红苹果。', '草地上有三只小羊。', '池塘里有许多鸭子。', '花园里开满了鲜花。'],
  '书桌上有一台电脑。': ['书桌上有一台电脑。', '书包里有一本词典。', '墙上挂着一张地图。', '椅子下面有一个足球。'],
};

// Shuffle helper (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates exactly 4 similar candidate answers for a given question item
 */
export function generateSimilarOptionsForQuestion(params: {
  questionId: string;
  label: string;
  subLabel?: string;
  correctItemLabel: string;
  subject: HomeworkSubject;
  grade: HomeworkGrade;
  allWords: WordItem[];
  customOptions?: string[];
}): GeneratedOption[] {
  const { questionId, label, correctItemLabel, subject, grade, allWords, customOptions } = params;

  // 1. If explicit options are provided (4 items)
  if (customOptions && customOptions.length >= 4) {
    const unique = Array.from(new Set(customOptions));
    if (!unique.includes(correctItemLabel)) {
      unique[3] = correctItemLabel;
    }
    const shuffled = shuffleArray(unique.slice(0, 4));
    return shuffled.map((opt, idx) => ({
      id: `${questionId}-opt-${idx}`,
      label: opt,
      isCorrect: opt === correctItemLabel,
    }));
  }

  // 2. Check curated dictionary
  if (CURATED_SIMILAR_OPTIONS[correctItemLabel]) {
    const pool = CURATED_SIMILAR_OPTIONS[correctItemLabel];
    const shuffled = shuffleArray(pool);
    return shuffled.map((opt, idx) => ({
      id: `${questionId}-opt-${idx}`,
      label: opt,
      isCorrect: opt === correctItemLabel,
    }));
  }

  // 3. Subject-Specific Generation
  // A. English Vocabulary (Word -> Translation)
  if (subject === 'english') {
    // Check if the correct label matches any word translation
    const sameGradeWords = allWords.filter(
      (w) => w.grade === grade && w.translation && w.translation !== correctItemLabel
    );
    // Find category or theme if available
    const currentWord = allWords.find((w) => w.translation === correctItemLabel || w.word.toLowerCase() === label.toLowerCase());
    let candidateDistractors: string[] = [];

    if (currentWord?.categoryLabel) {
      const sameCategoryWords = sameGradeWords.filter(
        (w) => w.categoryLabel === currentWord.categoryLabel
      );
      if (sameCategoryWords.length >= 3) {
        candidateDistractors = sameCategoryWords.map((w) => w.translation);
      }
    }

    if (candidateDistractors.length < 3) {
      candidateDistractors = sameGradeWords.map((w) => w.translation);
    }

    // Unique distractors
    const uniqueDistractors = Array.from(new Set(candidateDistractors.filter((d) => d !== correctItemLabel)));
    const chosenDistractors = shuffleArray(uniqueDistractors).slice(0, 3);

    // Fallbacks if not enough
    const fallbacks = ['书包', '苹果', '老师', '小猫', '快乐的', '大象', '星期一'];
    for (const f of fallbacks) {
      if (chosenDistractors.length >= 3) break;
      if (f !== correctItemLabel && !chosenDistractors.includes(f)) {
        chosenDistractors.push(f);
      }
    }

    const four = shuffleArray([correctItemLabel, ...chosenDistractors.slice(0, 3)]);
    return four.map((opt, idx) => ({
      id: `${questionId}-opt-${idx}`,
      label: opt,
      isCorrect: opt === correctItemLabel,
    }));
  }

  // B. Math Calculations
  if (subject === 'math') {
    const num = parseFloat(correctItemLabel);
    if (!isNaN(num)) {
      // Numerical calculation: create 3 plausible off-by-one or off-by-ten values
      const dist1 = num >= 10 ? (num - 10).toString() : (num + 1).toString();
      const dist2 = (num + 10).toString();
      const dist3 = num % 1 !== 0 ? (num * 10).toString() : (num - 1).toString();

      const uniqueMath = Array.from(new Set([correctItemLabel, dist1, dist2, dist3]));
      while (uniqueMath.length < 4) {
        uniqueMath.push((num + uniqueMath.length * 2).toString());
      }
      const shuffled = shuffleArray(uniqueMath.slice(0, 4));
      return shuffled.map((opt, idx) => ({
        id: `${questionId}-opt-${idx}`,
        label: opt,
        isCorrect: opt === correctItemLabel,
      }));
    }
  }

  // C. Chinese or default text
  // Extract similar words from peer items or variations
  const variants: string[] = [correctItemLabel];

  // Try creating plausible linguistic distractors
  if (correctItemLabel.length === 2) {
    const firstChar = correctItemLabel[0];
    const secondChar = correctItemLabel[1];
    variants.push(`${firstChar}之`, `大${secondChar}`, `微${secondChar}`);
  } else if (correctItemLabel.includes(' ')) {
    // Pinyin variant
    const parts = correctItemLabel.split(' ');
    variants.push(`y${parts[0].slice(1)} ${parts[1] || ''}`.trim());
    variants.push(`${parts[0]} l${(parts[1] || 'a').slice(1)}`.trim());
    variants.push(`ch${parts[0].slice(1)} ${parts[1] || ''}`.trim());
  } else {
    variants.push(`${correctItemLabel}呀`, `非${correctItemLabel}`, `${correctItemLabel}矣`);
  }

  const uniqueText = Array.from(new Set(variants));
  while (uniqueText.length < 4) {
    uniqueText.push(`选项${String.fromCharCode(65 + uniqueText.length)}`);
  }

  const shuffled = shuffleArray(uniqueText.slice(0, 4));
  return shuffled.map((opt, idx) => ({
    id: `${questionId}-opt-${idx}`,
    label: opt,
    isCorrect: opt === correctItemLabel,
  }));
}
