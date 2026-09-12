import { WordItem } from '../types';

// Rich Chinese explanations and memory tips for PEP elementary vocabulary
const CHINESE_EXPLANATIONS: Record<string, string> = {
  // 3年级常用
  'hello': '常用的问候礼貌用语，意为“你好；喂”，用于和朋友或老师打招呼。',
  'hi': '非正式的亲切问候语，意为“嗨；你好”，常用于朋友或同伴之间。',
  'friend': '指互相信任、互相关心、一起学习玩耍的好朋友、好伙伴。',
  'ear': '人或动物的听觉器官（耳朵），用来倾听美妙的声音和音乐。',
  'eye': '视觉器官（眼睛），用来观察事物、阅读书籍和发现大自然的美。',
  'mouth': '嘴巴，用来发音说话、朗读英语以及品尝美味的食物。',
  'nose': '鼻子，面部的嗅觉和呼吸器官，能闻到花香和美食的气味。',
  'arm': '连接肩膀和手腕的手臂/胳膊，可以用来拥抱、挥手和拿东西。',
  'hand': '手臂末端的手，长有五指，用来写字、画画和整理物品。',
  'head': '头、头部，容纳大脑，是思考和指挥身体运动的重要中枢。',
  'body': '身体、躯体，指人的全身结构，要坚持锻炼保持健康。',
  'leg': '腿部，用来支撑身体站立，帮助我们跑步、跳跃和踢球。',
  'foot': '脚、足部（复数形式为 feet），位于腿部最下方，用于踏地行走。',
  'share': '将自己的玩具、美食或快乐主动与他人一同分享享受。',
  'smile': '露出微笑、开怀笑颜，表达友善、礼貌与快乐的心情。',
  'listen': '集中注意力用心倾听他人说话，也是学好英语的关键习惯。',
  'help': '在同伴或家人遇到困难时主动伸出援手给予支持与帮助。',
  'father': '父亲、爸爸（口语中常亲切地称作 dad），家庭的坚强支柱。',
  'mother': '母亲、妈妈（口语中常亲切地称作 mum/mom），关爱家人的成长。',
  'brother': '兄弟，指亲人中的哥哥或弟弟。',
  'sister': '姐妹，指亲人中的姐姐或妹妹。',
  'grandfather': '祖父或外祖父，即爷爷或外公。',
  'grandmother': '祖母或外祖母，即奶奶或外婆。',
  'family': '家庭，由父母、长辈和孩子组成的温馨家园。',
  'dog': '忠诚机灵的小狗，人类忠实的好朋友，爱摇尾巴。',
  'cat': '灵巧可爱的小猫咪，身手敏捷，爱吃鱼和捉老鼠。',
  'bird': '长有翅膀和羽毛的小鸟，能在天空中自由自在地飞翔歌唱。',
  'rabbit': '温顺可爱的兔子，耳朵长长、眼睛红润，爱吃胡萝卜与青草。',
  'panda': '中国特有的珍稀国宝大熊猫，毛色黑白分明，憨态可掬。',
  'duck': '能在水面上浮水嬉戏的鸭子，扁扁的嘴巴嘎嘎叫。',
  'elephant': '陆地上体型庞大的大象，长有长长的象鼻和像蒲扇般的大耳朵。',
  'monkey': '活泼调皮的小猴子，喜欢在树枝间跳跃攀爬，爱吃香蕉。',
  'tiger': '森林之王百兽首领老虎，威武强壮，额头有“王”字斑纹。',
  'lion': '威风凛凛的雄狮，头部有一圈浓密的鬃毛。',
  'apple': '圆形香甜、富含维生素的苹果，常吃有益身体健康。',
  'banana': '弯弯如月牙般的黄色香蕉，口感软糯香甜，富含能量。',
  'orange': '酸甜多汁的橙子或柑橘，果肉清香解渴，富含维生素C。',
  'pear': '清脆甘甜的水梨，能生津润燥、生津止渴。',
  'water': '生命不可缺少的重要水源，无色透明，每天都要适量饮用。',
  'milk': '营养丰富的纯牛奶，富含钙质，有助于少年儿童骨骼成长。',
  'bread': '烘烤制作而成的松软面包，常作为营养美味的早餐。',
  'rice': '颗粒饱满香软的大米饭，是中国最主要的主食之一。',
  'red': '热情鲜艳的红色，如鲜艳的红领巾和熟透的红苹果。',
  'yellow': '明亮温暖的黄色，如金灿灿的阳光和熟透的香蕉。',
  'blue': '广阔深邃的蓝色，如晴朗的天空和浩瀚的大海。',
  'green': '象征生机与活力的绿色，如春天的嫩芽和茂盛的树木。',
  'pen': '用于写字作笔记的水笔、钢笔或圆珠笔。',
  'pencil': '配有铅芯的书写工具铅笔，适合小学生做练习与画图。',
  'ruler': '用于测量物体长度和划定直线的直尺工具。',
  'eraser': '用于擦除铅笔笔迹与图画印记的橡皮擦。',
  'book': '记载丰富知识与精彩故事的书籍，陪伴我们探索世界。',
  'bag': '用来收纳课本、文具和生活用品的书包或背包。',
  'school': '老师传授知识、同学们共同学习与成长的校园天地。',
  'classroom': '摆放桌椅、投影与黑板，用于日常上课教学的教室。',
  'desk': '学生在教室里用来读书、书写和放置课本的书桌。',
  'chair': '供学生端坐听讲、保持正确坐姿的椅子。',
  'teacher': '辛勤培育学生、传授知识与智慧的老师。',
  'student': '在学校里认真听讲、积极求知的学生或同学。',

  // 4~6年级进阶词汇精选
  'science museum': '科学博物馆，陈列科学仪器、科普模型与互动展览的科技场所。',
  'post office': '邮局，提供寄送信件、明信片、包裹和邮政服务的公共机构。',
  'bookstore': '书店，专门展示和销售各类书籍、画册及文具的商店。',
  'cinema': '电影院，放映各类精彩电影供大家观赏休闲的场所。',
  'hospital': '医院，提供医生诊疗、健康检查和医疗护理的专业机构。',
  'turn left': '向左转弯，指示方向朝身体左侧转动行进。',
  'turn right': '向右转弯，指示方向朝身体右侧转动行进。',
  'on foot': '步行、走路，不乘坐交通工具依靠双脚走路上学或出行。',
  'by bus': '乘坐公共汽车或公交车出行，低碳环保。',
  'by taxi': '乘坐出租车出行，方便快捷直达目的地。',
  'by plane': '乘坐飞机出行，速度极快，适合长途跨省跨国旅行。',
  'by subway': '乘坐地下铁道出行，准时快捷不受地面堵车影响。',
  'by train': '乘坐火车或高铁出行，平稳舒适，欣赏沿途美丽风景。',
  'visit my grandparents': '看望、拜访自己的祖父母或外祖父母，表达孝心与关爱。',
  'see a film': '去电影院看电影，享受精彩生动的银幕故事。',
  'take a trip': '去外出旅游度假，开阔眼界增长见闻。',
  'supermarket': '大型自选超市，集中销售各类生鲜食品和日用百货。',
  'factory worker': '工厂工人，在车间操作机器、制造生产工业品的劳动者。',
  'postman': '邮递员、快递员，负责将信件和包裹准时送达每家每户。',
  'businessman': '商业人士、商人，从事经商贸易与企业运营的管理人员。',
  'police officer': '警察，维护公共治安秩序、保护人民生命财产安全的执法人员。',
  'angry': '生气的、愤怒的，因受到不公或触怒而产生的不满情绪。',
  'afraid': '害怕的、恐惧的，面对危险或可怕事物时产生的畏惧心理。',
  'sad': '难过的、伤心的，感到沮丧失落或悲伤的心情。',
  'worried': '担心的、发愁的，对可能发生的问题或困难感到焦虑不安。',
  'happy': '高兴的、快乐的，心情愉悦、感到幸福满足的状态。',
  'taller': 'tall（高）的比较级形式，表示“更高的”，用于两人或两物的高度对比。',
  'shorter': 'short（矮/短）的比较级形式，表示“更矮的”或“更短的”。',
  'longer': 'long（长）的比较级形式，表示“更长的”，用于长度上的比较。',
  'stronger': 'strong（强壮）的比较级形式，表示“更强壮的、更有力量的”。',
  'cleaned my room': '过去时短语，表示“（过去）打扫整理了我的房间”。',
  'washed my clothes': '过去时短语，表示“（过去）清洗了自己的衣物”。',
  'stayed at home': '过去时短语，表示“（过去）待在家里没有外出”。',
  'watched tv': '过去时短语，表示“（过去）观看了电视节目”。',
  'went camping': '过去时短语，表示“（过去）去户外露营野营了”。',
  'rode a horse': '过去时短语，表示“（过去）骑了马匹”。',
  'took pictures': '过去时短语，表示“（过去）拍摄了照片、照相”。',
  'dining hall': '学校或单位的饭厅、大食堂，供大家集中用餐的场所。',
  'gym': '体育馆、健身房，配有运动设施、开展球类和体育活动的室内场馆。',
  'grass': '草坪、青草，绿化校园和公园的绿色植被。',
  'badminton': '羽毛球运动，两人或四人隔网用球拍击打羽毛球的球类运动。',
};

/**
 * Returns a friendly, child-appropriate Chinese explanation and pedagogical insight for any PEP word.
 */
export function getWordChineseExplanation(word: WordItem): string {
  const normalizedKey = word.word.trim().toLowerCase();
  
  // 1. Direct dictionary match
  if (CHINESE_EXPLANATIONS[normalizedKey]) {
    return CHINESE_EXPLANATIONS[normalizedKey];
  }

  // 2. Phrase matching
  for (const [key, explanation] of Object.entries(CHINESE_EXPLANATIONS)) {
    if (normalizedKey.includes(key) || key.includes(normalizedKey)) {
      return explanation;
    }
  }

  // 3. Fallback smart template tailored for Chinese elementary students
  const posLabel = word.partOfSpeech ? `（${word.partOfSpeech}）` : '';
  return `【${word.categoryLabel}】表示“${word.translation}”${posLabel}。小学PEP常用核心词汇，日常会话中常用于“${word.exampleTranslation}”。`;
}
