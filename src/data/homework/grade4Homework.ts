import { UnitHomeworkPackage, HomeworkQuestionItem } from './types';

function makePackage(
  grade: '4',
  subject: 'chinese' | 'math' | 'english',
  unitNumber: number,
  unitTitle: string,
  themeDesc: string,
  questions: Array<{ category: string; stem: string; subStem?: string; options: string[]; ans: number; exp: string }>,
  ext: { category: string; stem: string; subStem?: string; options: string[]; ans: number; exp: string }
): UnitHomeworkPackage {
  const practiceQuestions: HomeworkQuestionItem[] = questions.map((q, idx) => ({
    id: `g${grade}-${subject}-u${unitNumber}-q${idx + 1}`,
    num: idx + 1,
    category: q.category,
    stem: q.stem,
    subStem: q.subStem,
    options: q.options,
    ans: q.ans,
    exp: q.exp,
    isExtension: false,
  }));

  const extensionQuestion: HomeworkQuestionItem = {
    id: `g${grade}-${subject}-u${unitNumber}-ext`,
    num: practiceQuestions.length + 1,
    category: ext.category,
    stem: ext.stem,
    subStem: ext.subStem,
    options: ext.options,
    ans: ext.ans,
    exp: ext.exp,
    isExtension: true,
  };

  return {
    grade,
    subject,
    unitNumber,
    unitTitle,
    themeDesc,
    practiceCount: practiceQuestions.length,
    questions: practiceQuestions,
    extensionQuestion,
  };
}

