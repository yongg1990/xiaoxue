import { GradeLevel } from '../../types';
import { ExamPaper, ExamQuestion, ExamSubject } from './types';

// Helper to make true/false judge questions (2 points each)
function makeJudge(
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
function makeChoice(
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
function makeExtension(
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

// =========================================================================
// 1. MATH EXAM GENERATOR (50 standard questions + 2 extension questions)
// =========================================================================
export function generateMathExam(grade: GradeLevel): ExamPaper {
  const gradeLabel = grade === '4' ? '四年级' : grade === '5' ? '五年级' : '六年级';
  const q: ExamQuestion[] = [];

  // Section 1: 一、口算与速算精炼 (1-12题, 共12题)
  const calcItems = [
    { stem: '计算：25 × 4 = (  )', opts: ['100', '1000', '80', '125'], ans: 0, exp: '25 × 4 = 100。' },
    { stem: '计算：125 × 8 = (  )', opts: ['1000', '100', '800', '10000'], ans: 0, exp: '125 × 8 = 1000。' },
    { stem: '计算：360 ÷ 6 = (  )', opts: ['60', '6', '600', '36'], ans: 0, exp: '360 ÷ 6 = 60。' },
    { stem: '计算：240 × 20 = (  )', opts: ['4800', '480', '48000', '2400'], ans: 0, exp: '24 × 2 = 48，末尾添两个 0 得 4800。' },
    { stem: '计算：7200 ÷ 90 = (  )', opts: ['80', '8', '800', '90'], ans: 0, exp: '7200 ÷ 90 = 80。' },
    { stem: '计算：15 × 60 = (  )', opts: ['900', '90', '600', '750'], ans: 0, exp: '15 × 6 = 90，末尾添 0 得 900。' },
    { stem: '把 450000 改写成用“万”作单位的数是：', opts: ['45万', '450万', '4.5万', '4500万'], ans: 0, exp: '去掉个级 4 个 0，加上“万”字，得 45万。' },
    { stem: '比较大小：100000 (  ) 99999', opts: ['>', '<', '=', '无法比较'], ans: 0, exp: '六位数大于五位数。' },
    { stem: '计算：0.8 × 0.5 = (  )', opts: ['0.4', '4', '0.04', '0.45'], ans: 0, exp: '8 × 5 = 40，两位小数得 0.40 即 0.4。' },
    { stem: '计算：5.6 ÷ 0.7 = (  )', opts: ['8', '0.8', '80', '7'], ans: 0, exp: '56 ÷ 7 = 8。' },
    { stem: '计算：1/3 + 1/6 = (  )', opts: ['1/2', '2/9', '1/9', '2/6'], ans: 0, exp: '通分：2/6 + 1/6 = 3/6 = 1/2。' },
    { stem: '计算：3/4 × 2/3 = (  )', opts: ['1/2', '5/7', '6/12', '1/4'], ans: 0, exp: '分子相乘得 6，分母相乘得 12，约分得 1/2。' },
  ];

  calcItems.forEach((item, idx) => {
    const num = idx + 1;
    q.push(makeChoice(`g${grade}-m-${num}`, num, '一、口算与速算精炼 (1-12题)', item.stem, item.opts, item.ans, item.exp, undefined, 'calc'));
  });

  // Section 2: 二、概念辨析与判断 (13-25题, 共13题)
  const judgeItems = [
    { stem: '平角就是一条直线。', isTrue: false, exp: '平角有顶点和两条边，而直线没有端点，不能说平角是一条直线。' },
    { stem: '平行线之间的距离处处相等。', isTrue: true, exp: '从一条平行线上任意一点向另一条作垂线段，长度都相等。' },
    { stem: '两个锐角的和一定比钝角大。', isTrue: false, exp: '例如 20° + 30° = 50°，依然是锐角。' },
    { stem: '梯形是只有一组对边平行的四边形。', isTrue: true, exp: '这是梯形的标准数学定义。' },
    { stem: '小数的末尾添上“0”或去掉“0”，小数的大小不变。', isTrue: true, exp: '这是小数的基本性质。' },
    { stem: '0.5 和 0.50 大小相等，但计数单位不同。', isTrue: true, exp: '0.5 的单位是十分之一，0.50 的单位是百分之一。' },
    { stem: '三角形的内角和在任何情况下都是 180 度。', isTrue: true, exp: '欧式平面几何中三角形内角和恒为 180°。' },
    { stem: '一个自然数不是奇数就是偶数。', isTrue: true, exp: '整数按能否被 2 整除可完全分为奇数和偶数。' },
    { stem: '所有的质数都是奇数。', isTrue: false, exp: '2 是偶数也是质数，是唯一的偶质数。' },
    { stem: '棱长为 6 厘米的正方体，它的表面积和体积数值相等。', isTrue: false, exp: '表面积单位是平方厘米，体积单位是立方厘米，单位不同不能比较。' },
    { stem: '真分数都小于 1，假分数都大于或等于 1。', isTrue: true, exp: '真分数分子小于分母，假分数分子大于或等于分母。' },
    { stem: '两个面积相等的三角形一定能拼成一个平行四边形。', isTrue: false, exp: '只有两个完全一样的三角形才能拼成平行四边形。' },
    { stem: '圆的周长与它的直径的比值是一个固定的常数，称为圆周率 π。', isTrue: true, exp: '周长 C = πd，比值恒为 π。' },
  ];

  judgeItems.forEach((item, idx) => {
    const num = 13 + idx;
    q.push(makeJudge(`g${grade}-m-${num}`, num, '二、概念辨析与判断 (13-25题)', item.stem, item.isTrue, item.exp));
  });

  // Section 3: 三、核心素养单选题 (26-38题, 共13题)
  const choiceItems = [
    { stem: '用一个放大 5 倍的放大镜看一个 30° 的角，看到的角的度数是：', opts: ['30°', '150°', '60°', '无法确定'], ans: 0, exp: '角的大小由两边张开的幅度决定，与边的长短无关，度数不变仍是 30°。' },
    { stem: '在 3.14、3.1414...、π、3.144 这四个数中，最大的数是：', opts: ['3.144', 'π', '3.1414...', '3.14'], ans: 0, exp: 'π ≈ 3.14159...，比较千分位：3.144 > π(3.14159) > 3.1414... > 3.14。' },
    { stem: '把一根绳子连续对折 3 次，每一小段绳子占全长的：', opts: ['1/8', '1/6', '1/4', '1/3'], ans: 0, exp: '对折 3 次分成 2³ = 8 段，每段占全长的 1/8。' },
    { stem: '一个长方体长 5 厘米、宽 4 厘米、高 3 厘米，它的表面积是：', opts: ['94 平方厘米', '60 平方厘米', '47 平方厘米', '120 平方厘米'], ans: 0, exp: '表面积 = 2 × (5×4 + 5×3 + 4×3) = 2 × (20 + 15 + 12) = 2 × 47 = 94 平方厘米。' },
    { stem: '把 5 克盐溶解在 95 克水中，盐占盐水重量的百分之几？', opts: ['5%', '5.26%', '95%', '10%'], ans: 0, exp: '盐水重 5 + 95 = 100 克，盐占 5 ÷ 100 = 5%。' },
    { stem: '方程 2x + 5 = 15 的解是：', opts: ['x = 5', 'x = 10', 'x = 2.5', 'x = 4'], ans: 0, exp: '2x = 10，解得 x = 5。' },
    { stem: '下列年份中，属于平年的是：', opts: ['2026年', '2024年', '2020年', '2000年'], ans: 0, exp: '2026 不能被 4 整除，是平年（365天）。' },
    { stem: '小明走 1/2 千米用了 1/6 小时，他走 1 千米需要多少小时？', opts: ['1/3 小时', '3 小时', '1/12 小时', '1/4 小时'], ans: 0, exp: '1/6 ÷ 1/2 = 1/6 × 2 = 1/3 小时。' },
    { stem: '小明今年 a 岁，爸爸今年 (a + 28) 岁，再过 10 年，爸爸比小明大：', opts: ['28 岁', '38 岁', '18 岁', '无法确定'], ans: 0, exp: '两人的年龄差永远不变，仍是 28 岁。' },
    { stem: '下列各数中，不能化成有限小数的是：', opts: ['1/3', '1/4', '3/8', '7/20'], ans: 0, exp: '最简分数分母含有因数 3，不能化为有限小数。' },
    { stem: '掷一枚质地均匀的正方体骰子，朝上的点数是质数的可能性是：', opts: ['1/2', '1/3', '1/6', '2/3'], ans: 0, exp: '质数有 2, 3, 5 共 3 个，3 ÷ 6 = 1/2。' },
    { stem: '两个完全相同的梯形一定可以拼成一个：', opts: ['平行四边形', '长方形', '正方形', '正三角形'], ans: 0, exp: '旋转 180 度拼接必成平行四边形。' },
    { stem: '一个圆形花坛的半径是 4 米，它的周长是：(π取3.14)', opts: ['25.12 米', '50.24 米', '12.56 米', '16 米'], ans: 0, exp: '周长 C = 2 × 3.14 × 4 = 25.12 米。' },
  ];

  choiceItems.forEach((item, idx) => {
    const num = 26 + idx;
    q.push(makeChoice(`g${grade}-m-${num}`, num, '三、核心素养单选题 (26-38题)', item.stem, item.opts, item.ans, item.exp));
  });

  // Section 4: 四、实际生活应用题 (39-50题, 共12题)
  const appItems = [
    { stem: '学校操场长 120 米，宽 80 米。它的占地面积是多少平方米？', opts: ['9600 平方米', '400 平方米', '4800 平方米', '19200 平方米'], ans: 0, exp: '面积 = 长 × 宽 = 120 × 80 = 9600 平方米。' },
    { stem: '商店运来 15 箱苹果，每箱重 25 千克，一共运来多少千克苹果？', opts: ['375 千克', '350 千克', '400 千克', '325 千克'], ans: 0, exp: '15 × 25 = 375 千克。' },
    { stem: '小明读一本 240 页的故事书，前 3 天读了 72 页。照这样计算，读完全书需要多少天？', opts: ['10 天', '8 天', '12 天', '15 天'], ans: 0, exp: '每天读 72 ÷ 3 = 24 页，240 ÷ 24 = 10 天。' },
    { stem: '一辆汽车从甲地开往乙地，每小时行驶 75 千米，4 小时到达。如果每小时行驶 60 千米，需要几小时到达？', opts: ['5 小时', '4.5 小时', '6 小时', '5.5 小时'], ans: 0, exp: '总路程 75 × 4 = 300 千米，300 ÷ 60 = 5 小时。' },
    { stem: '小红买了 4 支铅笔和 1 个笔记本，铅笔每支 2.5 元，笔记本每个 8 元，小红一共花了多少元？', opts: ['18 元', '16 元', '20 元', '15 元'], ans: 0, exp: '4 × 2.5 + 8 = 10 + 8 = 18 元。' },
    { stem: '王老师带 500 元去买体育器材，买篮球用去 260 元，剩下的钱买每副 15 元的跳绳，最多可以买多少副？', opts: ['16 副', '15 副', '17 副', '18 副'], ans: 0, exp: '剩余 500 - 260 = 240 元，240 ÷ 15 = 16 副。' },
    { stem: '工程队修一条长 1800 米的公路，前 4 天修了 600 米。照这样计算，修完这条公路一共还要多少天？', opts: ['8 天', '12 天', '10 天', '6 天'], ans: 0, exp: '每天修 600 ÷ 4 = 150 米，还剩 1200 米，1200 ÷ 150 = 8 天。' },
    { stem: '果园里有苹果树 120 棵，梨树的棵数比苹果树的 2 倍少 30 棵，果园里有梨树多少棵？', opts: ['210 棵', '240 棵', '270 棵', '190 棵'], ans: 0, exp: '120 × 2 - 30 = 240 - 30 = 210 棵。' },
    { stem: '学校合唱队有男生 24 人，女生人数比男生多 1/3，女生有多少人？', opts: ['32 人', '30 人', '28 人', '36 人'], ans: 0, exp: '24 × (1 + 1/3) = 24 × 4/3 = 32 人。' },
    { stem: '一件商品原价 200 元，商场搞促销打八折销售，现在买这件商品可以便宜多少元？', opts: ['40 元', '160 元', '20 元', '50 元'], ans: 0, exp: '便宜 200 × (1 - 0.8) = 200 × 0.2 = 40 元。' },
    { stem: '小华家平均每月可节约用水 1.5 吨。一年（12个月）一共可以节水多少吨？', opts: ['18 吨', '15 吨', '20 吨', '16.5 吨'], ans: 0, exp: '1.5 × 12 = 18 吨。' },
    { stem: '一块长方形菜地长 20 米，宽 15 米，四周如果围上篱笆，篱笆的长是多少米？', opts: ['70 米', '300 米', '35 米', '140 米'], ans: 0, exp: '周长 = (20 + 15) × 2 = 70 米。' },
  ];

  appItems.forEach((item, idx) => {
    const num = 39 + idx;
    q.push(makeChoice(`g${grade}-m-${num}`, num, '四、实际生活应用题 (39-50题)', item.stem, item.opts, item.ans, item.exp, undefined, 'application'));
  });

  // 2 道思维拓展题 (编号 51, 52)
  const ext: ExamQuestion[] = [
    makeExtension(
      `g${grade}-m-ext-1`,
      51,
      '【数学拓展 1·图形转化与割补思维】在一个长 10 厘米、宽 8 厘米的长方形四个角上，分别剪去一个边长为 2 厘米的小正方形。剩下的多边形图形的周长和面积与原长方形相比，发生了什么变化？',
      [
        '剩余图形的周长与原长方形相等，面积减少了 16 平方厘米',
        '剩余图形的周长减少了 16 厘米，面积减少了 16 平方厘米',
        '剩余图形的周长增加了 8 厘米，面积不变',
        '剩余图形的周长减少了 8 厘米，面积减少了 8 平方厘米'
      ],
      0,
      '【名师解析】平移法转化思维！在长方形的四个角各剪去一个正方形后，凹进去的两条新边正好平移到外边，封闭周长与原长方形周长完全相同（周长不变）。而面积则直接减去 4 个小正方形的面积：4 × (2 × 2) = 16 平方厘米。'
    ),
    makeExtension(
      `g${grade}-m-ext-2`,
      52,
      '【数学拓展 2·极值与统筹规划】小明和同学们共 14 人准备租船游湖。公园提供两种船只：大船限乘 6 人，每次租金 30 元；小船限乘 4 人，每次租金 24 元。经过科学规划，怎样租船最省钱，最少需要多少元？',
      [
        '租 2 条大船和 1 条小船，最少花费 84 元',
        '租 4 条小船，最少花费 96 元',
        '租 3 条大船，最少花费 90 元',
        '租 1 条大船和 2 条小船，最少花费 78 元'
      ],
      0,
      '【名师解析】单价比较与整数规划！计算每人座位的单价：大船 30 ÷ 6 = 5 元/人；小船 24 ÷ 4 = 6 元/人。大船比小船更便宜，所以应优先多租大船，同时尽量不空座。如果租 2 条大船坐 12 人，再租 1 条小船坐 2 人，总人数刚好满 14 人无空座，总费用为 2 × 30 + 24 = 84 元。因此最省钱方案是 2 条大船 + 1 条小船，总共 84 元。'
    ),
  ];

  return {
    id: `exam-g${grade}-math`,
    grade,
    gradeLabel,
    subject: 'math',
    subjectLabel: '数学',
    title: `${gradeLabel}数学上册 · 综合素养满分冲刺卷`,
    subtitle: '口算速算 · 概念辨析 · 核心素养 · 实际建模 · 满分100分冲刺',
    unitName: '综合与应用核心能力测验',
    totalScore: 100,
    questionsCount: 50,
    extensionCount: 2,
    sections: [
      { title: '一、口算与速算精炼', startNum: 1, endNum: 12, description: '运算定律、进率换算、乘除速算' },
      { title: '二、概念辨析与判断', startNum: 13, endNum: 25, description: '几何图形、数与代数基本性质辨析' },
      { title: '三、核心素养单选题', startNum: 26, endNum: 38, description: '运算策略、空间观念、生活估算' },
      { title: '四、实际生活应用题', startNum: 39, endNum: 50, description: '工程行程、面积规划、购物应用建模' },
    ],
    questions: q,
    extensionQuestions: ext,
  };
}

// =========================================================================
// 2. CHINESE EXAM GENERATOR (50 standard questions + 2 extension questions)
// =========================================================================
export function generateChineseExam(grade: GradeLevel): ExamPaper {
  const gradeLabel = grade === '4' ? '四年级' : grade === '5' ? '五年级' : '六年级';
  const q: ExamQuestion[] = [];

  // Section 1: 一、字词拼音与汉字正音 (1-12题, 共12题)
  const pinyinItems = [
    { stem: '下列加点字的读音完全正确的一组是：', opts: ['薄雾(bó) 屹立(yì)', '闷雷(mēn) 昂首(áng)', '颤动(zhàn) 霎时(shà)', '逐渐(zhú) 踮脚(dié)'], ans: 0, exp: '薄雾(bó)与屹立(yì)读音完全规范正确。' },
    { stem: '“浩浩荡荡”中“浩”的偏旁部首是：', opts: ['氵 (三点水)', '口 (口字旁)', '告 (告字旁)', '一 (横)'], ans: 0, exp: '“浩”是左右结构，部首是三点水。' },
    { stem: '下列词语书写完全正确的一项是：', opts: ['风平浪静 · 齐头并进', '山崩地裂 · 慢天卷地', '水天相接 · 人声鼎沸', '若隐若现 · 浩浩荡荡'], ans: 0, exp: '风平浪静、齐头并进书写规范无误。' },
    { stem: '“风号浪吼”中“号”的正确读音是：', opts: ['háo', 'hào', 'hǎo', 'hāo'], ans: 0, exp: '形容风声大，读 háo，如号叫、哀号。' },
    { stem: '“鼎”字用部首查字法应查“目”部。', isTrue: false, exp: '“鼎”本身就是部首，查“鼎”部，共 12 画。' },
    { stem: '“笼罩”中“笼”在这里读：', opts: ['lǒng', 'lóng', 'nóng', 'lòng'], ans: 0, exp: '笼罩、笼络读 lǒng；鸟笼读 lóng。' },
    { stem: '“霎时”的“霎”读作 shà，意思是极短的时间。', isTrue: true, exp: '“霎时”形容时间极短，眨眼之间。' },
    { stem: '“余波”的“余”在这里的意思是：', opts: ['残留的，剩下的', '多余的无用之物', '我', '剩余的时间'], ans: 0, exp: '“余波”指事件或大潮过去后残留的波浪。' },
    { stem: '下列成语中没有错别字的一组是：', opts: ['横贯江面', '人声鼎费', '齐头并近', '山崩地烈'], ans: 0, exp: '人声鼎沸、齐头并进、山崩地裂。' },
    { stem: '“沸腾”的“沸”读音是：', opts: ['fèi', 'fú', 'fì', 'bèi'], ans: 0, exp: '沸水、沸腾读 fèi。' },
    { stem: '“踮着脚”的“踮”读音是 diǎn。', isTrue: true, exp: '踮起脚尖读 diǎn。' },
    { stem: '汉字“顿”用音序查字法应查大写字母：', opts: ['D', 'T', 'B', 'P'], ans: 0, exp: '顿拼音 dùn，音序为 D。' },
  ];

  pinyinItems.forEach((item, idx) => {
    const num = idx + 1;
    if ('isTrue' in item) {
      q.push(makeJudge(`g${grade}-c-${num}`, num, '一、字词拼音与汉字正音 (1-12题)', item.stem, item.isTrue, item.exp));
    } else {
      q.push(makeChoice(`g${grade}-c-${num}`, num, '一、字词拼音与汉字正音 (1-12题)', item.stem, item.opts, item.ans, item.exp));
    }
  });

  // Section 2: 二、词语积累与成语运用 (13-24题, 共12题)
  const wordItems = [
    { stem: '“风平浪静”的反义词是：', opts: ['波涛汹涌', '微风拂面', '水波不兴', '风和日丽'], ans: 0, exp: '风平浪静形容水面平静，反义词为波浪滔天的波涛汹涌。' },
    { stem: '“人声鼎沸”中“鼎”的原意是：', opts: ['古代烹煮用的一种器物', '大锅', '钟鼎', '头顶'], ans: 0, exp: '鼎是古代重器，鼎沸比喻人声喧闹嘈杂像水在鼎中翻滚。' },
    { stem: '“犹如千万匹白色战马齐头并进”中“犹如”的意思是：', opts: ['好像', '因为', '并且', '如果'], ans: 0, exp: '犹如即“好像、如同”，常作比喻词。' },
    { stem: '成语填空：山(  )地裂，漫天(  )地。', opts: ['崩 / 卷', '破 / 扫', '倒 / 铺', '裂 / 盖'], ans: 0, exp: '山崩地裂、漫天卷地。' },
    { stem: '“逐渐”的近义词是：', opts: ['渐渐', '突然', '立刻', '马上'], ans: 0, exp: '逐渐与渐渐都表示程度或数量逐步缓慢发生。' },
    { stem: '“屹立”通常用来形容像高山般笔直稳固地挺立。', isTrue: true, exp: '屹立形容坚定不可动摇。' },
    { stem: '下列句子中加点成语使用恰当的一项是：', opts: ['听到激动人心的好消息，操场上顿时人声鼎沸。', '今天江面上波涛汹涌，真是风平浪静的好天气。', '他做事总是浩浩荡荡，让人捉摸不透。', '天空中若隐若现地挂着一轮刺眼的烈日。'], ans: 0, exp: 'A项人声鼎沸用来形容操场人群欢腾热烈最切合语境。' },
    { stem: '把词语补充完整：(  )天相接，齐头(  )进。', opts: ['水 / 并', '云 / 快', '天 / 争', '海 / 前'], ans: 0, exp: '水天相接、齐头并进。' },
    { stem: '选词填空：过了一会儿，江面上(  )了平静。', opts: ['恢复', '复习', '重现', '回来'], ans: 0, exp: '恢复平静是习惯搭配。' },
    { stem: '“宽阔”通常用来形容视野、马路、江面等。', isTrue: true, exp: '宽阔的江面、宽阔的大道。' },
    { stem: '形容声音极其响亮宏大的成语是：', opts: ['震耳欲聋', '轻言细语', '悄无声息', '微乎其微'], ans: 0, exp: '震耳欲聋形容声响极大快把耳朵震聋。' },
    { stem: '“静寂”的反义词是“喧闹”。', isTrue: true, exp: '静寂指安静寂寥，反面为喧闹。' },
  ];

  wordItems.forEach((item, idx) => {
    const num = 13 + idx;
    if ('isTrue' in item) {
      q.push(makeJudge(`g${grade}-c-${num}`, num, '二、词语积累与成语运用 (13-24题)', item.stem, item.isTrue, item.exp));
    } else {
      q.push(makeChoice(`g${grade}-c-${num}`, num, '二、词语积累与成语运用 (13-24题)', item.stem, item.opts, item.ans, item.exp));
    }
  });

  // Section 3: 三、重点句式与修辞手法 (25-36题, 共12题)
  const sentenceItems = [
    { stem: '“浪潮越来越近，犹如千万匹白色战马齐头并进。”运用的修辞手法是：', opts: ['比喻', '拟人', '夸张', '排比'], ans: 0, exp: '把翻滚的白浪比作千万匹白色战马，本体是浪潮，喻体是战马，比喻词是犹如。' },
    { stem: '“那声音如同山崩地裂，好像大地都被震得颤动起来。”运用的修辞手法是：', opts: ['夸张与比喻', '对偶与借代', '反问与设问', '拟人与排比'], ans: 0, exp: '“如同山崩地裂”运用比喻与夸张，极力渲染声音之宏大。' },
    { stem: '将反问句“浪潮飞奔而来，难道不壮观吗？”改为陈述句，正确的是：', opts: ['浪潮飞奔而来，真壮观。', '浪潮飞奔而来，一点也不壮观。', '浪潮飞奔而来，难道很壮观吗？', '浪潮飞奔而来，真是不太壮观。'], ans: 0, exp: '反问句改陈述句去掉反问词，语气坚定肯定。' },
    { stem: '“海上的夜是柔和的，是静寂的，是梦幻的。”句式运用了排比。', isTrue: true, exp: '三个结构相同、语意相连的短句构成排比。' },
    { stem: '下列句子标点符号使用完全规范的一项是：', opts: ['午后一点左右，从远处传来隆隆的响声，好像闷雷滚动。', '江面很平静、水天相接的地方出现了一条白线。', '“今天天气真好”！小明高兴地说。', '你看，那是什么花？菊花？玫瑰？'], ans: 0, exp: 'A项标点规范正确；B项不用顿号；C项感叹号应在引号内；D项连续疑问标点不规范。' },
    { stem: '修改病句：“通过这次生动的讲座，使我增长了见识。”最正确的修改方法是：', opts: ['去掉“通过”或去掉“使”', '把“增长”改为“增加”', '在句末加上“的过程”', '把“见识”改为“学问”'], ans: 0, exp: '滥用介词导致主语缺失，去掉“通过”或“使”。' },
    { stem: '“秋虫唱着，夜鸟拍翅飞过。”运用了拟人的修辞手法。', isTrue: true, exp: '把秋虫当作人来写会“唱歌”。' },
    { stem: '下列诗句中，描写月光美景的一项是：', opts: ['露从今夜白，月是故乡明', '一道残阳铺水中，半江瑟瑟半江红', '千山鸟飞绝，万径人踪灭', '离离原上草，一岁一枯荣'], ans: 0, exp: '“月是故乡明”描写皎洁月色并寄托浓烈思乡之情。' },
    { stem: '下列句子中没有语病的一项是：', opts: ['钱塘江大潮自古以来被称为天下奇观。', '经过努力，他的写作水平有了明显改进。', '大家必须要注意安全防范意识。', '虽然下着大雨，但他还是没有来。'], ans: 0, exp: 'A项表述流畅语法严密。B项水平应与“提高”搭配；C项“注意”与“意识”搭配不当。' },
    { stem: '“美丽的菊花在秋风中频频点头微笑着。”这句话运用了拟人手法。', isTrue: true, exp: '“点头微笑”赋予菊花人的神态动作。' },
    { stem: '下列句子属于设问句的是：', opts: ['是谁来呼风唤雨呢？当然是人类。', '难道你不觉得大自然很奇妙吗？', '你今天什么时候回家吃饭呢？', '请问去图书馆应该走哪条路？'], ans: 0, exp: '自问自答构成设问。' },
    { stem: '“春天来了，万物复苏，大地换上了绿色的新装。”这句话是比喻句也是拟人句。', isTrue: true, exp: '把绿色植物比作新装，大地会换衣服是拟人。' },
  ];

  sentenceItems.forEach((item, idx) => {
    const num = 25 + idx;
    if ('isTrue' in item) {
      q.push(makeJudge(`g${grade}-c-${num}`, num, '三、重点句式与修辞手法 (25-36题)', item.stem, item.isTrue, item.exp));
    } else {
      q.push(makeChoice(`g${grade}-c-${num}`, num, '三、重点句式与修辞手法 (25-36题)', item.stem, item.opts, item.ans, item.exp));
    }
  });

  // Section 4: 四、经典名句与阅读理解 (37-50题, 共14题)
  const readingPassage = `钱塘江大潮，自古以来被称为天下奇观。农历八月十八是一年一度的观潮日。午后一点左右，从远处传来隆隆的响声，好像闷雷滚动。顿时人声鼎沸，有人告诉我们，潮来了！我们踮着脚往东望去，江面还是风平浪静，看不出有什么变化。过了一会儿，响声越来越大，只见东边水天相接的地方出现了一条白线，人群又沸腾起来。那条白线很快向我们移来，逐渐拉长，变粗，横贯江面。再近些，只见白浪翻滚，形成一堵两丈多高的水墙。浪潮越来越近，犹如千万匹白色战马齐头并进，浩浩荡荡地飞奔而来；那声音如同山崩地裂，好像大地都被震得颤动起来。`;

  const litAndReadingItems = [
    { stem: '“八月十八潮，壮观天下无。”这句赞叹钱塘潮的名句出自宋代文学家：', opts: ['苏轼', '李白', '辛弃疾', '陆游'], ans: 0, exp: '苏轼作有《催试官考较戏作》，留下这一千古名句。' },
    { stem: '“一道残阳铺水中，半江瑟瑟半江红。”描绘的是哪个季节的傍晚景色？', opts: ['深秋', '盛夏', '初春', '寒冬'], ans: 0, exp: '出自白居易《暮江吟》，描绘深秋九月初三江畔夕阳。' },
    { stem: '“不识庐山真面目，只缘身在此山中。”这两句名诗出自苏轼的：', opts: ['《题西林壁》', '《饮湖上初晴后雨》', '《赤壁赋》', '《水调歌头》'], ans: 0, exp: '出自苏轼《题西林壁》。' },
    { stem: '我国古代“四大名著”包括《红楼梦》《三国演义》《水浒传》和：', opts: ['《西游记》', '《儒林外史》', '《聊斋志异》', '《封神演义》'], ans: 0, exp: '中国古典长篇小说四大名著为三国、水浒、西游、红楼。' },
    { stem: '“独在异乡为异客，每逢佳节倍思亲。”中的“佳节”指的是：', opts: ['重阳节 (九月九日)', '中秋节 (八月十五)', '清明节', '端午节'], ans: 0, exp: '后句为“遍插茱萸少一人”，插茱萸是重阳节习俗。' },
    { stem: '唐代“诗仙”指李白，“诗圣”指杜甫。', isTrue: true, exp: '盛唐两大文学巨匠。' },
    { stem: '《繁星》的作者是我国著名现代女作家冰心，原名谢婉莹。', isTrue: true, exp: '冰心先生代表作《繁星》《春水》《寄小读者》。' },
    // Reading items from passage
    { passage: readingPassage, stem: '阅读短文，钱塘江大潮在什么时候迎来一年一度的最佳观潮日？', opts: ['农历八月十八', '中秋节八月十五', '重阳节九月初九', '农历正月初一'], ans: 0, exp: '文中明确写道“农历八月十八是一年一度的观潮日”。' },
    { passage: readingPassage, stem: '阅读短文，大潮初来时，从远处传来的声音好像：', opts: ['闷雷滚动', '山崩地裂', '战马飞奔', '风号浪吼'], ans: 0, exp: '“午后一点左右，从远处传来隆隆的响声，好像闷雷滚动”。' },
    { passage: readingPassage, stem: '阅读短文，作者描写大潮由远及近的形状变化顺序是：', opts: ['白线 → 水墙 → 白色战马', '水墙 → 白线 → 白色战马', '白色战马 → 水墙 → 白线', '风平浪静 → 白色战马 → 水墙'], ans: 0, exp: '顺序：水天相接的一条白线 → 两丈多高的水墙 → 千万匹白色战马。' },
    { passage: readingPassage, stem: '阅读短文，“白浪翻滚，形成一堵两丈多高的水墙”主要突出了大潮的：', opts: ['浪头极高，水势凶猛壮观', '声音非常刺耳', '水质清澈无瑕', '速度极其缓慢'], ans: 0, exp: '“两丈多高”极力摹写浪头高大巍峨的壮丽水势。' },
    { passage: readingPassage, stem: '阅读短文，观潮人群由“人声鼎沸”到“又沸腾起来”，反映了人们：', opts: ['看到大潮奇观时无比兴奋与震撼的心情', '因等待过久而感到不耐烦', '害怕江水漫上大堤的恐惧', '对自然景观漠不关心'], ans: 0, exp: '人们内心的狂喜、惊叹与震撼之情。' },
    { passage: readingPassage, stem: '阅读短文，作者按照“由远及近、由声及色”的顺序生动描绘了大潮。', isTrue: true, exp: '先写远处闷雷滚动，再写白线、水墙、战马，空间层次极为分明。' },
    { passage: readingPassage, stem: '阅读短文，“那声音如同山崩地裂”运用了夸张的比喻手法。', isTrue: true, exp: '以山崩地裂极力烘托大潮拍岸的巨大声响。' },
  ];

  litAndReadingItems.forEach((item, idx) => {
    const num = 37 + idx;
    if ('isTrue' in item) {
      q.push(makeJudge(`g${grade}-c-${num}`, num, '四、经典名句与阅读理解 (37-50题)', item.stem, item.isTrue, item.exp));
    } else {
      q.push(makeChoice(`g${grade}-c-${num}`, num, '四、经典名句与阅读理解 (37-50题)', item.stem, item.opts, item.ans, item.exp, item.passage, item.passage ? 'reading' : 'choice'));
    }
  });

  // 2 道思维拓展题 (编号 51, 52)
  const ext: ExamQuestion[] = [
    makeExtension(
      `g${grade}-c-ext-1`,
      51,
      '【名著思维拓展 1·经典智慧辨析】在古典文学名著《三国演义》中，“草船借箭”是家喻户晓的智谋故事。诸葛亮之所以能够借箭成功，下列分析中最为全面深刻的一项是：',
      [
        '知天文（料定大雾漫天）、识地理（谙熟江水流向）、晓人心（深知曹操多疑谨慎）',
        '全凭运气好，碰巧江面上起了漫天大雾',
        '曹操军中兵器太丰富，想主动赠送弓箭给东吴',
        '周瑜暗中相助，故意命令鲁肃把船只借给诸葛亮'
      ],
      0,
      '【名师解析】综合思维素养！诸葛亮成功借箭绝非偶然，鲁肃赞其神机妙算。他夜观天象预知三天后江上必有大雾（通晓天文）；顺流而下受箭后顺风顺水返回（精通地理）；深知曹操在雾中绝不敢轻易出兵只会乱箭射之（洞悉人性心理）。三者完美结合方成千古奇谋。'
    ),
    makeExtension(
      `g${grade}-c-ext-2`,
      52,
      '【诗词意境拓展 2·千古哲理领悟】宋代文学家苏轼在《题西林壁》中写道：“横看成岭侧成峰，远近高低各不同。不识庐山真面目，只缘身在此山中。”这首诗蕴含的人生哲理是：',
      [
        '观察事物如果只局限于片面或身处其中，就往往看不清事物的整体全貌；要想全面认识客观事物，必须跳出局部，从多个角度审视。',
        '庐山的风景每天都在变化，游客永远也无法看完全部的秀美风光。',
        '山峰高低起伏，爬山的人很容易迷失方向。',
        '只要身在名山之中，就能领悟到大自然所有的奥秘。'
      ],
      0,
      '【名师解析】经典哲理辨析！《题西林壁》不仅描绘了庐山雄奇多姿的自然风貌，更通过“不识庐山真面目，只缘身在此山中”揭示了深刻的哲理：当局者迷，旁观者清。人们面对复杂事物，如果陷于狭隘的局部视角，就很难看清真相；只有立足整体、多方位全面观察，才能把握事物的客观全貌。'
    ),
  ];

  return {
    id: `exam-g${grade}-chinese`,
    grade,
    gradeLabel,
    subject: 'chinese',
    subjectLabel: '语文',
    title: `${gradeLabel}语文上册 · 综合素养满分冲刺卷`,
    subtitle: '字词正音 · 词句积累 · 修辞手法 · 经典古诗 · 语篇精读 · 满分100分冲刺',
    unitName: '语文综合能力与阅读理解',
    totalScore: 100,
    questionsCount: 50,
    extensionCount: 2,
    sections: [
      { title: '一、字词拼音与汉字正音', startNum: 1, endNum: 12, description: '声母韵母、多音字、汉字笔顺部首' },
      { title: '二、词语积累与成语运用', startNum: 13, endNum: 24, description: '近义词反义词、成语填空、语境搭配' },
      { title: '三、重点句式与修辞手法', startNum: 25, endNum: 36, description: '比喻排比、修改病句、标点符号规范' },
      { title: '四、经典名句与阅读理解', startNum: 37, endNum: 50, description: '千古名句、文学常识、典范语篇精读' },
    ],
    questions: q,
    extensionQuestions: ext,
  };
}

// =========================================================================
// 3. ENGLISH EXAM GENERATOR (50 standard questions + 2 extension questions)
// =========================================================================
export function generateEnglishExam(grade: GradeLevel): ExamPaper {
  const gradeLabel = grade === '4' ? '四年级' : grade === '5' ? '五年级' : '六年级';
  const q: ExamQuestion[] = [];

  type ExamItemDef =
    | { stem: string; opts: string[]; ans: number; exp: string }
    | { stem: string; isTrue: boolean; exp: string };

  // Section 1: 一、语音与字母音标 (1-10题, 共10题)
  // Grade 4: a-e, i-e, o-e, u-e, -e- 发音规律与基础语音辨析
  // Grade 5: 字母组合发音规律 (ee/ea, ai/ay, ow, oo, y) 与词尾发音
  // Grade 6: 音标辨析、重音连读、句调与不发音字母规律
  const phonicsList: ExamItemDef[] = grade === '4' ? [
    { stem: 'Which word has the /eɪ/ vowel sound as in "cake"?', opts: ['make', 'cat', 'bag', 'apple'], ans: 0, exp: '“make”中的 a-e 组合发双元音 /eɪ/，与 cake 发音相同。' },
    { stem: 'Which word has the /aɪ/ vowel sound as in "like"?', opts: ['kite', 'big', 'six', 'pig'], ans: 0, exp: '“kite”中的 i-e 组合发双元音 /aɪ/，与 like 发音相同。' },
    { stem: 'Which word has the /əʊ/ vowel sound as in "nose"?', opts: ['rose', 'hot', 'dog', 'box'], ans: 0, exp: '“rose”中的 o-e 组合发双元音 /əʊ/，与 nose 发音相同。' },
    { stem: 'Which word has the /juː/ sound as in "cute"?', opts: ['use', 'bus', 'duck', 'cup'], ans: 0, exp: '“use”中的 u-e 组合发 /juː/，与 cute 发音规律一致。' },
    { stem: 'Which word has the /e/ vowel sound as in "red"?', opts: ['leg', 'me', 'he', 'she'], ans: 0, exp: '“leg”中的字母 e 处于闭音节发短音 /e/，与 red 相同。' },
    { stem: 'Which letter is silent (不发音) in the word "listen"?', opts: ['t', 's', 'l', 'n'], ans: 0, exp: '单词“listen”中字母 t 不发音。' },
    { stem: 'Which word rhymes with (押韵) "light"?', opts: ['night', 'late', 'lot', 'let'], ans: 0, exp: 'night 和 light 押 /aɪt/ 韵。' },
    { stem: 'The plural form of "desk" is "desks".', isTrue: true, exp: '一般名词变复数直接加 s。' },
    { stem: 'The plural form of "box" is "boxes".', isTrue: true, exp: '以 x 结尾的名词变复数加 es，读作 /ɪz/。' },
    { stem: 'The words "sun" and "son" have the same pronunciation /sʌn/.', isTrue: true, exp: '同音词，均读 /sʌn/。' },
  ] : grade === '6' ? [
    { stem: 'In which word does the underlined part have the /ɔː/ sound as in "horse"?', opts: ['fork', 'work', 'word', 'world'], ans: 0, exp: 'fork 中的 or 发长元音 /ɔː/，work/word/world 中的 or 发 /ɜː/。' },
    { stem: 'In which word is the letter "k" silent (不发音)?', opts: ['knee', 'kite', 'keep', 'king'], ans: 0, exp: 'knee 中首字母 k 不发音。' },
    { stem: 'In the sentence "How can I get to the museum?", what is the intonation (语调)?', opts: ['降调 (Falling tone ↘)', '升调 (Rising tone ↗)', '平调', '无规律'], ans: 0, exp: '特殊疑问句在英语日常交际中通常使用降调 (Falling tone ↘)。' },
    { stem: 'In the sentence "Can you help me?", what is the standard intonation (语调)?', opts: ['升调 (Rising tone ↗)', '降调 (Falling tone ↘)', '重读', '弱读'], ans: 0, exp: '一般疑问句在英语中通常以升调 (Rising tone ↗) 结尾。' },
    { stem: 'Which word has the stress (重音) on the second syllable (第二音节)?', opts: ['police', 'science', 'worker', 'farmer'], ans: 0, exp: 'po\'lice 重音在第二音节，其余词重音在第一音节。' },
    { stem: 'In the phrase "put it on", what phonetic phenomenon (语音现象) occurs?', opts: ['Liaison / Linking (连读)', 'Inversion (倒装)', 'Silent (全不发音)', 'Tone change'], ans: 0, exp: '“辅音+元音”在朗读时产生自然连读 (Liaison)。' },
    { stem: 'The words "hour" and "our" have the exact same pronunciation /aʊə(r)/.', isTrue: true, exp: '同音词，hour 的字母 h 不发音，两者均读 /aʊə(r)/。' },
    { stem: 'The words "sea" and "see" are homophones (同音词).', isTrue: true, exp: 'sea 和 see 均发 /siː/。' },
    { stem: 'Which letter is silent (不发音) in the word "sign"?', opts: ['g', 's', 'i', 'n'], ans: 0, exp: 'sign 读 /saɪn/，其中字母 g 不发音。' },
    { stem: 'The plural form of "child" is "children".', isTrue: true, exp: 'child 的不规则复数形式是 children。' },
  ] : [
    // Grade 5 (PEP 2024新版)
    { stem: 'Which word has the /iː/ vowel sound as in "beef"?', opts: ['tea', 'bread', 'head', 'breakfast'], ans: 0, exp: '“tea”中的 ea 组合发长元音 /iː/，与 beef 发音相同。' },
    { stem: 'Which word has the /eɪ/ sound as in "wait"?', opts: ['say', 'cat', 'sad', 'apple'], ans: 0, exp: '“say”中的 ay 组合发双元音 /eɪ/。' },
    { stem: 'Which word has the /aʊ/ sound as in "cow"?', opts: ['how', 'slow', 'snow', 'yellow'], ans: 0, exp: '“how”中的 ow 组合发 /aʊ/，而 slow/snow 中的 ow 发 /əʊ/。' },
    { stem: 'Which word has the /uː/ sound as in "food"?', opts: ['cool', 'book', 'look', 'foot'], ans: 0, exp: 'cool 和 food 均发长音 /uː/，book/look/foot 发短音 /ʊ/。' },
    { stem: 'Which word ends with the /i/ sound as in "baby"?', opts: ['happy', 'my', 'cry', 'fly'], ans: 0, exp: 'happy 词尾的 y 发弱化短元音 /i/，my/cry/fly 发 /aɪ/。' },
    { stem: 'Which word has a different vowel sound from the others?', opts: ['book (短/ʊ/)', 'food (长/uː/)', 'look (短/ʊ/)', 'cook (短/ʊ/)'], ans: 1, exp: 'food 发长音 /uː/，其他发短音 /ʊ/。' },
    { stem: 'The letter "h" in "hour" is silent (不发音).', isTrue: true, exp: 'hour 读 /aʊə/，h 不发音。' },
    { stem: 'Which pair of words has the SAME vowel sound?', opts: ['see - bee', 'cat - car', 'hot - home', 'cut - put'], ans: 0, exp: 'see 和 bee 都发 /iː/ 音。' },
    { stem: 'Which word starts with the /k/ sound?', opts: ['kite', 'knife', 'knee', 'know'], ans: 0, exp: 'knife, knee, know 中的 k 均不发音，kite 发 /k/。' },
    { stem: 'The word "sun" and "son" have the same pronunciation /sʌn/.', isTrue: true, exp: '同音词，均读 /sʌn/。' },
  ];

  phonicsList.forEach((item, idx) => {
    const num = idx + 1;
    if ('isTrue' in item) {
      q.push(makeJudge(`g${grade}-e-${num}`, num, '一、语音与字母音标 (1-10题)', item.stem, item.isTrue, item.exp));
    } else {
      q.push(makeChoice(`g${grade}-e-${num}`, num, '一、语音与字母音标 (1-10题)', item.stem, item.opts, item.ans, item.exp));
    }
  });

  // Section 2: 二、核心词汇与短语辨析 (11-25题, 共15题)
  const vocabList: ExamItemDef[] = grade === '4' ? [
    // Grade 4 PEP (义务教育教科书 / 2024新版: 4A Units 1-6)
    { stem: 'Look! The new computer is on the teacher\'s (  ).', opts: ['desk', 'wall', 'window', 'floor'], ans: 0, exp: '电脑摆放在讲桌 (teacher\'s desk) 上。' },
    { stem: 'Turn on the (  ). It is dark in the classroom.', opts: ['light', 'fan', 'door', 'floor'], ans: 0, exp: '天黑了需要打开电灯 (light)。' },
    { stem: 'Let me clean the (  ). I can wipe off the chalk writing.', opts: ['blackboard', 'picture', 'light', 'fan'], ans: 0, exp: '擦黑板是 clean the blackboard。' },
    { stem: 'I have an English book, a maths book and three (  ) in my schoolbag.', opts: ['storybooks', 'classroom', 'pencil box', 'wall'], ans: 0, exp: 'storybooks 意为故事书，与课本书本同列。' },
    { stem: 'What colour is your new schoolbag? — It is blue and (  ).', opts: ['white', 'quiet', 'friendly', 'strong'], ans: 0, exp: 'white (白色) 是描述颜色的词。' },
    { stem: 'Don\'t eat too much (  ). It is bad for your teeth.', opts: ['candy', 'notebook', 'key', 'toy'], ans: 0, exp: 'candy 意为糖果，吃太多对牙齿不好。' },
    { stem: 'My best friend Mike is tall and (  ). He can carry heavy bags.', opts: ['strong', 'thin', 'short', 'weak'], ans: 0, exp: '能搬重物说明高大强壮 (tall and strong)。' },
    { stem: 'Wu Binbin is very (  ). He always reads books quietly in the classroom.', opts: ['quiet', 'noisy', 'angry', 'afraid'], ans: 0, exp: '安静阅读说明文静 (quiet)。' },
    { stem: 'John has short black hair and brown (  ).', opts: ['glasses', 'shoe', 'hat', 'nose'], ans: 0, exp: 'glasses 意为眼镜，常以复数形式出现。' },
    { stem: 'Where is my mother? — She is cooking dinner in the (  ).', opts: ['kitchen', 'bedroom', 'living room', 'study'], ans: 0, exp: '厨房烹饪晚餐，使用 kitchen。' },
    { stem: 'You can read books and do homework quietly in the (  ).', opts: ['study', 'bathroom', 'kitchen', 'garage'], ans: 0, exp: 'study 意为书房，是阅读和学习的房间。' },
    { stem: 'What would you like for dinner? — I\'d like some (  ) and noodles, please.', opts: ['beef', 'fork', 'spoon', 'chopsticks'], ans: 0, exp: 'beef (牛肉) 是美味佳肴。' },
    { stem: 'In China, people usually eat rice and noodles with (  ).', opts: ['chopsticks', 'forks', 'knives', 'straws'], ans: 0, exp: '中国传统用餐使用筷子 (chopsticks)。' },
    { stem: 'My aunt works in a big hospital. She is a kind (  ).', opts: ['nurse', 'farmer', 'cook', 'driver'], ans: 0, exp: '在医院工作的女性医务人员是护士 (nurse)。' },
    { stem: '“parents”的中文意思是：', opts: ['父母（爸爸妈妈）', '祖父母', '兄弟姐妹', '叔叔阿姨'], ans: 0, exp: 'parents 意为父母双亲。' },
  ] : grade === '6' ? [
    // Grade 6 PEP (义务教育教科书 / 2024新版: 6A Units 1-6)
    { stem: 'We can see dinosaurs and spaceships in the (  ).', opts: ['science museum', 'post office', 'bookstore', 'hospital'], ans: 0, exp: '科学博物馆是 science museum。' },
    { stem: 'I want to send a postcard and buy stamps in the (  ).', opts: ['post office', 'cinema', 'crossing', 'zoo'], ans: 0, exp: '寄明信片和买邮票在邮局 (post office)。' },
    { stem: 'Turn (  ) at the bookstore, and you will see the hospital on your right.', opts: ['left', 'straight', 'next', 'near'], ans: 0, exp: 'turn left 意为向左转。' },
    { stem: 'My home is near our school, so I usually go to school on (  ).', opts: ['foot', 'bike', 'bus', 'subway'], ans: 0, exp: '步行是固定短语 on foot。' },
    { stem: 'Travelling by (  ) is very fast and runs underground in the city.', opts: ['subway', 'ship', 'plane', 'foot'], ans: 0, exp: '城市地下轨道交通是地铁 (subway)。' },
    { stem: 'When you ride a bicycle or motorcycle, you should always wear a (  ).', opts: ['helmet', 'postcard', 'dictionary', 'comic'], ans: 0, exp: '骑车佩戴头盔是 wear a helmet。' },
    { stem: 'The traffic light is red. We must (  ) and wait.', opts: ['stop', 'go', 'speed up', 'run'], ans: 0, exp: '红灯停：Stop and wait at a red light。' },
    { stem: 'What are you going to do this Saturday? — I\'m going to (  ) my grandparents.', opts: ['visit', 'buy', 'send', 'feel'], ans: 0, exp: 'visit grandparents 意为看望祖父母。' },
    { stem: 'I want to see an exciting new film in the (  ) tonight.', opts: ['cinema', 'supermarket', 'school', 'hospital'], ans: 0, exp: '看电影去电影院 (cinema)。' },
    { stem: 'This English-Chinese (  ) helps me look up unfamiliar words.', opts: ['dictionary', 'comic book', 'postcard', 'newspaper'], ans: 0, exp: '英汉词典是 dictionary。' },
    { stem: 'Peter is from Australia. He likes (  ) Chinese and cooking food.', opts: ['studying', 'studies', 'study', 'studied'], ans: 0, exp: 'like doing sth. 表示习惯爱好，study 变为 studying。' },
    { stem: 'Oliver is interested in language puzzles. He often does (  ) puzzles after school.', opts: ['word', 'film', 'trip', 'worker'], ans: 0, exp: '做字谜填字游戏是 do word puzzles。' },
    { stem: 'Mr White works in a car factory. He is a (  ).', opts: ['factory worker', 'postman', 'police officer', 'fisherman'], ans: 0, exp: '工厂工人是 factory worker。' },
    { stem: 'Miss Zhang works in a laboratory and does scientific research. She is a (  ).', opts: ['scientist', 'pilot', 'coach', 'driver'], ans: 0, exp: '从事科学研究的人是科学家 (scientist)。' },
    { stem: 'When you feel angry or nervous, you should take a deep (  ) and count to ten.', opts: ['breath', 'head', 'food', 'film'], ans: 0, exp: '深吸一口气是 take a deep breath。' },
  ] : [
    // Grade 5 PEP (义务教育教科书 / 2024新版: 5A Units 1-6)
    { stem: 'Our new classmate Oliver is from Australia. He is tall and (  ).', opts: ['strong', 'weak', 'sad', 'lazy'], ans: 0, exp: '新同学 Oliver 身材高大强壮 (tall and strong)。' },
    { stem: 'Chen Jie is (  ). She always wears a warm smile and everyone likes her.', opts: ['lovely', 'angry', 'afraid', 'strict'], ans: 0, exp: '招人喜爱、讨人喜欢用 lovely。' },
    { stem: 'She solves difficult problems quickly. She is very (  ).', opts: ['clever', 'tired', 'slow', 'afraid'], ans: 0, exp: '思维敏捷、聪明伶俐用 clever。' },
    { stem: 'She loves going to school and helps a lot at home. She is (  ).', opts: ['hard-working', 'lazy', 'worried', 'noisy'], ans: 0, exp: '勤劳刻苦、勤勉努力用 hard-working。' },
    { stem: 'Emma doesn\'t make loud noise. She loves reading. She is very (  ).', opts: ['quiet', 'noisy', 'angry', 'afraid'], ans: 0, exp: '安静文静用 quiet。' },
    { stem: 'The opposite (反义词) of "happy" is: (  )', opts: ['sad', 'proud', 'kind', 'active'], ans: 0, exp: 'happy (快乐的) 反义词是 sad (悲伤的)。' },
    { stem: 'I won first prize in the contest! My parents are very (  ) of me.', opts: ['proud', 'worried', 'angry', 'afraid'], ans: 0, exp: 'be proud of 意为为……感到自豪骄傲。' },
    { stem: 'What do you usually do on the (  )? — I often play football with friends.', opts: ['weekend', 'habit', 'nature', 'teeth'], ans: 0, exp: 'on the weekend 在周末。' },
    { stem: 'We should balance (平衡) our work and (  ).', opts: ['play', 'soup', 'river', 'mountain'], ans: 0, exp: 'work and play 劳逸结合。' },
    { stem: 'Eating more fresh vegetables is a (  ) habit.', opts: ['healthy', 'bad', 'harmful', 'dirty'], ans: 0, exp: '多吃新鲜蔬菜是健康的好习惯 (healthy habit)。' },
    { stem: 'You should brush your (  ) every morning and evening.', opts: ['teeth', 'tooths', 'toothes', 'teethes'], ans: 0, exp: 'tooth 的复数形式是 teeth。' },
    { stem: 'Never skip (  ). It gives you energy for the whole morning.', opts: ['breakfast', 'homework', 'nature', 'exercise'], ans: 0, exp: 'breakfast 是早餐。' },
    { stem: 'These red apples are sweet and very (  ).', opts: ['fresh', 'worried', 'strict', 'afraid'], ans: 0, exp: '苹果新鲜美味用 fresh。' },
    { stem: 'There are tall green trees and wild birds in the deep (  ).', opts: ['forest', 'classroom', 'cinema', 'hospital'], ans: 0, exp: 'forest 是森林。' },
    { stem: '“classmate”的中文意思是：', opts: ['同班同学', '老师', '邻居', '队友'], ans: 0, exp: 'classmate 意为同班同学。' },
  ];

  vocabList.forEach((item, idx) => {
    const num = 11 + idx;
    if ('isTrue' in item) {
      q.push(makeJudge(`g${grade}-e-${num}`, num, '二、核心词汇与短语辨析 (11-25题)', item.stem, item.isTrue, item.exp));
    } else {
      q.push(makeChoice(`g${grade}-e-${num}`, num, '二、核心词汇与短语辨析 (11-25题)', item.stem, item.opts, item.ans, item.exp));
    }
  });

  // Section 3: 三、句型结构与情景交际 (26-40题, 共15题)
  const grammarList: ExamItemDef[] = grade === '4' ? [
    // Grade 4 PEP (义务教育教科书 / 2024新版)
    { stem: '— (  ) is the picture? — It is on the wall.', opts: ['Where', 'What', 'Who', 'How'], ans: 0, exp: '询问位置用 Where（在哪里）。' },
    { stem: 'Let\'s (  ) the classroom together. — OK!', opts: ['clean', 'cleans', 'cleaning', 'cleaned'], ans: 0, exp: 'Let\'s 后面接动词原形 clean。' },
    { stem: '— What\'s in your schoolbag? — (  ) English book and two pencils.', opts: ['An', 'A', 'Two', 'The'], ans: 0, exp: 'English 以元音音素开头，单个用冠词 An。' },
    { stem: '— (  ) is he? — He is Zhang Peng, our new classmate.', opts: ['Who', 'Where', 'What', 'How'], ans: 0, exp: '询问人是谁用疑问词 Who。' },
    { stem: 'He is very tall and he (  ) big brown eyes.', opts: ['has', 'have', 'is', 'are'], ans: 0, exp: '主语 he 是第三人称单数，表示“有”用 has。' },
    { stem: '— (  ) she in the living room? — Yes, she is.', opts: ['Is', 'Are', 'Do', 'Does'], ans: 0, exp: '主语 she 搭配 be 动词 Is。' },
    { stem: 'Where (  ) the keys? — They are on the fridge.', opts: ['are', 'is', 'am', 'be'], ans: 0, exp: '主语 the keys 是复数，用 be 动词 are。' },
    { stem: '— What would you like for dinner? — (  ) like some soup and rice, please.', opts: ["I'd", "I am", "I have", "I can"], ans: 0, exp: "I'd like (I would like) 是表达点餐意愿的礼貌用语。" },
    { stem: '— Help yourself (  ) some beef and fish. — Thank you!', opts: ['to', 'at', 'on', 'with'], ans: 0, exp: 'Help yourself to sth. 是招待客人随便享用美食的固定句型。' },
    { stem: '— (  ) people are there in your family? — Three. My parents and me.', opts: ['How many', 'How much', 'How old', 'How about'], ans: 0, exp: '询问可数名词 people 的数量用 How many。' },
    { stem: '— What\'s your father\'s job? — He is (  ) cook.', opts: ['a', 'an', 'the', '/'], ans: 0, exp: 'cook 以辅音音素开头，表示“一名厨师”用 a cook。' },
    { stem: 'There (  ) a teacher\'s desk and forty chairs in our classroom.', opts: ['is', 'are', 'be', 'am'], ans: 0, exp: 'there be 就近原则，紧随其后的 a teacher\'s desk 是单数，用 is。' },
    { stem: 'There (  ) four books on the table.', opts: ['are', 'is', 'am', 'be'], ans: 0, exp: 'four books 是复数，用 are。' },
    { stem: 'In English, every sentence must start with a capital letter (首字母大写).', isTrue: true, exp: '英语句子的第一个单词首字母必须大写。' },
    { stem: 'The plural form of "glass" is "glasses".', isTrue: true, exp: '以 s/ss 结尾的名词变复数加 es。' },
  ] : grade === '6' ? [
    // Grade 6 PEP (义务教育教科书 / 2024新版)
    { stem: '— (  ) can I get to the science museum? — Turn left at the bookstore.', opts: ['How', 'Where', 'What', 'Why'], ans: 0, exp: '询问如何到达某地用“How can I get to...?”。' },
    { stem: 'The post office is (  ) to the cinema.', opts: ['next', 'near', 'beside', 'front'], ans: 0, exp: '紧挨着、在旁边是固定短语 next to。' },
    { stem: '— How do you come to school? — Usually I come (  ) foot.', opts: ['on', 'by', 'with', 'in'], ans: 0, exp: '步行是 on foot。' },
    { stem: 'Stop and wait at a (  ) light.', opts: ['red', 'yellow', 'green', 'blue'], ans: 0, exp: '红灯停：Stop and wait at a red light。' },
    { stem: 'What are you (  ) to do this weekend? — I am going to see a film.', opts: ['going', 'go', 'goes', 'went'], ans: 0, exp: 'be going to 结构表示一般将来时打算做某事。' },
    { stem: 'Where (  ) you going tomorrow morning? — To the bookstore.', opts: ['are', 'is', 'am', 'do'], ans: 0, exp: '主语是 you，搭配 be 动词 are。' },
    { stem: 'Peter (  ) reading stories and studying Chinese.', opts: ['likes', 'like', 'liking', 'liked'], ans: 0, exp: '主语 Peter 为单三，动词用 likes。' },
    { stem: '— (  ) he live in Sydney? — Yes, he does.', opts: ['Does', 'Do', 'Is', 'Are'], ans: 0, exp: '主语 he 的一般现在时疑问句由 Does 引导。' },
    { stem: '— What does your mother (  )? — She is an English teacher.', opts: ['do', 'does', 'did', 'doing'], ans: 0, exp: '助动词 does 后面跟动词原形 do。' },
    { stem: 'Where does a fisherman work? — He works (  ) sea.', opts: ['at', 'in', 'on', 'with'], ans: 0, exp: '在海上工作是固定短语 at sea。' },
    { stem: 'Sarah feels sad. We should (  ) her a warm hug.', opts: ['give', 'gives', 'giving', 'gave'], ans: 0, exp: '情态动词 should 后面接动词原形 give。' },
    { stem: 'If you feel cold, you (  ) wear a warm jacket.', opts: ['should', 'shouldn\'t', 'mustn\'t', 'can\'t'], ans: 0, exp: '如果觉得冷，应当 (should) 穿暖和的外套。' },
    { stem: 'Robin is going to buy a new comic book (  ) next Sunday.', opts: ['/', 'on', 'at', 'in'], ans: 0, exp: '带有 next 的时间短语前通常不加介词。' },
    { stem: 'The irregular plural form of "man" is "men".', isTrue: true, exp: 'man 的不规则复数形式为 men。' },
    { stem: 'In "be going to + do", the verb after "to" must be in its base form (动词原形).', isTrue: true, exp: 'be going to 后面必须接动词原形。' },
  ] : [
    // Grade 5 PEP (义务教育教科书 / 2024新版)
    { stem: '— (  ) is your new classmate like? — She is quiet and kind.', opts: ['What', 'How', 'Who', 'Where'], ans: 0, exp: 'What is ... like? 用于询问人的性格品质。' },
    { stem: '— How do you (  ) today? — I feel very happy.', opts: ['feel', 'feels', 'feeling', 'felt'], ans: 0, exp: '助动词 do 后面接动词原形 feel。' },
    { stem: 'She (  ) worried because her little dog is ill.', opts: ['is', 'are', 'am', 'be'], ans: 0, exp: '第三人称单数 she 搭配 is。' },
    { stem: 'There (  ) a bridge and many tall trees in the nature park.', opts: ['is', 'are', 'be', 'have'], ans: 0, exp: 'there be 遵循就近原则，a bridge 为单数，用 is。' },
    { stem: 'There (  ) four fresh apples on the table.', opts: ['are', 'is', 'am', 'be'], ans: 0, exp: 'four fresh apples 为复数，用 are。' },
    { stem: '— (  ) you often play sports on the weekend? — Yes, I do.', opts: ['Do', 'Does', 'Are', 'Is'], ans: 0, exp: '主语为 you，一般现在时疑问句用助动词 Do。' },
    { stem: '— What would you like for lunch? — (  ) like some fish and tomato soup.', opts: ["I'd", 'I am', 'I have', 'I do'], ans: 0, exp: "I'd like (I would like) 是表达点餐意愿的礼貌用语。" },
    { stem: 'We (  ) protect the clean river and green mountains.', opts: ['should', 'should not', 'cannot', 'needn\'t'], ans: 0, exp: '表示责任和义务建议，用情态动词 should。' },
    { stem: 'Let\'s (  ) together to keep our classroom clean.', opts: ['work', 'works', 'working', 'worked'], ans: 0, exp: 'Let\'s 后面接动词原形 work。' },
    { stem: '— Is your father strict? — (  )', opts: ['Yes, he is.', 'Yes, he does.', 'No, he is.', 'Yes, he can.'], ans: 0, exp: '以 Is he...? 提问，肯定回答是 Yes, he is.。' },
    { stem: 'She (  ) long black hair and two big eyes.', opts: ['has', 'have', 'is', 'are'], ans: 0, exp: '第三人称单数 she 拥有长发，用 has。' },
    { stem: 'My sister (  ) her homework every afternoon.', opts: ['does', 'do', 'doing', 'did'], ans: 0, exp: '主语 My sister 为单三，用 does。' },
    { stem: '— Where is the nature park? — It is (  ) our school.', opts: ['near', 'at', 'on', 'with'], ans: 0, exp: 'near our school 在我们学校附近。' },
    { stem: 'English sentences must always start with a capital letter (大写字母).', isTrue: true, exp: '英语句子首字母必须大写。' },
    { stem: 'The plural form of "city" is "cities".', isTrue: true, exp: '以辅音字母加 y 结尾的名词变复数把 y 改为 i 再加 es。' },
  ];

  grammarList.forEach((item, idx) => {
    const num = 26 + idx;
    if ('isTrue' in item) {
      q.push(makeJudge(`g${grade}-e-${num}`, num, '三、句型结构与情景交际 (26-40题)', item.stem, item.isTrue, item.exp));
    } else {
      q.push(makeChoice(`g${grade}-e-${num}`, num, '三、句型结构与情景交际 (26-40题)', item.stem, item.opts, item.ans, item.exp));
    }
  });

  // Section 4: 四、短文阅读理解 (41-50题, 共10题)
  let passText1 = '';
  let passText2 = '';
  let readingList: Array<{
    passage: string;
    stem: string;
    opts?: string[];
    ans?: number;
    isTrue?: boolean;
    exp: string;
  }> = [];

  if (grade === '4') {
    passText1 = `Hello! My name is Wu Binbin. Welcome to our new classroom in Grade 4. It is on the second floor. Our classroom is very big and bright. There are six big windows and eight lights. The walls are white and the floor is green. In the front, there is a large blackboard and a new computer on the teacher's desk. My friend Mike is tall and strong. He sits near the window. We clean our classroom every afternoon. We all love our happy classroom.`;
    passText2 = `It is 6:30 p.m. It's time for dinner! Sarah's mother is in the kitchen. She says, "Dinner's ready! Come and eat, please." Sarah's father is a doctor. He works in a big hospital. He would like some beef and rice. Sarah's mother is an English teacher. She would like some vegetable soup and noodles. Sarah likes chicken. She can use chopsticks very well. Her baby brother is only three years old. He uses a small spoon. Sarah's family is very warm and happy.`;

    readingList = [
      // Passage 1 questions (41-45)
      { passage: passText1, stem: 'Where is Wu Binbin\'s classroom?', opts: ['On the second floor', 'On the first floor', 'On the third floor', 'On the fourth floor'], ans: 0, exp: '“It is on the second floor.”' },
      { passage: passText1, stem: 'How many windows are there in the classroom?', opts: ['Six', 'Eight', 'Four', 'Ten'], ans: 0, exp: '“There are six big windows and eight lights.”' },
      { passage: passText1, stem: 'What is Mike like?', opts: ['Tall and strong', 'Short and thin', 'Quiet and shy', 'Angry'], ans: 0, exp: '“My friend Mike is tall and strong.”' },
      { passage: passText1, stem: 'Where is the new computer?', opts: ['On the teacher\'s desk', 'On the floor', 'Under the chair', 'Near the door'], ans: 0, exp: '“a new computer on the teacher\'s desk.”' },
      { passage: passText1, stem: 'Wu Binbin and his classmates clean the classroom every afternoon.', isTrue: true, exp: '“We clean our classroom every afternoon.”' },

      // Passage 2 questions (46-50)
      { passage: passText2, stem: 'What time is dinner ready at Sarah\'s home?', opts: ['At 6:30 p.m.', 'At 7:00 p.m.', 'At 6:00 p.m.', 'At 5:30 p.m.'], ans: 0, exp: '“It is 6:30 p.m. It\'s time for dinner!”' },
      { passage: passText2, stem: 'What is Sarah\'s father\'s job?', opts: ['A doctor', 'A teacher', 'A cook', 'A driver'], ans: 0, exp: '“Sarah\'s father is a doctor.”' },
      { passage: passText2, stem: 'What would Sarah\'s mother like for dinner?', opts: ['Vegetable soup and noodles', 'Beef and rice', 'Chicken and bread', 'Only water'], ans: 0, exp: '“She would like some vegetable soup and noodles.”' },
      { passage: passText2, stem: 'Sarah can use chopsticks very well.', isTrue: true, exp: '“She can use chopsticks very well.”' },
      { passage: passText2, stem: 'Sarah\'s baby brother uses a knife and fork.', isTrue: false, exp: '文中提到：“He uses a small spoon.”，小弟弟用小勺子。' },
    ];
  } else if (grade === '6') {
    passText1 = `Robin is a smart robot. Today, Robin is helping Mike visit the city center. Mike wants to go to the new science museum. "How can we get there?" Mike asks. Robin checks the GPS map: "First, let's take the subway from our school station. Get off at Sunshine Park. Then, walk straight along Green Street. When you see a big bookstore, turn right at the crossing. The science museum is next to the bookstore." On their way, Robin reminds Mike: "Look at the traffic lights! The red light is on, so we must stop and wait. Safety is always first." Finally, they arrive at the science museum on time.`;
    passText2 = `Hello, I'm Chen Jie. I have a pen pal from the UK. His name is Oliver. Oliver is twelve years old and lives in London. He has many interesting hobbies. He likes reading stories, doing word puzzles, and studying Chinese online. He wants to visit China next year. Oliver's father is a police officer. He is brave and often helps people in danger. Oliver's mother is a scientist in a laboratory. What is Oliver going to do this Saturday? He is going to visit his grandparents in the countryside by train. When Oliver feels stressed or worried, he always listens to soft music and takes a deep breath. He is a positive and happy boy.`;

    readingList = [
      // Passage 1 questions (41-45)
      { passage: passText1, stem: 'Where does Mike want to go today?', opts: ['To the science museum', 'To the cinema', 'To the hospital', 'To the post office'], ans: 0, exp: '“Mike wants to go to the new science museum.”' },
      { passage: passText1, stem: 'How do Robin and Mike travel first?', opts: ['By subway', 'By plane', 'By ship', 'On foot only'], ans: 0, exp: '“First, let\'s take the subway from our school station.”' },
      { passage: passText1, stem: 'Where should they turn right at the crossing?', opts: ['When they see a big bookstore', 'When they see a cinema', 'At the school gate', 'In the park'], ans: 0, exp: '“When you see a big bookstore, turn right at the crossing.”' },
      { passage: passText1, stem: 'What does Robin say about the red light?', opts: ['We must stop and wait.', 'We can run fast.', 'We can ride bikes.', 'Speed up.'], ans: 0, exp: '“The red light is on, so we must stop and wait.”' },
      { passage: passText1, stem: 'The science museum is next to the big bookstore.', isTrue: true, exp: '“The science museum is next to the bookstore.”' },

      // Passage 2 questions (46-50)
      { passage: passText2, stem: 'Where does Oliver live?', opts: ['In London, the UK', 'In Sydney, Australia', 'In Beijing, China', 'In New York, the US'], ans: 0, exp: '“His name is Oliver. Oliver is twelve years old and lives in London.”' },
      { passage: passText2, stem: 'What are Oliver\'s hobbies?', opts: ['Reading stories, doing word puzzles and studying Chinese', 'Playing football and video games only', 'Cooking dinner and swimming', 'Singing and dancing'], ans: 0, exp: '“He likes reading stories, doing word puzzles, and studying Chinese online.”' },
      { passage: passText2, stem: 'What does Oliver\'s father do?', opts: ['A police officer', 'A scientist', 'A factory worker', 'A doctor'], ans: 0, exp: '“Oliver\'s father is a police officer.”' },
      { passage: passText2, stem: 'Oliver is going to visit his grandparents by train this Saturday.', isTrue: true, exp: '“He is going to visit his grandparents in the countryside by train.”' },
      { passage: passText2, stem: 'When Oliver feels worried, he eats candy and yells loudly.', isTrue: false, exp: '文中明确写到：“he always listens to soft music and takes a deep breath.”（听轻音乐并深呼吸）。' },
    ];
  } else {
    // Grade 5 (PEP 2024新版义务教育教科书: Unit 1 Different friends)
    passText1 = `Miss White walks into the classroom and smiles: "Hi, class. You'll have a new classmate. He's from Australia. His name is Oliver." Mike asks curiously, "What's he like?" Miss White says, "He's tall and strong." Zhang Peng is very excited: "Is he good at football?" Miss White answers, "Yes, I think he is. He can run very fast." Zhang Peng says, "Great! Our football team needs more players." Miss White adds, "Oliver can't speak Chinese. Would you like to help him, Zhang Peng?" Zhang Peng says, "Sure!" Chen Jie is also Oliver's new friend. She is lovely, clever and quiet. She helps a lot at home, and is very hard-working at school.`;
    passText2 = `Welcome to Sunshine Nature Park! The park is open from 8:00 a.m. to 6:00 p.m. every day. It is located in the east of the city. You can take Bus No. 5 or ride a shared bicycle to get there. In the nature park, you can see tall green mountains and a clean, long river. Many ducks and fish are swimming happily in the water. Please remember: do not throw rubbish into the river, and do not pick wild flowers. Let's protect nature together!`;

    readingList = [
      // Passage 1 questions (41-45: PEP 2024 Unit 1 课文语篇精读)
      { passage: passText1, stem: 'Where is Oliver from?', opts: ['From Australia', 'From the UK', 'From Canada', 'From the USA'], ans: 0, exp: '课文原句：“He\'s from Australia.”' },
      { passage: passText1, stem: 'What is Oliver like?', opts: ['Tall and strong', 'Short and thin', 'Sad and angry', 'Lazy'], ans: 0, exp: '课文原句：“He\'s tall and strong.”' },
      { passage: passText1, stem: 'Why does Zhang Peng feel excited?', opts: ['Because Oliver is good at football and runs fast', 'Because Oliver has a lot of candy', 'Because Oliver can cook dinner', 'Because Oliver has a cat'], ans: 0, exp: 'Oliver 擅长踢足球且跑得快，足球队正好需要球员。' },
      { passage: passText1, stem: 'What is Chen Jie like according to the passage?', opts: ['Lovely, clever, quiet and hard-working', 'Strict and angry', 'Noisy and naughty', 'Lazy and sad'], ans: 0, exp: '陈洁招人喜爱、聪颖、文静且勤奋用功。' },
      { passage: passText1, stem: 'Zhang Peng is happy and willing to help Oliver learn Chinese.', isTrue: true, exp: '当老师问能否帮助 Oliver 学习中文时，张鹏爽快回答：“Sure!”。' },

      // Passage 2 questions (46-50)
      { passage: passText2, stem: 'When is Sunshine Nature Park open every day?', opts: ['From 8:00 a.m. to 6:00 p.m.', 'From 9:00 a.m. to 5:00 p.m.', 'From 7:00 a.m. to 8:00 p.m.', 'All day and night'], ans: 0, exp: '“The park is open from 8:00 a.m. to 6:00 p.m. every day.”' },
      { passage: passText2, stem: 'Which bus can you take to the park?', opts: ['Bus No. 5', 'Bus No. 15', 'Bus No. 1', 'Bus No. 10'], ans: 0, exp: '“You can take Bus No. 5 or ride a shared bicycle...”' },
      { passage: passText2, stem: 'What can you see in the nature park?', opts: ['Tall mountains and a clean river', 'Cars and tall buildings', 'A big cinema', 'A hospital'], ans: 0, exp: '“you can see tall green mountains and a clean, long river.”' },
      { passage: passText2, stem: 'Visitors can pick wild flowers in the park.', isTrue: false, exp: '文中明确提示：“do not pick wild flowers”（请勿采摘野花）。' },
      { passage: passText2, stem: 'We should protect nature and keep the park clean.', isTrue: true, exp: '短文倡导大家热爱并保护大自然。' },
    ];
  }

  readingList.forEach((item, idx) => {
    const num = 41 + idx;
    if ('isTrue' in item) {
      q.push(makeJudge(`g${grade}-e-${num}`, num, '四、短文阅读理解 (41-50题)', item.stem, item.isTrue, item.exp));
    } else {
      q.push(makeChoice(`g${grade}-e-${num}`, num, '四、短文阅读理解 (41-50题)', item.stem, item.opts!, item.ans!, item.exp, item.passage, 'reading'));
    }
  });

  // 2 道拓展挑战题 (编号 51, 52)
  const ext: ExamQuestion[] = grade === '4' ? [
    makeExtension(
      `g${grade}-e-ext-1`,
      51,
      '【English Riddle·四年级趣味谜语】Read and solve the riddle: "I have many pages with letters, stories and colourful pictures. I live in your schoolbag and help you learn. What am I?"',
      ['A storybook (一本故事书)', 'An eraser (一块橡皮)', 'A key (一把钥匙)', 'A desk (一张书桌)'],
      0,
      '【名师解析】双关趣味谜语！有字有画有书页（pages），安放在书包中陪伴同学们汲取知识与阅读趣味，答案正是 A storybook（一本故事书）。'
    ),
    makeExtension(
      `g${grade}-e-ext-2`,
      52,
      '【English Idiom·英语趣味表达】When someone loves reading books very much, English speakers often call this person a "(  )".',
      [
        'bookworm (书虫 / 酷爱读书的人)',
        'bookbird (会飞的书)',
        'bookdog (爱书的小狗)',
        'bookfish (书中的小鱼)'
      ],
      0,
      '【名师解析】经典习惯用语！在英语文化中，"bookworm"（书虫）用来生动形象地比喻“手不释卷、酷爱读书的人”。'
    ),
  ] : grade === '6' ? [
    makeExtension(
      `g${grade}-e-ext-1`,
      51,
      '【English Riddle·六年级思维谜语】Read and solve the riddle: "I have hands, but I cannot clap or hold anything. I have a round face, but I cannot smile. I tick day and night to tell people the time. What am I?"',
      ['A clock (时钟)', 'A robot (机器人)', 'A computer (电脑)', 'A picture (一幅画)'],
      0,
      '【名师解析】经典思维双关谜语！英语中时钟的时针和分针叫 hands of a clock，钟面称为 the face of a clock。时钟拥有指针和表盘，日夜滴答作响为人们指示时间，答案正是 A clock（时钟）。'
    ),
    makeExtension(
      `g${grade}-e-ext-2`,
      52,
      '【English Proverb·六年级经典谚语】"Practice makes perfect." What is the best Chinese meaning of this famous English proverb?',
      [
        '熟能生巧 / 勤学苦练出真功',
        '光阴似箭，日月如梭',
        '千里之行，始于足下',
        '有志者事竟成'
      ],
      0,
      '【名师解析】小学高年级核心英语谚语！"Practice makes perfect" 直译为“不断练习成就完美”，其对应的地道中文名言是“熟能生巧 / 勤学苦练出真功”，激励学生多听、多读、多写。'
    ),
  ] : [
    makeExtension(
      `g${grade}-e-ext-1`,
      51,
      '【English Riddle·趣味英语谜语】Read and solve the riddle: "I have teeth, but I cannot bite or eat anything. I help make your hair tidy every morning. What am I?"',
      ['A comb (一把梳子)', 'A dog (一只小狗)', 'An apple (一个苹果)', 'A toothbrush (一把牙刷)'],
      0,
      '【名师解析】双关趣味谜语！英语中梳子的齿被称为 "the teeth of a comb"（梳齿）。梳子有细密整齐的齿却不会咬人，每天早晨帮助人们整理头发（make hair tidy），因此答案是 A comb（梳子）。'
    ),
    makeExtension(
      `g${grade}-e-ext-2`,
      52,
      '【English Idiom·英语地道习语】When an English native speaker says: "Don\'t worry, this math exam is a piece of cake for you!", what does "a piece of cake" mean?',
      [
        'Something very easy and simple to do (极容易完成、轻而易举的事)',
        'A delicious chocolate cake to eat (一块美味的蛋糕)',
        'A very dangerous and hard mission (一件极其危险艰难的事)',
        'A long and boring story (一个冗长乏味的故事)'
      ],
      0,
      '【名师解析】经典习语理解！在英语口语文化中，"a piece of cake" 意为“小菜一碟、易如反掌的事”（如同轻松吃下一块蛋糕一样简单）。原句意为“别担心，这次数学考试对你来说简直是小菜一碟！”'
    ),
  ];

  return {
    id: `exam-g${grade}-english`,
    grade,
    gradeLabel,
    subject: 'english',
    subjectLabel: '英语',
    title: `${gradeLabel}英语上册 (人教PEP版·义务教育教科书) · 综合素养冲刺卷`,
    subtitle: '义务教育教科书·2024新版精编 · 语音字母 · 核心词汇 · 句型语法 · 情景交际 · 语篇精读 · 满分100分冲刺',
    unitName: `人教版 (PEP) 义务教育教科书 / 2024新版·${gradeLabel}英语综合测评`,
    totalScore: 100,
    questionsCount: 50,
    extensionCount: 2,
    sections: [
      {
        title: '一、语音与字母音标',
        startNum: 1,
        endNum: 10,
        description: grade === '4'
          ? '元音字母闭开音节发音规律(a-e, i-e, o-e, u-e, -e-)、押韵与辅音辨析'
          : grade === '6'
          ? '音标辨析(/ɔː/)、词汇重音、日常句调升降、连读及不发音字母'
          : '字母组合发音(ee/ea/ai/ay/ow/oo)、双元音与自然拼读发音规律',
      },
      {
        title: '二、核心词汇与短语辨析',
        startNum: 11,
        endNum: 25,
        description: grade === '4'
          ? '教室设施、书包文具用品、朋友外貌特征、房间家具、美味佳肴与职业称谓'
          : grade === '6'
          ? '城市公共场所、交通出行方式与红绿灯规则、周末计划、笔友爱好、职业岗位与情绪调节'
          : '性格品质特征、情绪感受、工作与玩耍劳逸结合、健康生活好习惯与大自然',
      },
      {
        title: '三、句型结构与情景交际',
        startNum: 26,
        endNum: 40,
        description: grade === '4'
          ? 'Where方位疑问句、What\'s in...、一般疑问句与答语、点餐情景交际及How many'
          : grade === '6'
          ? 'How can I get to问路、交通规则指令、be going to将来时、单三动词与情态动词should'
          : 'What is... like性格询问、there be就近原则、情态动词should、点餐意愿与一般现在时',
      },
      {
        title: '四、短文阅读理解',
        startNum: 41,
        endNum: 50,
        description: grade === '4'
          ? '四年级新教室校园生活与温馨家庭晚餐双篇精读与细节正误判断'
          : grade === '6'
          ? '智能罗宾城市科技导航之旅与英国笔友跨国文化交流双篇精读与推理判断'
          : '五年级校园师生生活与阳光自然公园语篇精读、细节推理与环保素养',
      },
    ],
    questions: q,
    extensionQuestions: ext,
  };
}