export const GRADE_4_HOMEWORK: Record<'chinese' | 'math' | 'english', Record<number, UnitHomeworkPackage>> = {
  chinese: {
    1: makePackage(
      '4', 'chinese', 1, '第1单元：自然奇观', '《观潮》《走月亮》《现代诗二首》《繁星》',
      [
        { category: '生字注音', stem: '下列加点字的读音完全正确的一项是：', options: ['屹立(yì) 薄雾(báo)', '霎时(shà) 颤动(chàn)', '鼎沸(fèi) 昂首(yáng)', '崩塌(bēng) 浩荡(gào)'], ans: 1, exp: 'A项“薄雾”读 bó；C项“昂”读 áng；D项“浩荡”读 hào。B项完全正确。' },
        { category: '潮水声势', stem: '《观潮》中描写潮来时声音变化的正确顺序是：', options: ['闷雷滚动 —— 越来越大 —— 山崩地裂', '山崩地裂 —— 闷雷滚动 —— 渐渐平静', '风平浪静 —— 山崩地裂 —— 闷雷滚动', '越来越大 —— 悄无声息 —— 闷雷滚动'], ans: 0, exp: '大潮自远而近，声音先是“闷雷滚动”，随后“越来越大”，最后如“山崩地裂”。' },
        { category: '修辞手法', stem: '“浪潮越来越近，犹如千万匹白色战马齐头并进。”这句话运用的修辞手法是：', options: ['比喻', '拟人', '排比', '夸张'], ans: 0, exp: '把汹涌白浪比喻成“千万匹白色战马”，生动写出大潮横贯江面的雄伟气势。' },
        { category: '课文主旨', stem: '《走月亮》中作者反复写到“啊，我和阿妈走月亮……”这句话的作用是：', options: ['作为抒情线索，串联温馨月下场景，表达浓浓亲情与幸福感', '单纯为了凑齐段落字数', '表示作者和妈妈迷路了', '说明月亮移动的速度很快'], ans: 0, exp: '“走月亮”作为结构线索和情感载体，将乡村溪边、果园等美好画卷串联起来，洋溢着童真与母爱。' },
        { category: '成语运用', stem: '广场上聚集了成千上万的人，大家欢呼雀跃，声浪震天。最贴切的成语是：', options: ['人声鼎沸', '若隐若现', '风平浪静', '鸦雀无声'], ans: 0, exp: '人声鼎沸形容人群的声音嘈杂喧闹，像水在锅里沸腾一样。' },
        { category: '现代诗歌', stem: '徐志摩《花牛歌》中“花牛在草地里坐，压扁了一穗剪秋罗”，表现了花牛的：', options: ['淘气、闲适与自由自在', '非常笨拙疲倦', '身体沉重破坏草地', '害怕草丛里的虫子'], ans: 0, exp: '全诗勾勒出花牛在草地上走、坐、眠、做梦的憨态可掬与怡然自得。' },
        { category: '巴金散文', stem: '巴金在《繁星》中描写了自己在哪三个不同时期和地点看繁星的感受？', options: ['从前在家乡、三年前在南京、如今在海上', '北京天坛、上海外滩、广州白云山', '小溪边、果园里、稻田上', '春天的花园、夏天的树林、冬天的雪山'], ans: 0, exp: '巴金分别写了家乡的庭院、南京的住所、海上巨轮上望星空，展现对大自然的深爱与思想成熟。' },
        { category: '词语搭配', stem: '下列词语搭配完全正确的一组是：', options: ['宽阔的钱塘江 蒙蒙的薄雾 奇妙的想象', '平坦的波涛 翻滚的阳光 沉睡的巨浪', '洁白的泥土 甜美的月光 响亮的花香', '浩浩荡荡的马路 坑坑洼洼的大海'], ans: 0, exp: 'A项搭配自然规范贴合课文语境。' },
        { category: '排比修辞', stem: '“从果园那边飘来果子的甜香。是雪梨，是火把梨，还是紫葡萄？都有。”这句话属于：', options: ['设问与排比', '反问', '夸张', '对偶'], ans: 0, exp: '自问自答构成设问，多个并列果名增强了丰收的甜美意境。' },
        { category: '感官观察', stem: '在描写景物时，我们可以调动哪些感官写出立体逼真的画面？', options: ['视觉、听觉、嗅觉、味觉、触觉多维度结合', '只用眼睛看，不听不闻', '全凭主观想象', '只记录温度高低'], ans: 0, exp: '多感官协同观察是本单元的核心语文要素。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【读写迁移拓展】钱塘江大潮被称为“天下奇观”。请结合课文《观潮》与地理知识，分析钱塘江大潮之所以如此壮观的自然成因：', options: ['杭州湾特殊的喇叭形河口地形，加上农历八月十八太阳月球引潮力最大以及东南风助力', '江底装了巨大的推水机械', '江边的群山倒塌震动引起的', '因为下游水库放水过多'], ans: 0, exp: '天时（秋分前后引潮力最大）、地利（喇叭口海湾潮水骤聚）、风势（盛行东南风推波助澜）共同造就了钱塘奇观。' }
    ),
    2: makePackage(
      '4', 'chinese', 2, '第2单元：提问策略', '《一个豆荚里的五粒豆》《夜间飞行的秘密》《呼风唤雨的世纪》',
      [
        { category: '阅读提问方法', stem: '本单元学习的“提问策略”，主要指导我们从哪些不同角度对课文提出问题？', options: ['针对课文内容、写作手法、引发的联想与生活启示', '仅仅寻找文中不认识的字', '只询问作者的出生年月', '只数段落句子多少'], ans: 0, exp: '统编教材提问策略单元核心要求：学会从局部到整体、从内容到写法及生活启示等多角度思考发问。' },
        { category: '故事情节', stem: '《一个豆荚里的五粒豆》中，伴随生病小女孩逐渐康复并绽放笑脸的是哪粒豌豆？', options: ['落入窗台水沟裂缝中顽强发芽开花的小豌豆', '飞向太阳想飞得最高的大豌豆', '直接掉进鸽子肚子里的小豌豆', '滚在地上睡觉的胖豌豆'], ans: 0, exp: '第五粒豌豆在贫瘠的裂缝中顽强生长开出紫花，带给小女孩战胜疾病的生命希望。' },
        { category: '仿生学知识', stem: '《夜间飞行的秘密》中，科学家通过三次不同实验，最终证实蝙蝠在夜间飞行靠的是：', options: ['嘴巴发出超声波，耳朵接收回声来探路', '异常敏锐的眼睛', '鼻子的嗅觉', '翅膀上的触觉毛'], ans: 0, exp: '通过蒙上眼睛、塞住耳朵、封住嘴巴的三次对照实验，证明蝙蝠靠超声波回声定位。' },
        { category: '科技发明', stem: '《呼风唤雨的世纪》中，“呼风唤雨”在 20 世纪是指：', options: ['人类利用现代科学技术改变生活、创造奇迹的巨大力量', '古代神仙施展法术祈求下雨', '自然界刮风下雨的恶劣天气', '气象台的人工降雨技术'], ans: 0, exp: '作者借神话传说词汇“呼风唤雨”，生动比喻20世纪现代科学技术突飞猛进给世界带来的翻天覆地变化。' },
        { category: '名言引用', stem: '“忽如一夜春风来，千树万树梨花开。”在课文中被巧妙引用来形容：', options: ['现代科学技术发展之快、成果之丰硕', '春天果园里的美景', '冬天下大雪的寒冷', '树木种植得非常迅速'], ans: 0, exp: '借岑参边塞咏雪诗句，形象比拟科学成果如同春风拂面般迅速涌现。' },
        { category: '词语辨析', stem: '下列词语中形容目光或思维极其敏捷深刻的一项是：', options: ['敏锐', '敏捷', '敏感', '愚钝'], ans: 0, exp: '“敏锐”常用来形容眼光、观察力深刻敏锐。' },
        { category: '问题清单整理', stem: '整理全班的“问题清单”时，最科学高效的整理步骤是：', options: ['筛选掉重复的问题，按“课文内容/写法/启示”归类，并重点研讨有深入价值的问题', '把所有问题都抄一遍不管内容', '只回答第一个同学提出的问题', '不管问题好坏直接背诵答案'], ans: 0, exp: '整理清单旨在分类筛选、合并同类项，从而聚焦核心关键问题深入研读。' },
        { category: '设问句判断', stem: '下列句子属于设问句的一项是：', options: ['是谁来呼风唤雨呢？当然是人类；靠什么呼风唤雨呢？靠的是现代科学技术。', '难道科学技术不能造福人类吗？', '这粒豌豆真的能开花吗？', '蝙蝠究竟在夜里怎么飞行的？'], ans: 0, exp: '自问自答：“是谁……？当然是……；靠什么……？靠的是……”，是典型的设问句。' },
        { category: '成语辨识', stem: '“腾云驾雾、神机妙算、各显神通”这类词语来源于我国古代的：', options: ['神话传说与古典文学名著', '算术几何学', '现代科技实验', '西方寓言故事'], ans: 0, exp: '这些词汇折射出古代劳动人民对探索自然的美好幻想与奇妙构想。' },
        { category: '生字拼音', stem: '“系(jì)鞋带”与“联系(xì)”中“系”字的读音规律是：', options: ['系鞋带、系红领巾读 jì；系统、联系读 xì', '全部都读 xì', '全部都读 jì', '系鞋带读 xì'], ans: 0, exp: '打结、扣上读 jì；组织关系、联系读 xì。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【探究提问拔高】爱因斯坦曾说：“提出一个问题往往比解决一个问题更重要。”在学习和生活中，如何才能提出真正具有深度和创造性的好问题？', options: ['保持好奇心，不盲从现有结论，勇于质疑事物的原理机制，并尝试建立跨学科的联系', '随便找书上的印刷标点挑毛病', '问老师今天几点下课', '只提别人已经知道确切答案的简单问题'], ans: 0, exp: '探究性思维的核心在于：敢于质疑常识、深入事物内在规律与关联，这正是发明创造的起点。' }
    ),
    3: makePackage(
      '4', 'chinese', 3, '第3单元：细致观察', '《古诗三首》《爬山虎的脚》《蟋蟀的住宅》',
      [
        { category: '古诗哲理', stem: '苏轼《题西林壁》中“不识庐山真面目，只缘身在此山中”，蕴含的深刻哲学道理是：', options: ['要想客观全面地认识事物的真相与全貌，必须跳出局限，摆脱主观片面性', '庐山因为雾太大所以看不清', '爬山一定要请导游引路', '近看大山比远看大山更壮丽'], ans: 0, exp: '身在局中往往一叶障目，唯有站得高、跳出局部，才能把握客观全局。' },
        { category: '自然观察', stem: '叶圣陶在《爬山虎的脚》中观察到，爬山虎的脚长在：', options: ['茎上长叶柄的反面，伸出枝状的六七根细丝', '叶子的正中心', '泥土最深处的根系末梢', '花瓣的背后'], ans: 0, exp: '叶老观察极其入微：“茎上长叶柄的地方，反面伸出枝状的六七根细丝，每根细丝像蜗牛的触角。”' },
        { category: '拟人写法', stem: '法布尔称赞蟋蟀的住宅是“伟大的工程”，主要原因在于：', options: ['蟋蟀仅凭柔弱微小的工具（前足、大颚、后腿），建造出排水优良、向阳干燥且简朴卫生的洞穴', '住宅是用钢筋混凝土建成的', '住宅面积有几十平方米', '请别的昆虫帮忙建造的'], ans: 0, exp: '以弱小身躯创造出如此精巧安全的生态住宅，体现了生命令人叹为观止的顽强与智慧。' },
        { category: '古诗名句', stem: '“可怜九月初三夜，露似真珠月似弓。”诗中“可怜”的意思是：', options: ['可爱 / 令人喜爱', '贫穷可怜', '怜悯悲哀', '不幸遭遇'], ans: 0, exp: '唐宋诗词中“可怜”多作“可爱、惹人喜爱”解。' },
        { category: '观察时间维度', stem: '本单元的观察方法与上一单元相比，最突出的特点是：', options: ['连续观察、长期追踪并记录事物的生长变化过程', '只在白天看一次', '仅靠书本记载抄写', '只拍一张照片便不再观察'], ans: 0, exp: '叶老观察爬山虎巴墙、法布尔观察蟋蟀筑巢，都体现了“长期连续观察”的治学精神。' },
        { category: '成语辨析', stem: '形容对周围生活处处留心、善于发现常人忽略细节的成语是：', options: ['明察秋毫 / 处处留心', '走马观花', '囫囵吞枣', '视而不见'], ans: 0, exp: '细致入微、明察秋毫是科学家和作家的共同基本功。' },
        { category: '动词精准性', stem: '“爬山虎的脚触着墙的时候，六七根细丝的头上就变成小圆片，巴住墙。”句中“巴”字精准表达了：', options: ['细丝吸附力量之大、紧贴墙壁的牢固状态', '轻轻碰到墙就掉下来', '在墙上画圆圈', '把墙皮抓破了'], ans: 0, exp: '一个“巴”字生动传神，写出了爬山虎附着墙体的顽强紧密。' },
        { category: '比喻修辞', stem: '“细丝原先是直的，现在弯曲了，把爬山虎的嫩茎拉一把，使它紧贴在墙上。”这里展现了：', options: ['力学拉拽的动态过程，生动展现爬山虎向上攀援的奥秘', '风吹弯了细丝', '细丝断掉了', '细丝害怕阳光'], ans: 0, exp: '通过细丝由直变弯产生的拉力使茎紧贴墙面，科学准确地揭示了植物攀爬机制。' },
        { category: '文学家介绍', stem: '《昆虫记》的作者是法国著名的昆虫学家、文学家：', options: ['法布尔', '安徒生', '达尔文', '爱因斯坦'], ans: 0, exp: '法布尔耗费毕生心血在荒石园中观察昆虫，写成了传世巨著《昆虫记》。' },
        { category: '字词读音', stem: '“住宅(zhù)”“慎重(shèn)”的拼音是：', options: ['zhù zhái, shèn zhòng', 'zù zái, sèn zòng', 'chù chái, shèng zhòng', 'jù jié, shēn zhòng'], ans: 0, exp: '宅读 zhái（翘舌音），慎读 shèn。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【科学与文学综合】法布尔在《昆虫记》中既运用了极其严谨的科学观察实验方法，又采用了生动风趣的拟人文学手法。这种“科学与文学的交融”给我们写好观察作文提供了怎样的范本？', options: ['既要尊重客观真实、记录准确详实，又要怀揣对生命的敬畏与爱，赋予文字以温度与活力', '写科学只能罗列冰冷枯燥的数据', '可以完全脱离事实编造神怪故事', '不需要亲自观察，翻阅百科全书即可'], ans: 0, exp: '真实严谨的观察底色与生动传神的文学表达相结合，是自然科学散文最动人的魅力所在。' }
    ),
    4: makePackage(
      '4', 'chinese', 4, '第4单元：神话之光', '《盘古开天地》《精卫填海》《普罗米修斯》《女娲补天》',
      [
        { category: '神话人物', stem: '在我国古代神话中，用自己的身体创造了美丽丰富的大千世界的创世神是：', options: ['盘古', '夸父', '后羿', '大禹'], ans: 0, exp: '盘古开天辟地，倒下后双眼化日月、血液化江河、肌肉化田地，身躯化为万物。' },
        { category: '文言神话', stem: '《精卫填海》选自先秦著名古籍：', options: ['《山海经·北山经》', '《论语》', '《史记》', '《庄子》'], ans: 0, exp: '“炎帝之少女，名曰女娃……溺而不返，故为精卫”出自《山海经》。' },
        { category: '精神品质', stem: '精卫“常衔西山之木石，以堙于东海”，表现了精卫怎样的崇高精神？', options: ['不畏艰难险阻、坚忍不拔、誓不罢休的顽强执着精神', '盲目自大、不知变通', '喜欢游山玩水收集石子', '因为好玩想把大海填平'], ans: 0, exp: '精卫填海代表了中华民族自古以来不屈不挠抗争自然、矢志不移的民族灵魂。' },
        { category: '西方神话', stem: '古希腊神话中，不顾天神宙斯严厉惩罚、勇敢为人类盗取火种的天神是：', options: ['普罗米修斯', '赫拉克勒斯', '阿波罗', '丘比特'], ans: 0, exp: '普罗米修斯充满正义感与牺牲精神，将象征光明与文明的火种带给处于寒冷与蒙昧中的人类。' },
        { category: '神话想象特点', stem: '神话故事往往具有怎样的鲜明艺术特色？', options: ['充满神奇宏大的奇幻想象，人物具有超凡神力，寄托着人类对自然的探索与美好愿望', '情节必须全部符合现代物理科学定律', '主角都是普通凡人，没有任何神奇本领', '文字枯燥短小，没有情节曲折'], ans: 0, exp: '瑰丽奇绝的神奇想象和战胜自然的坚毅人格，是古老神话最核心的魅力。' },
        { category: '生字词辨析', stem: '“溺而不返”的“溺”字意思是：', options: ['淹没在水中', '贪玩忘记', '摔倒受伤', '游泳欢快'], ans: 0, exp: '溺意为落水淹没、溺亡。' },
        { category: '神话人物对应', stem: '下列神话人物与主要事件匹配错误的一项是：', options: ['后羿 —— 炼石补天', '嫦娥 —— 奔月', '大禹 —— 治理洪水', '夸父 —— 逐日'], ans: 0, exp: '“炼石补天”的是女娲；后羿的主要英雄伟绩是“射日”。' },
        { category: '故事情节', stem: '凶残的鹫鹰啄食普罗米修斯的肝脏，但到了夜晚肝脏又会长出新的来。最终救出他的是：', options: ['著名的大力神赫拉克勒斯', '波塞冬', '宙斯自己后悔了', '阿波罗驾着太阳车'], ans: 0, exp: '大力神赫拉克勒斯射死恶鹰，砸断铁链，解救了受尽折磨的普罗米修斯。' },
        { category: '语言特色', stem: '盘古呼出的气息变成了四季的风和飘动的云；他发出的声音化作了隆隆的雷霆。这句运用的写法是：', options: ['宏伟的神奇联想与夸张', '写实的记录', '反问排比', '设问讽刺'], ans: 0, exp: '将宏大宇宙自然现象与巨人躯体器官巧妙对应，展现天地孕育的壮美诗意。' },
        { category: '字形检查', stem: '下列词语书写全部正确的一组是：', options: ['悲惨 惩罚 狠心 愤愤不平', '造副 锁练 啄食 严厉', '遭爱 猛烈 领息 敬佩', '坚难 欢火 盗取 勇敢'], ans: 0, exp: 'A组完全正确。B项“造副、锁练”有误；C项“遭爱、领息”有误。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【中西神话比较题】中国神话中的“大禹治水、愚公移山、后羿射日”与古希腊神话中的英雄传说相比，最能体现中华民族怎样的核心精神内核？', options: ['面对自然灾害与艰难苦难，自强不息、同心协力、人定胜天的不屈抗争与家国责任担当', '遇到困难全凭神灵保佑，自己放弃努力', '喜欢外出航海掠夺财富', '认为人类在自然面前毫无力量只能认命'], ans: 0, exp: '中华神话崇尚劳动创造、战胜天堑、为民请命的奉献抗争精神，构成了中华文明生生不息的精神基因。' }
    ),
    5: makePackage(
      '4', 'chinese', 5, '第5单元：记一件事情', '《麻雀》《爬天都峰》按顺序写事、抓动作与神态',
      [
        { category: '写事要素', stem: '写清楚一件事，必须要交代清楚事情的哪六要素？', options: ['时间、地点、人物、事情的起因、经过、结果', '天气、风景、心情、分数、老师、同学', '开头、中间、结尾、批注、插图、题目', '早上、中午、晚上、吃饭、写作业、睡觉'], ans: 0, exp: '时、地、人、起因、经过、结果是记叙文叙事完整的核心六要素。' },
        { category: '课文细节', stem: '屠格涅夫《麻雀》中，老麻雀从树上飞下来落在猎狗面前，面对庞大的猎狗，老麻雀的举动是：', options: ['像一块石头似的落下来，扎煞起全身羽毛，绝望地尖叫着准备搏斗', '吓得立刻飞走逃命', '躲在灌木丛里不敢出声', '飞去找别的麻雀帮忙'], ans: 0, exp: '为了保护幼鸟，老麻雀不顾悬殊力量飞落护雏，体现了超越生死的母爱伟力。' },
        { category: '情感力量', stem: '猎狗最终慢慢后退后撤，没有伤害小麻雀。作者感叹“爱比死和死的恐惧更强大”，这句话表达了：', options: ['母爱与亲情产生出的无畏勇气，震撼并战胜了一切恐惧', '猎狗刚才吃饱了不饿', '老麻雀羽毛太硬不好吃', '猎人开枪吓跑了狗'], ans: 0, exp: '爱是无坚不摧的崇高情感力量，哪怕在微弱生灵身上也闪耀着神圣光辉。' },
        { category: '人物对话', stem: '《爬天都峰》中，“我”和小女孩相遇在天都峰脚下，看着陡峭的山峰，彼此鼓励：', options: ['“要不是你的勇气鼓舞我，我还下不了决心哩！现在居然爬上来了！”', '“山太高了，我们还是下山回家吧。”', '“比一比谁爬得最慢。”', '“让缆车送我们上去吧。”'], ans: 0, exp: '一老一少从对方身上汲取克服畏难心理的勇气，最终胜利登顶。' },
        { category: '动作描写', stem: '“我奋力向峰顶爬去，一会儿攀着铁链，一会儿手脚并用向上爬，像小猴子一样……”这句通过哪些描写表现了爬山的不易？', options: ['“攀、爬、手脚并用”等精准动词与生动比喻', '只写了山上的大风', '只写了妈妈给的苹果', '只写了脚上的登山鞋'], ans: 0, exp: '连续精炼的动作描写生动再现了爬天都峰的艰辛与坚毅拼搏。' },
        { category: '生字注音', stem: '“无可奈何”的“奈”读音与字义是：', options: ['nài，对……怎么办、如何', 'lài，赖皮', 'nài，生气愤怒', 'dài，等待'], ans: 0, exp: '无可奈何中奈读 nài，表示毫无办法。' },
        { category: '写作技巧', stem: '在写事情的“经过”部分时，要做到详略得当，最重要的技巧是：', options: ['抓住最关键激烈的场面，把人物当时的动作、语言、神态和心理活动展开写细致', '一笔带过一句话说清楚', '只写开头不写经过', '把不相关的别的事情也写进来'], ans: 0, exp: '“经过”是事情的高潮与核心，细致入微的细节刻画才能让文章血肉丰满、扣人心弦。' },
        { category: '近义词替换', stem: '“居然”爬上来了！句中“居然”最恰当的近义词是：', options: ['竟然', '果然', '虽然', '仍然'], ans: 0, exp: '“居然、竟然”都表示出乎意料之外。' },
        { category: '标点规范', stem: '下列句子引号使用规范的一项是：', options: ['老爷爷拉着我的手，说：“谢谢你啦，小朋友，要不是你的勇气鼓舞我，我还下不了决心哩！”', '老爷爷说：“谢谢你啦，小朋友。”。', '“今天天气真好，”小明说：“我们去爬山吧！”', '爸爸问：“天都峰这么高，你敢爬吗？”。'], ans: 0, exp: '提示语在前，冒号引号紧随，句末标点放在引号内。' },
        { category: '篇章结构', stem: '《爬天都峰》文章按照怎样的叙事脉络展开？', options: ['爬山前（望峰生畏）—— 爬山中（互相鼓舞奋力攀登）—— 爬上峰顶后（合影互谢）', '峰顶看日出 —— 乘车回家', '只写下山路上买纪念品', '在宾馆睡觉 —— 第二天出发'], ans: 0, exp: '全文叙事清晰、层次井然，严格遵循事情发展的先后顺序。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【生活作文探究】我们在写《记一次生活经历》时，常常容易写成“流水账”（先干什么、后干什么、最后干什么，平淡乏味）。怎样才能把平淡的事情写得一波三折、引人入胜？', options: ['设置波澜起伏的悬念与心理矛盾（如初时的畏惧犹豫、中途的意外波折、最后的顿悟与突破），结合动作特写', '把每天洗脸刷牙都写一遍', '多抄写成语辞藻', '多写感叹号'], ans: 0, exp: '聚焦矛盾冲突与心理波动，辅以慢镜头式的动作与心理特写，能让叙事生动鲜活、富有感染力。' }
    ),
    6: makePackage(
      '4', 'chinese', 6, '第6单元：童年回忆', '《牛和鹅》《一只窝囊的大老虎》《陀螺》',
      [
        { category: '课文主旨', stem: '《牛和鹅》中，金奎叔对“我”说的一番话启发我们明白的深刻道理是：', options: ['看待事物要从客观真实出发，不应被盲从恐惧或偏见所左右', '牛很笨所以要打牛', '鹅肉很好吃所以不怕鹅', '以后离所有动物都远远的'], ans: 0, exp: '人们原先以为牛看人很大故怕人，鹅看人很小故欺人；金奎叔指出关键在于我们自己怎么客观对待它们，不要自卑畏缩。' },
        { category: '心理描写', stem: '在《一只窝囊的大老虎》中，“我”扮演老虎时期待与现实的巨大落差心理变化是：', options: ['充满期待与兴奋 —— 登台时紧张慌乱 —— 演砸后窝囊与困惑', '从头到尾都非常骄傲得意', '从一开始就放声痛哭', '完全不关心观众的反响'], ans: 0, exp: '作者生动真实地刻画了儿童初次登台表演时复杂的内心波澜。' },
        { category: '生动比喻', stem: '《陀螺》中，作者把自己的那只其貌不扬的小陀螺称作“丑小鸭”，因为：', options: ['它长得难看笨拙，却在大战中出人意料地击败了同伴威武漂亮的大陀螺', '它真的是一只鸭子做的', '它是从池塘里捡来的', '它身上贴着鸭子的羽毛'], ans: 0, exp: '借安徒生童话“丑小鸭”的比喻，表现外表平凡但在实战中爆发惊人力量的奇迹。' },
        { category: '俗语启示', stem: '“人不可貌相，海水不可斗量。”这句名言告诫我们在生活中：', options: ['不能仅凭外表长相或穿着轻易评价一个人或事物的内在能力与价值', '海水的容量可以用斗量出来', '长得难看的人都不聪明', '漂亮的人一定本领最大'], ans: 0, exp: '这句俗语强调内在实力与品格远胜于表面的光鲜华丽。' },
        { category: '生字读音', stem: '“旋转(zhuàn)”与“转(zhuǎn)身”的读音是：', options: ['旋转读 zhuàn；转身读 zhuǎn', '旋转读 zhuǎn；转身读 zhuàn', '都读 zhuàn', '都读 zhuǎn'], ans: 0, exp: '绕着轴心转动读第四声 zhuàn；改换方向读第三声 zhuǎn。' },
        { category: '批注阅读法', stem: '在阅读课文时作“批注”，可以写下哪些内容？', options: ['写下对词句的体会品味、对人物的评价、疑问以及联想到的生活经历', '只把段落标上阿拉伯数字', '把插图全部涂成黑色', '只抄写生字笔画'], ans: 0, exp: '作批注是高年级自主深入阅读、记录思维火花的重要好习惯。' },
        { category: '动作刻画', stem: '“鹅伸长脖子，扑打着翅膀，嚣张地朝我咬来。”这段描写通过哪些字词展现了白鹅的凶猛神态？', options: ['“伸长、扑打、嚣张、咬”等连贯动词神态词', '只写了天空的白云', '只写了路边的野花', '只写了鹅身上的白羽毛'], ans: 0, exp: '精准的动作和神态刻画将大白鹅盛气凌人的霸道架势跃然纸上。' },
        { category: '词义解释', stem: '“窝囊”在《一只窝囊的大老虎》中的含义是：', options: ['受了委屈或事情没办好而感到难堪、沮丧无能', '吃得太饱走不动', '衣服穿得太多太厚', '在家里睡觉不出来'], ans: 0, exp: '窝囊形容因表演未达预期、惹得全场哄笑后的尴尬、失落与困窘心理。' },
        { category: '标点与语感', stem: '“只要手里的绳子用力一拉，陀螺就‘啪’地一声在冰面上飞转起来。”破折号或引号在这里的作用是：', options: ['标示拟声词与动作爆发的顿挫感', '表示意思的转折', '表示声音的延长', '表示讽刺否定'], ans: 0, exp: '凸显抽打陀螺时脆响利落的听觉震撼。' },
        { category: '成语积累', stem: '下列每组词语感彩完全一致的一组是：', options: ['垂头丧气 没精打采 愁眉苦脸 (贬义/消极神态)', '胸有成竹 卑鄙无耻 舍己为人', '自高自大 谦虚谨慎 拾金不昧', '大公无私 贪生怕死 舍生取义'], ans: 0, exp: 'A组均为形容失落、沮丧神情的近义词。其余各组均褒贬混杂。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【人生哲理探究】金奎叔对待鹅泰然自若、毫不畏惧，而孩子们却被鹅吓得四散奔逃。这一对比生动揭示了“恐惧”往往来源于什么？我们应如何战胜内心的怯懦？', options: ['恐惧往往来源于盲从传言与心理暗示中的自我矮化；唯有正视现实、树立自信、敢于尝试才能驱散心魔', '恐惧是因为衣服穿得不够多', '只要跑得快就能永远没有恐惧', '不用战胜恐惧，害怕就永远躲在家里'], ans: 0, exp: '许多困难在心理被过度放大，勇敢迎上前去、客观看待事物本质，往往能发现原本看似可怕的对手不堪一击。' }
    ),
  },
  math: {
    1: makePackage(
      '4', 'math', 1, '第1单元：大数的认识', '亿以内数的读写法、数位顺序表、四舍五入与改写',
      [
        { category: '数位顺序', stem: '在数位顺序表中，从右往左数，第五位和第九位分别是：', options: ['万位 和 亿位', '千位 和 百万位', '十万位 和 千万位', '万位 和 十亿位'], ans: 0, exp: '个、十、百、千、万（第5位）、十万、百万、千万、亿（第9位）。' },
        { category: '大数的读法', stem: '数 408000500 的正确读法是：', options: ['四亿零八百万零五百', '四亿八千万五百', '四千零八十万五百', '四十亿八百万五百'], ans: 0, exp: '分级读数：4亿 | 0800万 | 0500个。读作：四亿零八百万零五百。' },
        { category: '大数的写法', stem: '“六千零五十万三千”的正确数字写法是：', options: ['60503000', '60053000', '65003000', '60500300'], ans: 0, exp: '万级是 6050，个级是 3000，合起来为 60503000。' },
        { category: '改写整万整亿', stem: '把 72000000 改写成用“万”作单位的数是：', options: ['7200 万', '720 万', '72 万', '72000 万'], ans: 0, exp: '去掉个级 4 个 0，添上“万”字：7200万。' },
        { category: '四舍五入法', stem: '一个数用“四舍五入”法省略万位后面的尾数约是 5 万，这个数最大可能是：', options: ['54999', '54000', '59999', '49999'], ans: 0, exp: '千位“四舍”的最大情况是千位填 4，其余各位填 9：54999。' },
        { category: '四舍五入最小值', stem: '一个数省略万位后面的尾数约是 8 万，这个数最小可能是：', options: ['75000', '74999', '84999', '85000'], ans: 0, exp: '千位“五入”的最小情况是千位填 5，其余各位填 0：75000。' },
        { category: '自然数性质', stem: '关于自然数，下列说法完全正确的是：', options: ['最小的自然数是 0，没有最大的自然数，自然数的个数是无限的', '最小的自然数是 1', '最大的自然数是一百亿', '小数也是自然数'], ans: 0, exp: '0 是最小自然数，自然数是无限非负整数集合。' },
        { category: '数位与计数单位', stem: '在数 78543000 中，“8”所在的数位和它表示的意义分别是：', options: ['百万位，表示 8 个百万', '千万位，表示 8 个千万', '十万位，表示 8 个十万', '万位，表示 8 个一万'], ans: 0, exp: '从右数第 7 位是百万位，计数单位是百万。' },
        { category: '数字比较大小', stem: '比较 999999 与 1000000 的大小：', options: ['999999 < 1000000 (六位数小于七位数)', '999999 > 1000000', '相等', '无法比较'], ans: 0, exp: '位数不同的两个数，位数多的数更大。' },
        { category: '计算工具算盘', stem: '在传统算盘上，一颗上珠和一颗下珠分别表示的数值是：', options: ['上珠表示 5，下珠表示 1', '上珠表示 1，下珠表示 5', '上珠表示 10，下珠表示 1', '上珠表示 2，下珠表示 1'], ans: 0, exp: '算盘每档梁上一颗珠代表 5，梁下一颗珠代表 1。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【数字构造思维】用 6 个“8”和 4 个“0”组成一个十位数，要求读数时只读出三个“零”。这个数可以是下面哪一个？', options: ['8808080880 (八十八亿零八百零八万零八百八十)', '8888880000', '8080808088', '8880008880'], ans: 0, exp: '分级检验 A：88亿（不读零）| 0808万（千位读一个零，十位读一个零）| 0880（百位读一个零，末尾零不读），恰好读出三个“零”。' }
    ),
    2: makePackage(
      '4', 'math', 2, '第2单元：公顷和平方千米', '土地面积单位进率换算与现实生活面积估测',
      [
        { category: '公顷的定义', stem: '边长是多长的正方形土地，它的面积正好是 1 公顷？', options: ['边长 100 米的正方形 (100×100 = 10000平方米)', '边长 10 米', '边长 1000 米', '边长 1 米'], ans: 0, exp: '100m × 100m = 10000㎡ = 1公顷。' },
        { category: '平方千米定义', stem: '边长是 1 千米的正方形土地，它的面积是：', options: ['1 平方千米 (100公顷 / 1000000平方米)', '10 公顷', '1000 平方米', '10000 公顷'], ans: 0, exp: '1000m × 1000m = 1,000,000㎡ = 100公顷 = 1平方千米。' },
        { category: '进率换算', stem: '5 公顷等于多少平方米？', options: ['50000 平方米', '5000 平方米', '500 平方米', '500000 平方米'], ans: 0, exp: '1 公顷 = 10000 平方米，5 公顷 = 50000 平方米。' },
        { category: '大单位进率', stem: '6 平方千米等于多少公顷？', options: ['600 公顷', '60 公顷', '6000 公顷', '60000 公顷'], ans: 0, exp: '1 平方千米 = 100 公顷，6 平方千米 = 600 公顷。' },
        { category: '单位大小比较', stem: '在 400 公顷与 4 平方千米之间填入关系符号：', options: ['400 公顷 = 4 平方千米', '400 公顷 > 4 平方千米', '400 公顷 < 4 平方千米', '无法比较'], ans: 0, exp: '4 平方千米 = 400 公顷，二者完全相等。' },
        { category: '生活场景单位', stem: '计量一个省份的国土面积、城市的占地面积，通常使用的面积单位是：', options: ['平方千米 (km²)', '公顷', '平方米', '平方分米'], ans: 0, exp: '城市、国家等宏观领土面积均用平方千米作计量单位。' },
        { category: '学校操场估算', stem: '标准的 400 米跑道体育操场，其内部包含的面积大约是：', options: ['1 公顷左右 (约10000平方米)', '1 平方千米', '10 平方米', '100 公顷'], ans: 0, exp: '400米标准操场面积约为 1 公顷左右。' },
        { category: '面积实际计算', stem: '一块长方形果园，长 400 米，宽 250 米。这个果园的面积是多少公顷？', options: ['10 公顷', '100 公顷', '1 公顷', '100000 公顷'], ans: 0, exp: '面积 = 400 × 250 = 100000 平方米 = 10 公顷。' },
        { category: '森林木场题', stem: '一块占地 2 平方千米的森林，每公顷平均有树木 800 棵。这片森林共有多少棵树？', options: ['160000 棵 (16万棵)', '16000 棵', '1600 棵', '80000 棵'], ans: 0, exp: '2 平方千米 = 200 公顷；200 × 800 = 160000 棵。' },
        { category: '单位综合排序', stem: '将 300000平方米、3平方千米、25公顷 按从小到大的顺序排列：', options: ['25公顷 < 300000平方米(30公顷) < 3平方千米(300公顷)', '3平方千米 < 25公顷 < 300000平方米', '300000平方米 < 25公顷 < 3平方千米', '相等'], ans: 0, exp: '统一化为公顷：25公顷 < 30公顷 < 300公顷。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【土地扩展几何】一个正方形养殖场的边长是 300 米。如果把它的边长各增加 200 米，变成一个更大的正方形，养殖场的面积增加了多少公顷？', options: ['16 公顷', '25 公顷', '9 公顷', '4 公顷'], ans: 0, exp: '原面积 = 300 × 300 = 90000㎡ = 9公顷；新边长 = 300 + 200 = 500米，新面积 = 500 × 500 = 250000㎡ = 25公顷。增加面积 = 25 - 9 = 16公顷。' }
    ),
    3: makePackage(
      '4', 'math', 3, '第3单元：角的度量', '线段/射线/直线、量角器用法与锐角/钝角/平角/周角',
      [
        { category: '线的基本特征', stem: '下列关于线段、射线和直线的描述，完全正确的是：', options: ['线段有两个端点可以度量长度；射线有一个端点向一端无限延伸；直线没有端点向两端无限延伸', '直线比射线长', '射线有两个端点', '线段可以无限延伸'], ans: 0, exp: '线段有长短且有两个端点；射线和直线都无限长不可度量。' },
        { category: '过点画线规律', stem: '经过一点可以画多少条直线？经过两点可以画多少条直线？', options: ['无数条；只能画一条直线', '一条；无数条', '两条；两条', '无数条；两条'], ans: 0, exp: '两点确定一条直线；过单点可作无数条直线。' },
        { category: '角的定义', stem: '从一点引出两条什么线所组成的图形叫做“角”？', options: ['射线', '直线', '线段', '曲线'], ans: 0, exp: '从一点引出两条射线所组成的图形叫做角。' },
        { category: '角的大小决定因素', stem: '角的大小取决于：', options: ['两条边张开的大小（张口越大角越大），与两条边的长短无关', '画出的两条边的长短', '顶点的粗细', '量角器的大小'], ans: 0, exp: '射线无限延伸，角的大小由张口开度决定，与边长无关。' },
        { category: '特殊角关系', stem: '1 个周角等于几个平角？等于几个直角？', options: ['2 个平角，4 个直角 (周角=360°)', '1 个平角，2 个直角', '3 个平角，6 个直角', '4 个平角，8 个直角'], ans: 0, exp: '直角=90°，平角=180°，周角=360°。360° = 2×180° = 4×90°。' },
        { category: '量角器读数', stem: '用量角器量角时，角的顶点要与量角器的什么对齐？', options: ['中心点', '零刻度线', '外圈刻度', '内圈刻度'], ans: 0, exp: '中心对顶点，零线对一边，另一边看刻度。' },
        { category: '三角板拼角', stem: '一副标准的三角板（含30°、60°、90°与45°、45°、90°），拼不出的角度是：', options: ['65°', '75°', '105°', '15°'], ans: 0, exp: '三角板拼出的角都是 15° 的倍数（如 45-30=15°，30+45=75°，60+45=105°），65° 不是 15 的倍数拼不出。' },
        { category: '钟表夹角计算', stem: '钟面上整点 3 点整时，时针和分针所构成的夹角是：', options: ['90°（直角）', '60°', '120°', '180°'], ans: 0, exp: '钟面一大格 = 360° ÷ 12 = 30°。3点整相差 3 大格，3 × 30° = 90°。' },
        { category: '钝角范围', stem: '钝角的度数范围是：', options: ['大于 90° 且小于 180°', '大于 90°', '等于 180°', '小于 90°'], ans: 0, exp: '大于 0° 小于 90° 为锐角；大于 90° 小于 180° 为钝角。' },
        { category: '对顶角互补', stem: '两条直线相交成四个角，若其中一个角是 40°，与它相邻的角的度数是：', options: ['140° (邻角互补成平角)', '40°', '50°', '90°'], ans: 0, exp: '相邻两个角构成平角（180°），180° - 40° = 140°。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【图形折叠推理】将一张长方形纸的一个角如图折叠，使得原直角折叠后与相邻角重合。已知折叠后 ∠1 = 30°，求折叠角 ∠2 的度数是多少？', options: ['75°', '60°', '45°', '30°'], ans: 0, exp: '由折叠对称性可知，纸片重合形成两个相等的角 ∠2，平角 180° - 30° = 150°，150° ÷ 2 = 75°。' }
    ),
    4: makePackage(
      '4', 'math', 4, '第4单元：三位数乘两位数', '笔算乘法法则、积的变化规律、速度/时间/路程数量关系',
      [
        { category: '笔算乘法', stem: '计算 145 × 12 时，先算 145 × 2 = 290，再算 145 × 10 = 1450，最后相加得：', options: ['1740', '1640', '1840', '2900'], ans: 0, exp: '290 + 1450 = 1740。' },
        { category: '因数末尾有0', stem: '计算 240 × 50，可以先算 24 × 5 = 120，然后在 120 的末尾添上几个 0？', options: ['2 个 0 (积为 12000)', '1 个 0', '3 个 0', '不添 0'], ans: 0, exp: '两个因数末尾一共有 2 个 0，所以添 2 个 0，得 12000。' },
        { category: '积的变化规律', stem: '在乘法算式中，一个因数乘 5，另一个因数不变，积会：', options: ['也乘 5', '除以 5', '不变', '增加 5'], ans: 0, exp: '积的变化规律：一个因数乘或除以几（0除外），另一个因数不变，积也乘或除以相同的数。' },
        { category: '积不变性质', stem: '两数相乘，若一个因数乘 4，另一个因数除以 4，它们的积：', options: ['不变', '乘 16', '除以 16', '乘 4'], ans: 0, exp: '一个因数扩大 k 倍，另一个缩小相同倍数，积保持不变。' },
        { category: '行程核心公式', stem: '关于行程问题的数量关系式，表达正确的是：', options: ['速度 × 时间 = 路程；路程 ÷ 时间 = 速度', '速度 + 时间 = 路程', '路程 × 时间 = 速度', '速度 ÷ 路程 = 时间'], ans: 0, exp: '经典基本公式：路程 = 速度 × 时间。' },
        { category: '速度单位写法', stem: '一辆高铁列车每小时行 350 千米，它的速度可以规范记作：', options: ['350 千米/时 (350 km/h)', '350 千米', '350 小时', '350 时/千米'], ans: 0, exp: '复合单位规范书写：单位路程/时间单位，读作 350 千米每时。' },
        { category: '实际行程应用', stem: '汽车以 80 千米/时的速度行驶，从甲地到乙地行驶了 5 小时。甲乙两地相距：', options: ['400 千米', '85 千米', '16 千米', '450 千米'], ans: 0, exp: '80 × 5 = 400 千米。' },
        { category: '单价数量关系', stem: '购买体育用品，单价 × 数量 = 总价。已知篮球每个 120 元，买 15 个需多少元？', options: ['1800 元', '1500 元', '1680 元', '2000 元'], ans: 0, exp: '120 × 15 = 1800 元。' },
        { category: '估算应用', stem: '李阿姨打算买 28 套演出服，每套 198 元，大约需要准备多少钱？', options: ['6000 元 (30 × 200 = 6000)', '4000 元', '8000 元', '5000 元'], ans: 0, exp: '28 估为 30，198 估为 200，30 × 200 = 6000 元。' },
        { category: '乘法竖式数位', stem: '在竖式计算 234 × 26 中，用十位上的 2 去乘 234，得到的数是 468，它表示：', options: ['468 个十 (即 4680)', '468 个一', '468 个百', '468 个千'], ans: 0, exp: '十位上的 2 表示 2 个十，20 × 234 = 4680。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【图形面积与规律】一块长方形绿地的面积是 200 平方米。如果现在将这块绿地的长扩大到原来的 3 倍，宽扩大到原来的 2 倍，扩大后绿地的面积是多少平方米？', options: ['1200 平方米 (200 × 3 × 2 = 1200)', '1000 平方米', '600 平方米', '500 平方米'], ans: 0, exp: '长方形面积 = 长 × 宽。长扩大 3 倍、宽扩大 2 倍，面积相应扩大 3 × 2 = 6 倍。200 × 6 = 1200 平方米。' }
    ),
    5: makePackage(
      '4', 'math', 5, '第5单元：平行四边形和梯形', '垂直与平行概念、高与底、平行四边形与梯形特征',
      [
        { category: '平行线概念', stem: '在同一个平面内，两条不相交的直线叫做：', options: ['平行线', '垂线', '相交线', '斜线'], ans: 0, exp: '同平面内永不相交的两条直线互相平行。前提是“在同一平面内”。' },
        { category: '垂直概念', stem: '两条直线相交成什么角时，这两条直线互相垂直？', options: ['直角 (90°)', '锐角', '钝角', '平角'], ans: 0, exp: '两条直线相交成直角时互相垂直，其中一条叫另一条的垂线。' },
        { category: '垂线段最短', stem: '从直线外一点到这条直线所画的所有线段中：', options: ['垂直线段最短（点到直线的距离）', '斜线最短', '一样长', '无法比较'], ans: 0, exp: '点到直线的垂线段长度最短，即点到直线的距离。' },
        { category: '平行线间距离', stem: '平行线之间的所有垂线段的长度：', options: ['处处相等', '不相等', '越来越长', '越来越短'], ans: 0, exp: '平行线间的距离处处相等，具有恒定性。' },
        { category: '平行四边形特征', stem: '平行四边形的最核心边角特征是：', options: ['两组对边分别平行且相等，对角相等', '只有一组对边平行', '四个角都是直角', '四条边都相等'], ans: 0, exp: '两组对边分别平行的四边形叫做平行四边形。' },
        { category: '图形稳定性', stem: '自行车的车架做成三角形，拉闸伸缩门做成平行四边形网格，分别利用了：', options: ['三角形的稳定性和平行四边形的易变形性（灵活性）', '都是为了美观', '都是因为稳定性', '没有科学道理'], ans: 0, exp: '三角形具有稳定性；平行四边形易变形，适合折叠与伸缩。' },
        { category: '梯形定义', stem: '只有一组对边平行的四边形叫做：', options: ['梯形', '平行四边形', '长方形', '正方形'], ans: 0, exp: '只有一组对边平行的四边形是梯形；平行的两边分别叫上底和下底。' },
        { category: '特殊梯形', stem: '两腰相等的梯形叫做：', options: ['等腰梯形', '直角梯形', '正梯形', '不等腰梯形'], ans: 0, exp: '两腰相等的梯形是等腰梯形，其两个底角相等。' },
        { category: '四边形从属关系', stem: '关于四边形之间的包容关系，描述正确的是：', options: ['长方形和正方形都是特殊的平行四边形，正方形是特殊的长方形', '梯形是特殊的平行四边形', '平行四边形都是长方形', '四边形只有长方形和正方形'], ans: 0, exp: '平行四边形包含长方形，长方形包含正方形；梯形与平行四边形是并列子集。' },
        { category: '画高法则', stem: '从平行四边形一条边上的一点到对边引一条垂线，这点和垂足之间的线段叫做平行四边形的：', options: ['高 (垂足所在的边叫底)', '底', '对角线', '腰'], ans: 0, exp: '平行四边形的高是底边之间的垂直线段。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【图形剪拼探究】在一张直角梯形纸片上剪一刀，将其分成两个图形。下列哪种分割结果是绝对不可能出现的？', options: ['分成两个锐角三角形', '分成一个平行四边形和一个直角三角形', '分成一个长方形和一个直角三角形', '分成一个梯形和一个三角形'], ans: 0, exp: '直角梯形内含直角，剪一刀产生的直角必会被保留或形成直角三角形，绝不可能仅通过一条直线分割得到两个完全没有钝角和直角的纯锐角三角形。' }
    ),
    6: makePackage(
      '4', 'math', 6, '第6单元：除数是两位数的除法', '试商调商策略、商的变化规律与解决实际问题',
      [
        { category: '口算除法', stem: '口算 180 ÷ 30 的正确得数是：', options: ['6', '60', '9', '5'], ans: 0, exp: '18个十除以3个十等于6。' },
        { category: '商的位数判断', stem: '三位数除以两位数 3□4 ÷ 36，要使商是一位数，□里最大填：', options: ['5 (354 ÷ 36，被除数前两位 35 < 36，商是一位数)', '6', '7', '9'], ans: 0, exp: '前两位小于除数时商是一位数，35 < 36，最大填 5。' },
        { category: '试商技巧“四舍”', stem: '计算 272 ÷ 34 时，通常把除数 34 看作多少来试商？', options: ['30 (四舍法试商，初商易偏大需调小)', '40', '35', '20'], ans: 0, exp: '个位是 4，用四舍法看作 30 试商。' },
        { category: '试商技巧“五入”', stem: '计算 458 ÷ 58 时，把除数 58 看作 60 试商，初商容易：', options: ['偏小，需要调大', '偏大，需要调小', '正好合适', '无法判断'], ans: 0, exp: '把除数看大了，除出来的商容易偏小，需要调大。' },
        { category: '商不变的规律', stem: '被除数和除数同时乘或者除以相同的数（0 除外），商：', options: ['不变', '乘相同的数', '除以相同的数', '扩大两倍'], ans: 0, exp: '被除数和除数同向等比例变化，商保持不变。' },
        { category: '余数变化规律', stem: '根据 45 ÷ 6 = 7……3，可知 450 ÷ 60 的结果是：', options: ['7……30', '7……3', '70……30', '70……3'], ans: 0, exp: '被除数和除数同时乘 10，商不变仍是 7，余数也跟着乘 10 变成 30。' },
        { category: '笔算试商调商', stem: '196 ÷ 39 的准确得数是：', options: ['5……1', '5……6', '4……40', '6……2'], ans: 0, exp: '39 × 5 = 195，196 - 195 = 1。商 5 余 1。' },
        { category: '实际包装问题', stem: '一共有 240 块月饼，每盒装 12 块。一共可以装多少盒？', options: ['20 盒', '24 盒', '18 盒', '22 盒'], ans: 0, exp: '240 ÷ 12 = 20（盒）。' },
        { category: '估算应用', stem: '小红家到学校 820 米，她走了 19 分钟，她平均每分钟大约走多少米？', options: ['40 米 (800 ÷ 20 = 40)', '50 米', '30 米', '60 米'], ans: 0, exp: '820 估为 800，19 估为 20，800 ÷ 20 = 40 米/分。' },
        { category: '余数与除数关系', stem: '在有余数的除法算式 □ ÷ 25 = 14……△ 中，余数 △ 最大是：', options: ['24', '25', '26', '1'], ans: 0, exp: '余数必须比除数小，除数是 25，最大余数是 25 - 1 = 24。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【购物优化与打折】服装店促销活动：一件上衣 45 元，买两件 79 元。王老师带了 350 元钱，最多可以买多少件这样的上衣？还剩多少钱？', options: ['最多买 8 件，还剩 34 元 (买4组两件花 316 元，剩 34 元不够再买一件)', '最多买 7 件，还剩 35 元', '最多买 8 件，还剩 10 元', '最多买 9 件，还剩 0 元'], ans: 0, exp: '两件套优惠力度大（单价约39.5元）：350 ÷ 79 = 4 组（即 8 件）…… 34 元。余下 34 元小于单件 45 元，不能再买。故最多买 8 件，剩 34 元。' }
    ),
  },
  english: {
    1: makePackage(
      '4', 'english', 1, 'Unit 1 My Classroom', '教室设施物品、方位介词in/on/under/near与a-e发音',
      [
        { category: '教室设施', stem: '中文“黑板”对应的英文单词是：', options: ['blackboard', 'window', 'door', 'picture'], ans: 0, exp: 'blackboard 表示黑板；window 是窗户；door 是门。' },
        { category: '方位介词', stem: 'The picture is ________ the wall. (挂在墙上用介词):', options: ['on', 'in', 'under', 'near'], ans: 0, exp: '挂在墙面上用介词 on。' },
        { category: '提出建议', stem: '想提议和同桌一起打扫教室，应该说：', options: ['Let\'s clean the classroom.', 'Where is the classroom?', 'This is my classroom.', 'Good morning!'], ans: 0, exp: 'Let\'s do ... 表示提议一起做某事。' },
        { category: '位置询问', stem: '— Where is the green kite? — It\'s ________ the window.', options: ['near (在窗户附近)', 'on', 'in', 'under'], ans: 0, exp: 'near 意为在……旁边/附近。' },
        { category: '自然拼读', stem: '单词“cake, face, make”中元音字母组合 a-e 发什么音？', options: ['/eɪ/', '/æ/', '/ɑ:/', '/ɔ:/'], ans: 0, exp: '元音字母 a 在相对开音节 a-e 中发字母本身的名称音 /eɪ/。' },
        { category: '指示代词', stem: 'Look! This is my new desk and ________ is your chair.', options: ['that', 'these', 'those', 'where'], ans: 0, exp: '单数近指 this，远指 that。' },
        { category: '动作指令', stem: '“Turn on the light.”的中文意思是：', options: ['打开电灯', '关上窗户', '打开大门', '擦黑板'], ans: 0, exp: 'turn on 打开电器，light 是电灯。' },
        { category: '物品确认', stem: '— What\'s in the classroom? — One blackboard, two lights, many ________ and chairs.', options: ['desks', 'desk', 'a desk', 'deskes'], ans: 0, exp: 'many 修饰可数名词复数 desks。' },
        { category: '礼貌赞美', stem: '参观新教室时赞叹“它真大真漂亮！”，英语可以说：', options: ['It\'s so big and nice!', 'It\'s too small.', 'Where is it?', 'Open the door.'], ans: 0, exp: 'so big and nice 意为如此大又漂亮。' },
        { category: '介词搭配', stem: 'A bee is on the fan. 句中“fan”的中文意思是：', options: ['风扇', '书包', '地板', '讲台'], ans: 0, exp: 'fan 是风扇。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【教室礼仪与环保】How should good students keep the classroom clean and tidy every day?', options: ['Clean the blackboard, put desks in order, sweep the floor and turn off lights after school', 'Throw rubbish on the floor', 'Draw graffiti on the desks', 'Leave lights on all night'], ans: 0, exp: '随手关灯、擦净黑板、桌椅排齐、地面整洁是良好的班集体主人翁素养。' }
    ),
    2: makePackage(
      '4', 'english', 2, 'Unit 2 My Schoolbag', '书包文具用品、数量与颜色描述及i-e发音',
      [
        { category: '书本文具', stem: '“maths book”的中文意思是：', options: ['数学书', '语文书', '英语书', '故事书'], ans: 0, exp: 'maths book 是数学书；Chinese book 语文书；English book 英语书。' },
        { category: '颜色与提问', stem: '— What colour is your new schoolbag? — It\'s ________.', options: ['blue and white', 'three books', 'in the desk', 'very big'], ans: 0, exp: 'What colour 询问颜色，回答必须是颜色词汇。' },
        { category: '自然拼读', stem: '单词“like, kite, five, nine”中元音字母组合 i-e 发什么音？', options: ['/aɪ/', '/ɪ/', '/i:/', '/e/'], ans: 0, exp: 'i 在相对开音节 i-e 中发双元音 /aɪ/。' },
        { category: '情景对话', stem: '— I have a new schoolbag. — ________? — Black and white. It looks like a panda!', options: ['What colour is it', 'Where is it', 'How much is it', 'What is it'], ans: 0, exp: '根据答语“Black and white”可知问句在询问颜色。' },
        { category: '物品清单', stem: 'What\'s in my schoolbag? An English book, a maths book and three ________.', options: ['storybooks', 'storybook', 'a storybook', 'storys'], ans: 0, exp: '数词 three 后面加名词复数 storybooks。' },
        { category: '冠词运用', stem: 'I have ________ English book in my bag.', options: ['an', 'a', 'the', '/'], ans: 0, exp: 'English 以元音音素开头，不定冠词用 an。' },
        { category: '重量感受', stem: 'My schoolbag is too ________! There are ten heavy books in it.', options: ['heavy (沉重的)', 'light', 'small', 'short'], ans: 0, exp: 'heavy 意为沉重的；light 是轻的。' },
        { category: '失物招领', stem: '去失物招领处找书包，可以说：', options: ['Excuse me. I lost my schoolbag.', 'Here you are.', 'Thank you so much.', 'Goodbye!'], ans: 0, exp: 'I lost my schoolbag. 意为我弄丢了我的书包。' },
        { category: '数词拼写', stem: '英语数字“12”和“20”的正确拼写是：', options: ['twelve 和 twenty', 'twelv 和 twenteen', 'two 和 ten', 'twen and twelv'], ans: 0, exp: 'twelve 是 12，twenty 是 20。' },
        { category: '文具词汇', stem: '用于放铅笔、橡皮和直尺的文具盒英文是：', options: ['pencil box', 'schoolbag', 'notebook', 'key'], ans: 0, exp: 'pencil box / pencil case 是铅笔盒。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【健康好习惯探究】Why should we tidy our schoolbag every night and not carry unnecessary heavy toys?', options: ['To keep books neat and protect our growing spine and shoulders from being hurt', 'Because schoolbags are only for decoration', 'Because heavy bags make us run faster', 'So we don\'t have to do homework'], ans: 0, exp: '每晚整理书包减负，既能培养自理能力，又能保护正在发育的脊柱健康。' }
    ),
    3: makePackage(
      '4', 'english', 3, 'Unit 3 My Friends', '人物外貌身材特征、性格与o-e发音',
      [
        { category: '外貌身材', stem: '形容一个人身材“高大且强壮”的英文词汇是：', options: ['tall and strong', 'short and thin', 'quiet and small', 'friendly and fat'], ans: 0, exp: 'tall 是高，strong 是强壮。' },
        { category: '性格特征', stem: '中文“友好友善”对应的英文单词是：', options: ['friendly', 'strict', 'shy', 'funny'], ans: 0, exp: 'friendly 意为友好的；friend 是朋友。' },
        { category: '外貌配饰', stem: 'He has glasses and his shoes are blue. 句中“glasses”的意思是：', options: ['眼镜', '玻璃杯', '手套', '帽子'], ans: 0, exp: 'glasses 作复数名词时表示眼镜。' },
        { category: '头发特征', stem: 'She has ________ hair and big eyes.', options: ['long', 'tall', 'strong', 'heavy'], ans: 0, exp: '形容头发长短用 long 或 short。' },
        { category: '自然拼读', stem: '单词“nose, note, Coke, home”中字母组合 o-e 发什么音？', options: ['/əʊ/', '/ɒ/', '/u:/', '/ɔ:/'], ans: 0, exp: 'o 在开音节 o-e 中发双元音 /əʊ/。' },
        { category: '代词区分', stem: '介绍男性朋友用 ________，介绍女性朋友用 ________：', options: ['He, She', 'She, He', 'It, He', 'They, She'], ans: 0, exp: '男性第三人称主格用 He；女性用 She。' },
        { category: '猜测人物', stem: '— Who is he? — ________ is Mike. He is from Canada.', options: ['He', 'She', 'His', 'Her'], ans: 0, exp: '作句子主语指代男性，用人称代词主格 He。' },
        { category: '物主代词', stem: '________ name is Zhang Peng. He is very polite.', options: ['His', 'Her', 'He', 'Him'], ans: 0, exp: '修饰名词 name 表示“他的名字”，用形容词性物主代词 His。' },
        { category: '性格安静', stem: 'The girl is very ________. She likes reading books quietly.', options: ['quiet (安静温和的)', 'noisy', 'tall', 'short'], ans: 0, exp: 'quiet 意为文静的、安静的。' },
        { category: '反义词对应', stem: '“thin (瘦的)”的反义词是：', options: ['strong / fat (壮的/胖的)', 'tall', 'short', 'nice'], ans: 0, exp: 'thin 与 strong/fat 互为反义。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【友谊真谛探究】What makes a true and great friend? (什么样的人是真正的挚友？)', options: ['Kindness, honesty, helping each other and respecting differences', 'Only giving expensive gifts', 'Only playing video games together', 'Never talking to each other'], ans: 0, exp: '真正的友谊建立在真诚善良、互帮互助和尊重理解彼此差异的基础之上。' }
    ),
    4: makePackage(
      '4', 'english', 4, 'Unit 4 My Home', '家庭房间设施、居室定位与u-e发音',
      [
        { category: '房间名称', stem: '妈妈在做美味的饭菜，她所在的房间是：', options: ['kitchen (厨房)', 'bedroom (卧室)', 'bathroom (卫生间)', 'living room (客厅)'], ans: 0, exp: 'kitchen 是厨房；cook meals 在厨房进行。' },
        { category: '房间名称', stem: '晚上我们睡觉休息的房间是：', options: ['bedroom', 'kitchen', 'study', 'bathroom'], ans: 0, exp: 'bedroom 是卧室。' },
        { category: '书房设施', stem: '爸爸在“study”看书，study 的中文意思是：', options: ['书房', '花园', '阳台', '车库'], ans: 0, exp: 'study 作名词时表示书房。' },
        { category: '自然拼读', stem: '单词“cute, use, excuse”中元音字母组合 u-e 发什么音？', options: ['/ju:/', '/ʌ/', '/u:/', '/ʊ/'], ans: 0, exp: 'u-e 在相对开音节中发 /ju:/。' },
        { category: '位置询问单数', stem: '— Where is the cat? — Is she in the living room? — ________. She is in the kitchen.', options: ['No, she isn\'t.', 'Yes, she is.', 'She is quiet.', 'Good job.'], ans: 0, exp: '根据后句“她在厨房”可知客厅的猜测是否定的：No, she isn\'t.' },
        { category: '位置询问复数', stem: '— Where are my keys? — ________ are on the fridge.', options: ['They', 'It', 'He', 'She'], ans: 0, exp: 'keys 是复数，用代词 They 回答。' },
        { category: '家具电器', stem: '用于保鲜存放牛奶果汁的“冰箱”英文是：', options: ['fridge', 'table', 'sofa', 'bed'], ans: 0, exp: 'fridge / refrigerator 是冰箱。' },
        { category: '客厅家具', stem: '客厅里柔软的长沙发英文单词是：', options: ['sofa', 'desk', 'chair', 'phone'], ans: 0, exp: 'sofa 是沙发。' },
        { category: '一般疑问句', stem: '— Are the pens on the desk? — Yes, ________.', options: ['they are', 'they aren\'t', 'it is', 'they do'], ans: 0, exp: 'Are they ... 肯定回答用 Yes, they are.' },
        { category: '指令理解', stem: '“Go to the living room. Watch TV.”的意思是：', options: ['去客厅看电视', '去书房看书', '去卧室睡觉', '去厨房洗碗'], ans: 0, exp: 'living room 是客厅，watch TV 是看电视。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【家庭责任与劳动】How can primary students make home a cozy and sweet place?', options: ['Keep own bedroom clean, sweep the floor, fold quilts and help wash dishes', 'Scatter toys everywhere on the floor', 'Wait for parents to do all chores', 'Never put shoes in shoe rack'], ans: 0, exp: '整理自己的房间、叠被子、帮父母做力所能及的家务，能让家庭充满爱与温馨。' }
    ),
    5: makePackage(
      '4', 'english', 5, 'Unit 5 Dinner\'s ready', '重点食物与餐具、礼貌点餐用语与-e发音',
      [
        { category: '食物词汇', stem: '中文“牛肉”对应的英文单词是：', options: ['beef', 'chicken', 'noodles', 'soup'], ans: 0, exp: 'beef 是牛肉；chicken 是鸡肉；noodles 面条；soup 汤。' },
        { category: '中国特色餐具', stem: '中国人吃面条和米饭常用的“筷子”英文是：', options: ['chopsticks (复数)', 'fork', 'knife', 'spoon'], ans: 0, exp: 'chopsticks 是筷子，成对使用通常用复数。' },
        { category: '餐具词汇', stem: '喝汤常用的餐具“勺子”英文单词是：', options: ['spoon', 'fork', 'knife', 'bowl'], ans: 0, exp: 'spoon 是勺子；fork 是叉子；knife 是刀；bowl 是碗。' },
        { category: '点餐询问', stem: '晚餐时妈妈礼貌地问“你晚餐想吃什么？”，标准英文是：', options: ['What would you like for dinner?', 'What do you have for lunch?', 'Where is the dinner?', 'Do you like breakfast?'], ans: 0, exp: 'What would you like for dinner? 是询问对方想要吃什么的标准句型。' },
        { category: '点餐回答', stem: '— What would you like? — I\'d like some ________ and vegetables, please.', options: ['chicken', 'a chicken', 'chickens', 'chick'], ans: 0, exp: 'chicken 表示鸡肉是不可数名词，用 some chicken。' },
        { category: '餐桌礼仪', stem: '主人招待客人吃饭说“请自便 / 别客气自取”，英语常用：', options: ['Help yourself.', 'Give me food.', 'You are welcome.', 'No, thanks.'], ans: 0, exp: 'Help yourself. 是西方餐桌上极有教养的“请自便/别客气”表达。' },
        { category: '建议与应答', stem: '— Would you like some soup? — ________. I\'m full.', options: ['No, thanks', 'Yes, please', 'Here you are', 'Help yourself'], ans: 0, exp: '礼貌婉拒使用“No, thanks.”。' },
        { category: '自然拼读', stem: '单词“he, she, we, me”中字母“e”在词尾开音节中发什么音？', options: ['/i:/', '/e/', '/ɪ/', '/aɪ/'], ans: 0, exp: '绝对开音节中字母 e 发长元音 /i:/。' },
        { category: '能力与餐具使用', stem: 'I can use ________ for beef. (吃牛排西餐时使用刀叉):', options: ['a knife and fork', 'chopsticks', 'a spoon', 'a bowl'], ans: 0, exp: 'knife and fork（刀叉）是吃西餐牛排的标准餐具。' },
        { category: '词汇辨析', stem: '下列单词中全部属于食物或蔬菜的一组是：', options: ['beef, chicken, noodles, vegetables', 'spoon, fork, knife, bowl', 'kitchen, bedroom, study, living room', 'tall, strong, friendly, quiet'], ans: 0, exp: 'A组均为食物蔬菜；B组为餐具；C组为房间；D组为形容词。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【跨文化餐桌礼仪与健康饮食】What are healthy dining habits and polite table manners across cultures?', options: ['Eat balanced nutritious food, don\'t waste food, use tableware quietly and say "Please / Thank you"', 'Pick food with hands and speak loudly with full mouth', 'Only eat meat and never eat vegetables', 'Leave full plate uneaten and throw away'], ans: 0, exp: '荤素营养均衡、践行光盘行动、餐桌上轻拿轻放餐具并常说请和谢谢，是全世界通行的文明餐桌礼仪。' }
    ),
    6: makePackage(
      '4', 'english', 6, 'Unit 6 Meet My Family', '家庭成员称呼、常见职业与家庭人数询问',
      [
        { category: '家庭人数提问', stem: '想询问对方“你家有几口人？”，标准的英语问句是：', options: ['How many people are there in your family?', 'How old is your family?', 'Where is your family?', 'Who is your family?'], ans: 0, exp: 'How many people are there in your family? 询问家庭人口数量。' },
        { category: '职业词汇', stem: '在医院救死扶伤的“医生”英文单词是：', options: ['doctor', 'nurse', 'teacher', 'driver'], ans: 0, exp: 'doctor 是医生；nurse 是护士。' },
        { category: '职业询问', stem: '— What\'s your father\'s job? — He is a ________.', options: ['football player', 'tall and strong', 'in the bedroom', 'forty years old'], ans: 0, exp: '询问职业，回答需是职业名词，如 football player（足球运动员）。' },
        { category: '亲属称谓', stem: '“uncle”在英文中可以指称：', options: ['叔叔 / 伯伯 / 舅舅 / 姑父', '姑姑 / 阿姨', '堂兄弟', '祖父'], ans: 0, exp: 'uncle 泛指与父母同辈的男性亲属。' },
        { category: '亲属称谓', stem: '中文“阿姨 / 姑姑 / 舅妈”对应的英文是：', options: ['aunt', 'sister', 'mother', 'cousin'], ans: 0, exp: 'aunt 泛指女性长辈亲属。' },
        { category: '职业词汇', stem: '驾驶公交车或出租车的职业英文是：', options: ['driver', 'cook', 'farmer', 'teacher'], ans: 0, exp: 'driver 是司机。' },
        { category: '情景对话', stem: '— Is this your uncle? — Yes, he is. He is a ________. He works on a farm.', options: ['farmer', 'doctor', 'driver', 'nurse'], ans: 0, exp: '在农场（farm）劳作的是农民（farmer）。' },
        { category: '职业与工作', stem: '在学校教育学生传授知识的职业是：', options: ['teacher', 'doctor', 'cook', 'driver'], ans: 0, exp: 'teacher 是教师。' },
        { category: '代词提问', stem: '想问照片里的女性“她是做什么工作的？”，英文是：', options: ['What\'s her job?', 'What\'s his job?', 'Who is he?', 'Where is she?'], ans: 0, exp: 'her job 意为她的职业工作。' },
        { category: '综合家庭表达', stem: 'My family has six people: my grandparents, my parents, my baby brother and ________.', options: ['me', 'I', 'my', 'mine'], ans: 0, exp: '在句末列举成员时用宾格 me。' },
      ],
      { category: '思维拓展·素养拔高', stem: '【职业平等与劳动尊重】All jobs in society are equal and respectable. Why should we respect every worker from doctors to street cleaners?', options: ['Because every honest job contributes to our society and makes our city and life better', 'Because only doctors are important', 'Because some jobs have no value', 'Because we only need teachers'], ans: 0, exp: '每一份诚实劳动的职业都在为社会的平稳运转与美好生活贡献力量，劳动最光荣，职业无贵贱。' }
    ),
  },
};
