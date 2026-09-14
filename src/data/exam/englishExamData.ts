import { GradeLevel } from '../../types';
import { ExamPaper, ExamQuestion } from './types';
import { makeJudge, makeChoice, makeExtension } from './helpers';

export function generateEnglishExam(grade: GradeLevel): ExamPaper {
  const gradeLabel =
    grade === '3' ? '三年级' : grade === '4' ? '四年级' : grade === '5' ? '五年级' : '六年级';
  const q: ExamQuestion[] = [];

  let unitName = '';
  let paperTitle = '';
  let paperSubtitle = '';

  if (grade === '3') {
    // ==========================================
    // 三年级上册 Unit 1: Making Friends (2024全新版)
    // ==========================================
    unitName = 'Unit 1: Making Friends';
    paperTitle = '三年级英语上册 · Unit 1《Making Friends》满分冲刺卷';
    paperSubtitle = '2024全新人教PEP版 · 字母与自然拼读、身体与打招呼词汇、日常交际与短文精读';

    // Section 1: 语音与字母发音 (1-10题)
    const phonicsG3 = [
      { stem: '选出字母 "Aa" 在单词 "apple" 中的正确发音：', opts: ['/æ/', '/eɪ/', '/ɑː/', '/e/'], ans: 0, exp: '字母 Aa 在闭音节中通常发 /æ/，如 apple, bag, cat。' },
      { stem: '选出字母 "Bb" 在单词 "book" 中的发音：', opts: ['/b/', '/p/', '/d/', '/v/'], ans: 0, exp: '字母 Bb 在单词中发浊辅音 /b/。' },
      { stem: '选出字母 "Cc" 在单词 "cat" 中的发音：', opts: ['/k/', '/s/', '/tʃ/', '/g/'], ans: 0, exp: '字母 Cc 在 a, o, u 前发清辅音 /k/。' },
      { stem: '选出字母 "Dd" 在单词 "dog" 中的发音：', opts: ['/d/', '/t/', '/b/', '/ð/'], ans: 0, exp: '字母 Dd 发浊辅音 /d/。' },
      { stem: '英语字母表的前四个字母顺序是：', opts: ['Aa, Bb, Cc, Dd', 'Aa, Cc, Bb, Dd', 'Bb, Aa, Dd, Cc', 'Aa, Bb, Dd, Cc'], ans: 0, exp: '英文字母标准排序：A, B, C, D。' },
      { stem: '大写字母 "C" 的小写形式是：', opts: ['c', 'd', 'b', 'a'], ans: 0, exp: '大写 C 对应小写 c。' },
      { stem: '下列单词中首字母发音为 /b/ 的是：', opts: ['bag', 'apple', 'cat', 'duck'], ans: 0, exp: 'bag 的首字母 b 发 /b/。' },
      { stem: '下列单词中首字母发音为 /d/ 的是：', opts: ['duck', 'cat', 'bear', 'ant'], ans: 0, exp: 'duck 的首字母 d 发 /d/。' },
      { stem: '以元音音素开头的单词（如 apple）前通常使用不定冠词：', opts: ['an', 'a', 'the', '/'], ans: 0, exp: 'apple 以元音音素 /æ/ 开头，用 an apple。' },
      { stem: '书写英文时，每个句子开头第一个单词的首字母必须：', opts: ['大写 (Capitalize)', '小写', '斜体', '缩写'], ans: 0, exp: '英文句子首字母必须大写。' },
    ];
    phonicsG3.forEach((item, idx) => {
      q.push(makeChoice(`g3-e-${idx + 1}`, idx + 1, '一、字母认读与自然拼读 (1-10题)', item.stem, item.opts, item.ans, item.exp));
    });

    // Section 2: 核心词汇与短语 (11-25题)
    const vocabG3 = [
      { stem: '中文“耳朵”对应的英文单词是：', opts: ['ear', 'eye', 'arm', 'hand'], ans: 0, exp: 'ear 表示耳朵。' },
      { stem: '中文“眼睛”对应的英文单词是：', opts: ['eye', 'ear', 'mouth', 'arm'], ans: 0, exp: 'eye 表示眼睛。' },
      { stem: '中文“手”对应的英文单词是：', opts: ['hand', 'foot', 'leg', 'ear'], ans: 0, exp: 'hand 表示手。' },
      { stem: '中文“手臂”对应的英文单词是：', opts: ['arm', 'leg', 'hand', 'eye'], ans: 0, exp: 'arm 表示手臂。' },
      { stem: '中文“嘴巴”对应的英文单词是：', opts: ['mouth', 'nose', 'face', 'tooth'], ans: 0, exp: 'mouth 表示嘴巴。' },
      { stem: '中文“朋友”对应的英文单词是：', opts: ['friend', 'teacher', 'family', 'student'], ans: 0, exp: 'friend 表示朋友。' },
      { stem: '中文“分享”对应的英文动词是：', opts: ['share', 'smile', 'listen', 'help'], ans: 0, exp: 'share 表示分享。' },
      { stem: '中文“微笑”对应的英文单词是：', opts: ['smile', 'sing', 'dance', 'listen'], ans: 0, exp: 'smile 表示微笑。' },
      { stem: '中文“倾听、听”对应的英文单词是：', opts: ['listen', 'look', 'say', 'talk'], ans: 0, exp: 'listen 表示听。' },
      { stem: '中文“帮助”对应的英文单词是：', opts: ['help', 'have', 'play', 'work'], ans: 0, exp: 'help 表示帮助。' },
      { stem: '“wave my hand”的中文意思是：', opts: ['挥挥我的手', '摸摸我的眼睛', '抬起我的胳膊', '握手'], ans: 0, exp: 'wave my hand 意为挥手打招呼。' },
      { stem: '“I have two eyes.”的中文意思是：', opts: ['我有两只眼睛。', '我有一只耳朵。', '我有两双手。', '我看到你了。'], ans: 0, exp: 'two eyes 是两只眼睛。' },
      { stem: '“Goodbye”的同义表达是：', opts: ['Bye-bye', 'Hello', 'Hi', 'Good morning'], ans: 0, exp: 'Goodbye 与 Bye-bye 都是再见的意思。' },
      { stem: '在英文中，“arm”的复数形式是“arms”。', isTrue: true, exp: '名词 arm 的规则复数加 s。' },
      { stem: '单词“ear”以元音音素开头，表示“一只耳朵”用“an ear”。', isTrue: true, exp: 'ear 以元音音素 /ɪə/ 开头，加冠词 an。' },
    ];
    vocabG3.forEach((item, idx) => {
      const num = 11 + idx;
      if ('isTrue' in item) {
        q.push(makeJudge(`g3-e-${num}`, num, '二、核心词汇与短语辨析 (11-25题)', item.stem, item.isTrue, item.exp));
      } else {
        q.push(makeChoice(`g3-e-${num}`, num, '二、核心词汇与短语辨析 (11-25题)', item.stem, item.opts, item.ans, item.exp));
      }
    });

    // Section 3: 句型结构与情景交际 (26-40题)
    const grammarG3 = [
      { stem: '初次认识新朋友，最礼貌的问候是：', opts: ['Nice to meet you.', 'Good night.', 'Goodbye.', 'No, I don\'t.'], ans: 0, exp: '初次相识用 Nice to meet you（很高兴认识你）。' },
      { stem: '— Hello! I\'m Mike. — (  )', opts: ['Hi! I\'m Sarah.', 'Goodbye!', 'Thank you.', 'I am fine.'], ans: 0, exp: '对方打招呼并自报姓名，回应也应友好打招呼并介绍自己。' },
      { stem: '介绍自己的名字可以说：', opts: ['My name is Wu Binbin.', 'I have an ear.', 'Look at the dog.', 'It is red.'], ans: 0, exp: 'My name is... 是自我介绍的标准句型。' },
      { stem: '— Good morning! — (  )', opts: ['Good morning!', 'Good afternoon!', 'Goodbye!', 'Hello!'], ans: 0, exp: '早上好问候对应回答 Good morning!' },
      { stem: 'Look! I (  ) my toys with my friends.', opts: ['share', 'listen', 'smile', 'look'], ans: 0, exp: 'share my toys 表示和朋友分享玩具。' },
      { stem: 'I listen (  ) my ears.', opts: ['with', 'at', 'on', 'to'], ans: 0, exp: 'with my ears 表示“用我的耳朵听”。' },
      { stem: 'I smile (  ) my mouth.', opts: ['with', 'in', 'under', 'for'], ans: 0, exp: 'with my mouth 表示“用我的嘴巴微笑”。' },
      { stem: '— How are you? — (  )', opts: ['I\'m fine, thank you.', 'I am Mike.', 'Nice to meet you.', 'I like apples.'], ans: 0, exp: 'How are you? 询问身体或近况，回答 I\'m fine, thank you.' },
      { stem: 'Let\'s (  ) friends! — Great!', opts: ['be', 'is', 'am', 'are'], ans: 0, exp: 'Let\'s 后接动词原形，Let\'s be friends 意为“让我们做朋友吧”。' },
      { stem: 'Can I help you? — (  )', opts: ['Yes, please.', 'No, you don\'t.', 'Goodbye.', 'You are welcome.'], ans: 0, exp: '接受帮助礼貌回答 Yes, please.' },
      { stem: 'Touch (  ) nose, please.', opts: ['your', 'you', 'he', 'she'], ans: 0, exp: '修饰名词 nose 用形容词性物主代词 your。' },
      { stem: 'We can (  ) each other at school.', opts: ['help', 'helps', 'helping', 'helped'], ans: 0, exp: '情态动词 can 后接动词原形 help。' },
      { stem: '— See you tomorrow! — (  )', opts: ['See you!', 'Hello!', 'Good morning!', 'My name is Lily.'], ans: 0, exp: 'See you tomorrow 道别回应 See you!' },
      { stem: '“Nice to meet you, too.”中的“too”表示“也”。', isTrue: true, exp: 'too 放在肯定句末尾表示“也”。' },
      { stem: '人名（如 Mike, Sarah, Chen Jie）在英语句子中首字母不需要大写。', isTrue: false, exp: '英语中专有名词与人名首字母必须大写。' },
    ];
    grammarG3.forEach((item, idx) => {
      const num = 26 + idx;
      if ('isTrue' in item) {
        q.push(makeJudge(`g3-e-${num}`, num, '三、句型结构与情景交际 (26-40题)', item.stem, item.isTrue, item.exp));
      } else {
        q.push(makeChoice(`g3-e-${num}`, num, '三、句型结构与情景交际 (26-40题)', item.stem, item.opts, item.ans, item.exp));
      }
    });

    // Section 4: 短文阅读理解 (41-50题)
    const passG3_1 = `Hello! My name is Amy. I am eight years old. I am a Grade 3 student. Look at me! I have two big eyes and two ears. I have a small mouth. I like to smile. I have a good friend at school. His name is Mike. Mike is friendly and helpful. We share our books and crayons. We play games together on the playground. We are happy friends.`;
    const passG3_2 = `Welcome to our school! Today is Monday. I meet many new friends. Look! This is Tom. He says, "Hello!" and waves his hand. I smile with my mouth and say, "Nice to meet you, Tom!" Tom says, "Nice to meet you, too!" In class, we listen carefully with our ears. When Tom needs a pencil, I help him. A good friend is like a warm sunshine.`;

    const readG3 = [
      { passage: passG3_1, stem: 'How old is Amy?', opts: ['Eight years old', 'Seven years old', 'Nine years old', 'Ten years old'], ans: 0, exp: '“I am eight years old.”' },
      { passage: passG3_1, stem: 'What is Amy\'s friend\'s name?', opts: ['Mike', 'Tom', 'John', 'Jack'], ans: 0, exp: '“His name is Mike.”' },
      { passage: passG3_1, stem: 'What does Amy\'s mouth look like?', opts: ['Small', 'Big', 'Long', 'Round'], ans: 0, exp: '“I have a small mouth.”' },
      { passage: passG3_1, stem: 'What do Amy and Mike share at school?', opts: ['Books and crayons', 'Apples and bread', 'Bikes', 'Toys only'], ans: 0, exp: '“We share our books and crayons.”' },
      { passage: passG3_1, stem: 'Amy and Mike play games together on the playground.', isTrue: true, exp: '“We play games together on the playground.”' },
      { passage: passG3_2, stem: 'What day is it today in the second story?', opts: ['Monday', 'Friday', 'Sunday', 'Saturday'], ans: 0, exp: '“Today is Monday.”' },
      { passage: passG3_2, stem: 'What does Tom do when he says "Hello!"?', opts: ['Waves his hand', 'Closes his eyes', 'Runs away', 'Reads a book'], ans: 0, exp: '“He says, \'Hello!\' and waves his hand.”' },
      { passage: passG3_2, stem: 'How do students listen in class?', opts: ['With their ears', 'With their hands', 'With their feet', 'With pencils'], ans: 0, exp: '“we listen carefully with our ears.”' },
      { passage: passG3_2, stem: 'What does the writer do when Tom needs a pencil?', opts: ['Helps him', 'Takes his eraser', 'Laughs at him', 'Says goodbye'], ans: 0, exp: '“When Tom needs a pencil, I help him.”' },
      { passage: passG3_2, stem: 'In the story, a good friend is compared to warm sunshine.', isTrue: true, exp: '“A good friend is like a warm sunshine.”' },
    ];
    readG3.forEach((item, idx) => {
      const num = 41 + idx;
      if ('isTrue' in item) {
        q.push(makeJudge(`g3-e-${num}`, num, '四、短文阅读理解 (41-50题)', item.stem, item.isTrue, item.exp));
      } else {
        q.push(makeChoice(`g3-e-${num}`, num, '四、短文阅读理解 (41-50题)', item.stem, item.opts!, item.ans!, item.exp, item.passage, 'reading'));
      }
    });

  } else if (grade === '4') {
    // ==========================================
    // 四年级上册 Unit 1: My Classroom (PEP版)
    // ==========================================
    unitName = 'Unit 1: My Classroom';
    paperTitle = '四年级英语上册 · Unit 1《My Classroom》满分冲刺卷';
    paperSubtitle = '人教PEP版 · a-e相对开音节发音、教室设施与方位介词、情景交际与短文精读';

    const phonicsG4 = [
      { stem: '选出字母 a-e 在单词 "cake" 中的发音：', opts: ['/eɪ/', '/æ/', '/ɑː/', '/e/'], ans: 0, exp: 'a-e 处于相对开音节中发字母本身音 /eɪ/。' },
      { stem: '选出画线部分发音不同的一项：', opts: ['cat (/æ/)', 'cake (/eɪ/)', 'face (/eɪ/)', 'name (/eɪ/)'], ans: 0, exp: 'cat 中 a 发 /æ/，其余均为 a-e 开音节发 /eɪ/。' },
      { stem: '选出画线部分发音相同的一组：', opts: ['make, face', 'map, take', 'hat, hate', 'bag, lake'], ans: 0, exp: 'make 和 face 中 a-e 均发 /eɪ/。' },
      { stem: '单词 "name" 中末尾不发音的字母是：', opts: ['e', 'a', 'm', 'n'], ans: 0, exp: '相对开音节末尾的 e 通常不发音。' },
      { stem: '选出单词 "lake" 中字母 a 的发音：', opts: ['/eɪ/', '/æ/', '/ɔː/', '/ʌ/'], ans: 0, exp: 'lake 发 /leɪk/，a 发 /eɪ/。' },
      { stem: '选出画线字母读音为 /æ/ 的单词：', opts: ['blackboard', 'make', 'game', 'late'], ans: 0, exp: 'blackboard 中的 a 发短元音 /æ/。' },
      { stem: '单词 "classroom" 是由哪两个单词组合而成的复合词？', opts: ['class + room', 'close + room', 'clean + room', 'clap + room'], ans: 0, exp: 'class(班级) + room(房间) 组合而成。' },
      { stem: '选出单词 "light" 中不发音的字母组合：', opts: ['gh', 'li', 'ht', 'l'], ans: 0, exp: 'light 中 -igh- 发 /aɪ/，字母 gh 不发音。' },
      { stem: '下列单词中含有元音音素 /eɪ/ 的是：', opts: ['plate', 'desk', 'fan', 'bag'], ans: 0, exp: 'plate 中 a-e 发 /eɪ/。' },
      { stem: '英语陈述句句末通常使用的标点符号是：', opts: ['实心句点 (.)', '空心圆圈 (。)', '问号 (?)', '感叹号 (!)'], ans: 0, exp: '英文句点是实心小黑点 (.)。' },
    ];
    phonicsG4.forEach((item, idx) => {
      q.push(makeChoice(`g4-e-${idx + 1}`, idx + 1, '一、语音与自然拼读辨析 (1-10题)', item.stem, item.opts, item.ans, item.exp));
    });

    const vocabG4 = [
      { stem: '中文“窗户”对应的英文单词是：', opts: ['window', 'door', 'floor', 'wall'], ans: 0, exp: 'window 表示窗户。' },
      { stem: '中文“黑板”对应的英文单词是：', opts: ['blackboard', 'picture', 'light', 'desk'], ans: 0, exp: 'blackboard 表示黑板。' },
      { stem: '中文“电灯”对应的英文单词是：', opts: ['light', 'fan', 'door', 'floor'], ans: 0, exp: 'light 表示电灯。' },
      { stem: '中文“图画”对应的英文单词是：', opts: ['picture', 'pencil', 'computer', 'chair'], ans: 0, exp: 'picture 表示图画。' },
      { stem: '中文“讲台 / 老师的桌子”对应的英文短语是：', opts: ["teacher's desk", "student's desk", 'table', 'chair'], ans: 0, exp: "teacher's desk 表示讲台。" },
      { stem: '中文“计算机、电脑”对应的英文单词是：', opts: ['computer', 'fan', 'window', 'light'], ans: 0, exp: 'computer 表示电脑。' },
      { stem: '中文“风扇”对应的英文单词是：', opts: ['fan', 'fun', 'floor', 'fat'], ans: 0, exp: 'fan 表示风扇。' },
      { stem: '中文“墙壁”对应的英文单词是：', opts: ['wall', 'floor', 'door', 'window'], ans: 0, exp: 'wall 表示墙壁。' },
      { stem: '中文“地板”对应的英文单词是：', opts: ['floor', 'wall', 'door', 'desk'], ans: 0, exp: 'floor 表示地板。' },
      { stem: '“near the door”的中文意思是：', opts: ['在门旁边', '在窗户上', '在桌子底下', '在墙角'], ans: 0, exp: 'near the door 意为在门旁边。' },
      { stem: '“clean the blackboard”的中文意思是：', opts: ['擦黑板', '打扫教室', '开门', '关灯'], ans: 0, exp: 'clean the blackboard 意为擦黑板。' },
      { stem: '“turn on the light”的中文意思是：', opts: ['开灯', '关灯', '修电灯', '擦电灯'], ans: 0, exp: 'turn on 表示打开电器。' },
      { stem: '“open the door”的中文意思是：', opts: ['开门', '关门', '推门', '锁门'], ans: 0, exp: 'open the door 意为开门。' },
      { stem: '介词 "under" 表示“在……的正上方（悬空）”。', isTrue: false, exp: 'under 表示“在……下方”，在上方通常用 on 或 above。' },
      { stem: '单词 "desk" 和 "table" 都表示桌子，但 desk 通常指书桌、办公桌。', isTrue: true, exp: 'desk 特指带抽屉的书桌、课桌，table 泛指一般桌子如餐桌。' },
    ];
    vocabG4.forEach((item, idx) => {
      const num = 11 + idx;
      if ('isTrue' in item) {
        q.push(makeJudge(`g4-e-${num}`, num, '二、核心词汇与短语辨析 (11-25题)', item.stem, item.isTrue, item.exp));
      } else {
        q.push(makeChoice(`g4-e-${num}`, num, '二、核心词汇与短语辨析 (11-25题)', item.stem, item.opts, item.ans, item.exp));
      }
    });

    const grammarG4 = [
      { stem: '— (  ) is the picture? — It is on the wall.', opts: ['Where', 'What', 'Who', 'How'], ans: 0, exp: '询问位置用 Where。' },
      { stem: 'Let\'s (  ) the classroom together. — OK!', opts: ['clean', 'cleans', 'cleaning', 'cleaned'], ans: 0, exp: 'Let\'s 后面接动词原形 clean。' },
      { stem: '— What\'s in the classroom? — (  ) blackboard and many desks.', opts: ['One', 'Two', 'Three', 'Four'], ans: 0, exp: '通常教室前方有一块大黑板：One blackboard。' },
      { stem: 'The kite is (  ) the window.', opts: ['near', 'to', 'for', 'with'], ans: 0, exp: 'near the window 在窗户附近。' },
      { stem: 'There (  ) a teacher\'s desk in our classroom.', opts: ['is', 'are', 'be', 'am'], ans: 0, exp: '单数名词 a teacher\'s desk 搭配 is。' },
      { stem: 'There (  ) eight lights on the ceiling.', opts: ['are', 'is', 'be', 'am'], ans: 0, exp: '复数名词 eight lights 搭配 are。' },
      { stem: 'We (  ) a new classroom. It is big.', opts: ['have', 'has', 'is', 'are'], ans: 0, exp: '主语 We 搭配动词原形 have。' },
      { stem: '— Where is my schoolbag? — Look! It\'s (  ) the chair.', opts: ['under', 'of', 'at', 'to'], ans: 0, exp: 'under the chair 在椅子底下。' },
      { stem: 'Let me (  ) the windows.', opts: ['clean', 'cleans', 'cleaning', 'cleaned'], ans: 0, exp: 'Let me 接动词原形 clean。' },
      { stem: 'The computer is (  ) the teacher\'s desk.', opts: ['on', 'in', 'under', 'at'], ans: 0, exp: '电脑摆在讲台桌面上用 on。' },
      { stem: 'The wall is white and the floor (  ) green.', opts: ['is', 'are', 'am', 'be'], ans: 0, exp: 'the floor 是单数，搭配 is。' },
      { stem: '— Let\'s clean the teacher\'s desk. — (  )', opts: ['OK.', 'Goodbye.', 'Thank you.', 'You are welcome.'], ans: 0, exp: '响应建议表示赞同回答 OK。' },
      { stem: 'Look at the picture. It\'s (  ) beautiful.', opts: ['so', 'too', 'much', 'many'], ans: 0, exp: 'so beautiful 表示“如此美丽”。' },
      { stem: '“Where are the chairs?”与“Where is the chair?”的区别在于名词单复数。', isTrue: true, exp: '单数用 is the chair，复数用 are the chairs。' },
      { stem: '英文中的祈使句（如 Open the door!）通常以动词原形开头。', isTrue: true, exp: '祈使句省略主语 you，直接以动词原形开头。' },
    ];
    grammarG4.forEach((item, idx) => {
      const num = 26 + idx;
      if ('isTrue' in item) {
        q.push(makeJudge(`g4-e-${num}`, num, '三、句型结构与情景交际 (26-40题)', item.stem, item.isTrue, item.exp));
      } else {
        q.push(makeChoice(`g4-e-${num}`, num, '三、句型结构与情景交际 (26-40题)', item.stem, item.opts, item.ans, item.exp));
      }
    });

    const passG4_1 = `Hello! My name is Wu Binbin. Welcome to our new classroom in Grade 4. It is on the second floor. Our classroom is very big and bright. There are six big windows and eight lights. The walls are white and the floor is green. In the front, there is a large blackboard and a new computer on the teacher's desk. My friend Mike is tall and strong. He sits near the window. We clean our classroom every afternoon. We all love our happy classroom.`;
    const passG4_2 = `This is Mike's school. Today is "Clean the Classroom Day". Look! Zhang Peng says, "Let's clean the classroom!" Chen Jie cleans the windows. John sweeps the green floor. Amy cleans the teacher's desk. Mike is tall, so he cleans the blackboard. The teacher Miss White comes in and says, "Good job, boys and girls! Now our classroom is so clean and nice!"`;

    const readG4 = [
      { passage: passG4_1, stem: 'Where is Wu Binbin\'s classroom?', opts: ['On the second floor', 'On the first floor', 'On the third floor', 'On the fourth floor'], ans: 0, exp: '“It is on the second floor.”' },
      { passage: passG4_1, stem: 'How many windows are there in the classroom?', opts: ['Six', 'Eight', 'Four', 'Ten'], ans: 0, exp: '“There are six big windows and eight lights.”' },
      { passage: passG4_1, stem: 'What is Mike like?', opts: ['Tall and strong', 'Short and thin', 'Quiet and shy', 'Angry'], ans: 0, exp: '“My friend Mike is tall and strong.”' },
      { passage: passG4_1, stem: 'Where is the new computer?', opts: ['On the teacher\'s desk', 'On the floor', 'Under the chair', 'Near the door'], ans: 0, exp: '“a new computer on the teacher\'s desk.”' },
      { passage: passG4_1, stem: 'Wu Binbin and his classmates clean the classroom every afternoon.', isTrue: true, exp: '“We clean our classroom every afternoon.”' },
      { passage: passG4_2, stem: 'What day is it at Mike\'s school today?', opts: ['Clean the Classroom Day', 'Sports Day', 'Children\'s Day', 'Teachers\' Day'], ans: 0, exp: '“Today is \'Clean the Classroom Day\'.”' },
      { passage: passG4_2, stem: 'Who cleans the windows?', opts: ['Chen Jie', 'John', 'Amy', 'Mike'], ans: 0, exp: '“Chen Jie cleans the windows.”' },
      { passage: passG4_2, stem: 'What does John do in the classroom?', opts: ['Sweeps the floor', 'Cleans the board', 'Turns on the light', 'Eats lunch'], ans: 0, exp: '“John sweeps the green floor.”' },
      { passage: passG4_2, stem: 'Why does Mike clean the blackboard?', opts: ['Because he is tall', 'Because he is small', 'Because he is lazy', 'Because he likes writing'], ans: 0, exp: '“Mike is tall, so he cleans the blackboard.”' },
      { passage: passG4_2, stem: 'Miss White is happy because the classroom is clean and nice.', isTrue: true, exp: '“Good job, boys and girls! Now our classroom is so clean and nice!”' },
    ];
    readG4.forEach((item, idx) => {
      const num = 41 + idx;
      if ('isTrue' in item) {
        q.push(makeJudge(`g4-e-${num}`, num, '四、短文阅读理解 (41-50题)', item.stem, item.isTrue, item.exp));
      } else {
        q.push(makeChoice(`g4-e-${num}`, num, '四、短文阅读理解 (41-50题)', item.stem, item.opts!, item.ans!, item.exp, item.passage, 'reading'));
      }
    });

  } else if (grade === '5') {
    // ==========================================
    // 五年级上册 Unit 1: What's he like? (PEP版)
    // ==========================================
    unitName = "Unit 1: What's he like?";
    paperTitle = "五年级英语上册 · Unit 1《What's he like?》满分冲刺卷";
    paperSubtitle = "人教PEP版 · -y词尾发音规则、性格与外貌特征形容词、系表结构与短文精读";

    const phonicsG5 = [
      { stem: '选出字母 -y 在单词 "baby" 末尾的发音：', opts: ['/i/', '/aɪ/', '/j/', '/e/'], ans: 0, exp: '字母 -y 在双音节词末通常发短元音 /i/，如 baby, happy, sunny。' },
      { stem: '选出画线部分发音不同的一项：', opts: ['fly (/aɪ/)', 'happy (/i/)', 'windy (/i/)', 'sorry (/i/)'], ans: 0, exp: 'fly 是一音节词，y 发 /aɪ/；其余词末 y 均发 /i/。' },
      { stem: '选出画线部分发音相同的一组：', opts: ['sunny, funny', 'my, baby', 'shy, city', 'by, party'], ans: 0, exp: 'sunny 和 funny 末尾的 y 都发 /i/。' },
      { stem: '单词 "shy" 中字母 y 的发音是：', opts: ['/aɪ/', '/i/', '/j/', '/ɪ/'], ans: 0, exp: '单音节词 shy 中 y 发 /aɪ/。' },
      { stem: '单词 "family" 中末尾字母 y 的发音是：', opts: ['/i/', '/aɪ/', '/eɪ/', '/iː/'], ans: 0, exp: '多音节词末尾 y 发 /i/。' },
      { stem: '下列单词中含有元音音素 /i/ 的词是：', opts: ['polite', 'strict', 'kind', 'like'], ans: 1, exp: 'strict 中 i 发短元音 /ɪ/ (即 /i/)。' },
      { stem: '在单词 "polite" 中，i-e 发音为：', opts: ['/aɪ/', '/ɪ/', '/iː/', '/e/'], ans: 0, exp: 'polite 中 i-e 开音节发 /aɪ/。' },
      { stem: '单词 "helpful" 的后缀 "-ful" 通常表示：', opts: ['充满……的、有……特性的', '没有……的', '正在做的', '极小的'], ans: 0, exp: '后缀 -ful 构成形容词，表示“充满……的/乐于助人的”。' },
      { stem: '选出重音在第二个音节的单词：', opts: ['polite', 'funny', 'strict', 'clever'], ans: 0, exp: 'polite 重音在第二个音节 /pəˈlaɪt/。' },
      { stem: '英文字母 y 作为半元音，在词首（如 yellow）发辅音音素 /j/。', isTrue: true, exp: 'y 在词首发浊辅音 /j/。' },
    ];
    phonicsG5.forEach((item, idx) => {
      const num = idx + 1;
      if ('isTrue' in item) {
        q.push(makeJudge(`g5-e-${num}`, num, '一、语音与词尾规则辨析 (1-10题)', item.stem, item.isTrue, item.exp));
      } else {
        q.push(makeChoice(`g5-e-${num}`, num, '一、语音与词尾规则辨析 (1-10题)', item.stem, item.opts, item.ans, item.exp));
      }
    });

    const vocabG5 = [
      { stem: '中文“年老的”对应的英文单词是：', opts: ['old', 'young', 'kind', 'tall'], ans: 0, exp: 'old 表示年老的。' },
      { stem: '中文“年轻的”对应的英文单词是：', opts: ['young', 'old', 'short', 'funny'], ans: 0, exp: 'young 表示年轻的。' },
      { stem: '中文“滑稽好笑的”对应的英文单词是：', opts: ['funny', 'kind', 'strict', 'shy'], ans: 0, exp: 'funny 表示滑稽有趣的。' },
      { stem: '中文“体贴慈祥的、和蔼的”对应的英文单词是：', opts: ['kind', 'strict', 'hard-working', 'polite'], ans: 0, exp: 'kind 表示和蔼体贴的。' },
      { stem: '中文“严厉的、严格的”对应的英文单词是：', opts: ['strict', 'funny', 'polite', 'clever'], ans: 0, exp: 'strict 表示严格的。' },
      { stem: '中文“有礼貌的”对应的英文单词是：', opts: ['polite', 'helpful', 'clever', 'shy'], ans: 0, exp: 'polite 表示有礼貌的。' },
      { stem: '中文“辛勤努力的”对应的英文单词是：', opts: ['hard-working', 'helpful', 'clever', 'strict'], ans: 0, exp: 'hard-working 表示勤奋的。' },
      { stem: '中文“乐于助人的”对应的英文单词是：', opts: ['helpful', 'polite', 'shy', 'funny'], ans: 0, exp: 'helpful 表示乐于助人的。' },
      { stem: '中文“聪明的”对应的英文单词是：', opts: ['clever', 'shy', 'strict', 'kind'], ans: 0, exp: 'clever 表示聪明的。' },
      { stem: '中文“害羞的”对应的英文单词是：', opts: ['shy', 'funny', 'young', 'old'], ans: 0, exp: 'shy 表示害羞内向的。' },
      { stem: '“our new Chinese teacher”的中文意思是：', opts: ['我们的新语文老师', '我们的老数学老师', '我们的英语老师', '我们的校长'], ans: 0, exp: '意为我们的新语文老师。' },
      { stem: '“He is very friendly.”的中文意思是：', opts: ['他非常友好。', '他非常严厉。', '他很害羞。', '他很有礼貌。'], ans: 0, exp: 'friendly 意为友好的。' },
      { stem: '“know him”的意思是：', opts: ['认识他', '喜欢他', '帮助他', '倾听他'], ans: 0, exp: 'know 表示认识、了解。' },
      { stem: '形容词 "strict" 和 "kind" 是一对反义词。', isTrue: true, exp: 'strict (严格的) 与 kind (和蔼宽容的) 构成反义。' },
      { stem: '单词 "polite" 的反义词可以通过加前缀变成为 "impolite"。', isTrue: true, exp: '前缀 im- 表示否定，impolite 意为不礼貌的。' },
    ];
    vocabG5.forEach((item, idx) => {
      const num = 11 + idx;
      if ('isTrue' in item) {
        q.push(makeJudge(`g5-e-${num}`, num, '二、核心词汇与特征形容词 (11-25题)', item.stem, item.isTrue, item.exp));
      } else {
        q.push(makeChoice(`g5-e-${num}`, num, '二、核心词汇与特征形容词 (11-25题)', item.stem, item.opts, item.ans, item.exp));
      }
    });

    const grammarG5 = [
      { stem: '— (  ) is your new head teacher like? — He is tall and kind.', opts: ['What', 'How', 'Who', 'Where'], ans: 0, exp: 'What is ... like? 用于询问人的性格品质与外貌特征。' },
      { stem: '— (  ) is your art teacher? — Mr. Jones.', opts: ['Who', 'What', 'Where', 'How'], ans: 0, exp: '询问某科老师是谁用疑问代词 Who。' },
      { stem: '— Is she strict? — (  )', opts: ['Yes, she is.', 'Yes, she does.', 'No, she is.', 'Yes, she can.'], ans: 0, exp: '以 Is she...? 提问，肯定回答是 Yes, she is.。' },
      { stem: '— Do you know Mr. Young? — (  )', opts: ['No, I don\'t.', 'No, I am not.', 'Yes, I am.', 'No, I can\'t.'], ans: 0, exp: '以 Do you...? 提问，否定回答是 No, I don\'t.。' },
      { stem: 'He is very clever and he (  ) hard-working.', opts: ['is', 'are', 'am', 'be'], ans: 0, exp: '主语 he 搭配 be 动词 is。' },
      { stem: 'She (  ) long black hair and two big eyes.', opts: ['has', 'have', 'is', 'are'], ans: 0, exp: '第三人称单数 she 表示具有特征用 has。' },
      { stem: 'My grandfather is old, (  ) he is very healthy.', opts: ['but', 'and', 'so', 'or'], ans: 0, exp: '转折关系用 but。' },
      { stem: 'Oliver is a helpful student. He often (  ) others.', opts: ['helps', 'help', 'helping', 'helped'], ans: 0, exp: '主语 Oliver 为单三，动词用 helps。' },
      { stem: '— What does she look like? — She is (  ).', opts: ['tall and thin', 'clever', 'helpful', 'polite'], ans: 0, exp: 'look like 询问外貌，tall and thin 描述身材。' },
      { stem: 'Miss White will be our (  ) music teacher.', opts: ['new', 'news', 'newly', 'newer'], ans: 0, exp: 'our new music teacher 我们的新音乐老师。' },
      { stem: 'They (  ) very polite at school.', opts: ['are', 'is', 'am', 'be'], ans: 0, exp: '复数主语 They 搭配 are。' },
      { stem: 'Ms. Wang makes us finish homework on time. She is (  ).', opts: ['strict', 'funny', 'lazy', 'shy'], ans: 0, exp: '要求严格按时交作业说明老师很 strict。' },
      { stem: '— Who is that young lady? — She is (  ) aunt.', opts: ['my', 'me', 'mine', 'I'], ans: 0, exp: '修饰名词 aunt 用形容词性物主代词 my。' },
      { stem: '“What is he like?”和“What does he like?”的含义完全不同。', isTrue: true, exp: '前者询问人性格品德特征，后者询问他喜欢什么爱好。' },
      { stem: '在英文中，“Mr.”用于称呼男士，“Miss”用于称呼未婚女性。', isTrue: true, exp: '称谓规范考点。' },
    ];
    grammarG5.forEach((item, idx) => {
      const num = 26 + idx;
      if ('isTrue' in item) {
        q.push(makeJudge(`g5-e-${num}`, num, '三、句型结构与情景交际 (26-40题)', item.stem, item.isTrue, item.exp));
      } else {
        q.push(makeChoice(`g5-e-${num}`, num, '三、句型结构与情景交际 (26-40题)', item.stem, item.opts, item.ans, item.exp));
      }
    });

    const passG5_1 = `We have three new teachers this term. Mr. Carter is our new math teacher. He is tall and strong. He is young. Is he strict? Yes, he is. But he is very funny, too. We all like his math classes. Miss Green is our English teacher. She has long curly hair. She is very kind and patient. She always speaks English with a warm smile. Oliver is our new PE teacher. He is fast and helpful. Our teachers are wonderful.`;
    const passG5_2 = `Meet my best classmate, Sarah. Sarah is a clever and hard-working girl in Grade 5. She gets up at 6:30 every morning and reads English aloud. At school, she is very polite. She always says "Good morning!" to teachers and "Thank you!" to classmates. When someone has trouble with homework, Sarah is always helpful. Her dream is to be a doctor when she grows up. Everyone in our class likes her very much.`;

    const readG5 = [
      { passage: passG5_1, stem: 'How many new teachers do the students have this term?', opts: ['Three', 'Two', 'Four', 'Five'], ans: 0, exp: '“We have three new teachers this term.”' },
      { passage: passG5_1, stem: 'What is Mr. Carter like?', opts: ['Tall, strong, young and funny', 'Old and slow', 'Shy and quiet', 'Short and fat'], ans: 0, exp: '“He is tall and strong. He is young... very funny, too.”' },
      { passage: passG5_1, stem: 'Who is the English teacher?', opts: ['Miss Green', 'Mr. Carter', 'Oliver', 'Miss White'], ans: 0, exp: '“Miss Green is our English teacher.”' },
      { passage: passG5_1, stem: 'What does Miss Green look like?', opts: ['She has long curly hair.', 'She has short black hair.', 'She is very old.', 'She wears glasses.'], ans: 0, exp: '“She has long curly hair.”' },
      { passage: passG5_1, stem: 'The students love Mr. Carter\'s math classes.', isTrue: true, exp: '“We all like his math classes.”' },
      { passage: passG5_2, stem: 'What grade is Sarah in?', opts: ['Grade 5', 'Grade 4', 'Grade 3', 'Grade 6'], ans: 0, exp: '“in Grade 5.”' },
      { passage: passG5_2, stem: 'What time does Sarah get up every morning?', opts: ['At 6:30', 'At 7:00', 'At 6:00', 'At 7:30'], ans: 0, exp: '“She gets up at 6:30 every morning.”' },
      { passage: passG5_2, stem: 'Why is Sarah considered polite?', opts: ['She greets teachers and says thank you to classmates', 'She never talks', 'She only reads books', 'She sleeps early'], ans: 0, exp: '“She always says \'Good morning!\' to teachers and \'Thank you!\' to classmates.”' },
      { passage: passG5_2, stem: 'What is Sarah\'s dream for the future?', opts: ['To be a doctor', 'To be a teacher', 'To be a singer', 'To be a pilot'], ans: 0, exp: '“Her dream is to be a doctor when she grows up.”' },
      { passage: passG5_2, stem: 'Sarah is helpful when classmates have trouble with homework.', isTrue: true, exp: '“When someone has trouble with homework, Sarah is always helpful.”' },
    ];
    readG5.forEach((item, idx) => {
      const num = 41 + idx;
      if ('isTrue' in item) {
        q.push(makeJudge(`g5-e-${num}`, num, '四、短文阅读理解 (41-50题)', item.stem, item.isTrue, item.exp));
      } else {
        q.push(makeChoice(`g5-e-${num}`, num, '四、短文阅读理解 (41-50题)', item.stem, item.opts!, item.ans!, item.exp, item.passage, 'reading'));
      }
    });

  } else {
    // ==========================================
    // 六年级上册 Unit 1: How can I get there? (PEP版)
    // ==========================================
    unitName = 'Unit 1: How can I get there?';
    paperTitle = '六年级英语上册 · Unit 1《How can I get there?》满分冲刺卷';
    paperSubtitle = '人教PEP版 · 语调与连读、城市地标与问路指路、情景交际与短文深度阅读';

    const phonicsG6 = [
      { stem: '一般疑问句（如 "Is there a cinema near here?"）句末的语调通常读：', opts: ['升调 (↗)', '降调 (↘)', '平调', '重读'], ans: 0, exp: '英语一般疑问句句尾通常读升调。' },
      { stem: '特殊疑问句（如 "Where is the post office?"）句末的语调通常读：', opts: ['降调 (↘)', '升调 (↗)', '平调', '停顿'], ans: 0, exp: '特殊疑问句句尾通常读降调。' },
      { stem: '选出下列词组中存在“辅音 + 元音”连读现象的一项：', opts: ['turn off', 'post office', 'science museum', 'bus stop'], ans: 0, exp: 'turn(/n/) + off(/ɒf/) 发生辅音与元音连读 /tɜːnɒf/。' },
      { stem: '选出画线字母组合发音为 /aʊ/ 的单词：', opts: ['down', 'slow', 'know', 'window'], ans: 0, exp: 'down 中 ow 发 /aʊ/，其余三个单词 ow 发 /əʊ/。' },
      { stem: '单词 "museum" 的重音落在第几个音节？', opts: ['第二个音节 /mjuːˈziːəm/', '第一个音节', '第三个音节', '末尾'], ans: 0, exp: 'museum 重音在第二个音节。' },
      { stem: '选出单词 "cinema" 中字母 c 的发音：', opts: ['/s/', '/k/', '/tʃ/', '/ʃ/'], ans: 0, exp: 'cinema 中 c 在 i 前发清辅音 /s/。' },
      { stem: '选出下列单词中画线字母发短元音 /ɒ/ (或 /ɑː/) 的单词：', opts: ['hospital', 'post', 'go', 'home'], ans: 0, exp: 'hospital 首音节 o 发短元音 /ɒ/。' },
      { stem: '在祈使句 "Turn left at the bookstore." 中，重音通常落在：', opts: ['实词 left 和 bookstore 上', '介词 at 上', '冠词 the 上', '全都不重读'], ans: 0, exp: '英语节奏中实词（动词、副词、名词）通常重读。' },
      { stem: '单词 "straight" 中字母组合 "aigh" 发音为：', opts: ['/eɪ/', '/aɪ/', '/ɔː/', '/æ/'], ans: 0, exp: 'straight 发 /streɪt/，aigh 发 /eɪ/。' },
      { stem: '在英文朗读中，逗号处通常需要短暂的停顿。', isTrue: true, exp: '停顿规则考点。' },
    ];
    phonicsG6.forEach((item, idx) => {
      const num = idx + 1;
      if ('isTrue' in item) {
        q.push(makeJudge(`g6-e-${num}`, num, '一、语音语调与连读辨析 (1-10题)', item.stem, item.isTrue, item.exp));
      } else {
        q.push(makeChoice(`g6-e-${num}`, num, '一、语音语调与连读辨析 (1-10题)', item.stem, item.opts, item.ans, item.exp));
      }
    });

    const vocabG6 = [
      { stem: '中文“科学博物馆”对应的英文短语是：', opts: ['science museum', 'post office', 'bookstore', 'cinema'], ans: 0, exp: 'science museum 表示科学博物馆。' },
      { stem: '中文“邮局”对应的英文短语是：', opts: ['post office', 'police office', 'doctor office', 'fire station'], ans: 0, exp: 'post office 表示邮局。' },
      { stem: '中文“书店”对应的英文单词是：', opts: ['bookstore', 'library', 'school', 'hospital'], ans: 0, exp: 'bookstore 表示书店。' },
      { stem: '中文“电影院”对应的英文单词是：', opts: ['cinema', 'theatre', 'park', 'zoo'], ans: 0, exp: 'cinema 表示电影院。' },
      { stem: '中文“医院”对应的英文单词是：', opts: ['hospital', 'hotel', 'bank', 'restaurant'], ans: 0, exp: 'hospital 表示医院。' },
      { stem: '中文“十字路口”对应的英文单词是：', opts: ['crossing', 'cross', 'street', 'road'], ans: 0, exp: 'crossing 表示十字路口。' },
      { stem: '“turn left”的中文意思是：', opts: ['左转', '右转', '直行', '调头'], ans: 0, exp: 'turn left 意为向左转。' },
      { stem: '“turn right”的中文意思是：', opts: ['右转', '左转', '停止', '直行'], ans: 0, exp: 'turn right 意为向右转。' },
      { stem: '“go straight”的中文意思是：', opts: ['直行 / 笔直走', '后退', '左转', '右转'], ans: 0, exp: 'go straight 意为笔直向前走。' },
      { stem: '“next to”的中文意思是：', opts: ['紧挨着、在旁边', '在对面', '在后面', '在里面'], ans: 0, exp: 'next to 表示在……旁边。' },
      { stem: '“in front of”的中文意思是：', opts: ['在……前面', '在……后面', '在……中间', '在……上方'], ans: 0, exp: 'in front of 表示在……前面。' },
      { stem: '“behind”的中文意思是：', opts: ['在……后面', '在……前面', '在……上方', '在……左边'], ans: 0, exp: 'behind 表示在……后面。' },
      { stem: '“buy a postcard”的意思是：', opts: ['买一张明信片', '寄一封信', '买一本书', '看电影'], ans: 0, exp: 'postcard 意为明信片。' },
      { stem: '短语 "on the left" 和 "on the right" 都是表示方位的介词短语。', isTrue: true, exp: '分别表示在左侧、在右侧。' },
      { stem: '单词 "crossing" 是由动词 "cross" 加后缀 "-ing" 构成的名词。', isTrue: true, exp: '词缀派生规则。' },
    ];
    vocabG6.forEach((item, idx) => {
      const num = 11 + idx;
      if ('isTrue' in item) {
        q.push(makeJudge(`g6-e-${num}`, num, '二、核心词汇与地点方位辨析 (11-25题)', item.stem, item.isTrue, item.exp));
      } else {
        q.push(makeChoice(`g6-e-${num}`, num, '二、核心词汇与地点方位辨析 (11-25题)', item.stem, item.opts, item.ans, item.exp));
      }
    });

    const grammarG6 = [
      { stem: '— (  ) can I get to the science museum? — Turn left at the bookstore.', opts: ['How', 'Where', 'What', 'Why'], ans: 0, exp: '询问如何到达某地用“How can I get to...?”。' },
      { stem: 'The post office is (  ) to the cinema.', opts: ['next', 'near', 'beside', 'front'], ans: 0, exp: '紧挨着是固定短语 next to。' },
      { stem: '— Where is the Italian restaurant? — It is (  ) Dongfang Street.', opts: ['on', 'in', 'at', 'to'], ans: 0, exp: '在某条街上用介词 on。' },
      { stem: '— Is there a hospital near here? — (  )', opts: ['Yes, there is.', 'Yes, it is.', 'No, there aren\'t.', 'Yes, there are.'], ans: 0, exp: '以 Is there...? 提问，肯定回答是 Yes, there is.。' },
      { stem: 'Go straight for two minutes, and you can see the cinema (  ) your right.', opts: ['on', 'in', 'at', 'with'], ans: 0, exp: '在你的右侧是 on your right。' },
      { stem: '— Excuse me, where is the library? — (  )', opts: ['It\'s behind the park.', 'I like books.', 'Yes, please.', 'You\'re welcome.'], ans: 0, exp: '礼貌问路，回答具体地理方位。' },
      { stem: 'Turn right (  ) the first crossing.', opts: ['at', 'on', 'in', 'for'], ans: 0, exp: '在具体路口用介词 at the crossing。' },
      { stem: 'Robin has GPS. It (  ) help them find the way.', opts: ['can', 'is', 'are', 'do'], ans: 0, exp: '情态动词 can 表能力。' },
      { stem: 'What an interesting film! Let\'s go to the (  ).', opts: ['cinema', 'hospital', 'post office', 'bank'], ans: 0, exp: '看电影去 cinema。' },
      { stem: 'I want to send a letter to Beijing. Where should I go? — To the (  ).', opts: ['post office', 'bookstore', 'cinema', 'zoo'], ans: 0, exp: '寄信去 post office。' },
      { stem: 'There (  ) two bookstores and a supermarket near my home.', opts: ['are', 'is', 'be', 'am'], ans: 0, exp: 'there be 就近原则，two bookstores 为复数用 are。' },
      { stem: 'There (  ) a science museum and three parks in the city.', opts: ['is', 'are', 'be', 'am'], ans: 0, exp: 'there be 就近原则，a science museum 为单数用 is。' },
      { stem: '— Thank you very much! — (  )', opts: ['You are welcome.', 'No thanks.', 'That\'s bad.', 'Goodbye.'], ans: 0, exp: '回应感谢标准回答 You are welcome。' },
      { stem: '“How can I get to the park?”可以与“Where is the park?”互相替换问路。', isTrue: true, exp: '两者都是问路的高频核心句型。' },
      { stem: '向陌生人问路时，开头第一句通常礼貌地说“Excuse me”。', isTrue: true, exp: '交际礼貌常识。' },
    ];
    grammarG6.forEach((item, idx) => {
      const num = 26 + idx;
      if ('isTrue' in item) {
        q.push(makeJudge(`g6-e-${num}`, num, '三、句型结构与情景交际 (26-40题)', item.stem, item.isTrue, item.exp));
      } else {
        q.push(makeChoice(`g6-e-${num}`, num, '三、句型结构与情景交际 (26-40题)', item.stem, item.opts, item.ans, item.exp));
      }
    });

    const passG6_1 = `Today is Saturday. Wu Binbin and Robin are going to visit the new science museum. Wu Binbin asks, "Robin, where is the science museum?" Robin looks at his GPS and says, "It is near the post office on Green Street." Wu Binbin asks, "How can we get there?" Robin says, "First, go straight from the school. Next, turn left at the bookstore. Then, go straight for five minutes. The museum is on your right." Wu Binbin says, "Great! Let's go!"`;
    const passG6_2 = `London is an ancient and modern city. Thousands of tourists come here every year. If you get lost in London, don't worry! You can ask a friendly police officer, or look at the street maps at bus stops. The famous British Museum is next to Russell Square. You can take the red double-decker bus or the underground tube. Remember: in the UK, people and cars always keep to the left!`;

    const readG6 = [
      { passage: passG6_1, stem: 'Where are Wu Binbin and Robin going this Saturday?', opts: ['To the new science museum', 'To the cinema', 'To the supermarket', 'To the hospital'], ans: 0, exp: '“going to visit the new science museum.”' },
      { passage: passG6_1, stem: 'Where is the science museum located?', opts: ['Near the post office on Green Street', 'Behind the school', 'In front of the cinema', 'Under the bridge'], ans: 0, exp: '“It is near the post office on Green Street.”' },
      { passage: passG6_1, stem: 'What does Robin use to find the way?', opts: ['His GPS', 'A paper book', 'Asking people', 'A compass'], ans: 0, exp: '“Robin looks at his GPS.”' },
      { passage: passG6_1, stem: 'Where should they turn left according to Robin?', opts: ['At the bookstore', 'At the crossing', 'At the cinema', 'At the hospital'], ans: 0, exp: '“turn left at the bookstore.”' },
      { passage: passG6_1, stem: 'The science museum is on their right side.', isTrue: true, exp: '“The museum is on your right.”' },
      { passage: passG6_2, stem: 'What can tourists do if they get lost in London?', opts: ['Ask a friendly police officer or check bus stop maps', 'Cry loudly', 'Stay in the hotel', 'Call the hospital'], ans: 0, exp: '“ask a friendly police officer, or look at the street maps at bus stops.”' },
      { passage: passG6_2, stem: 'Where is the British Museum in London?', opts: ['Next to Russell Square', 'Behind the airport', 'On the sea', 'Under the road'], ans: 0, exp: '“The famous British Museum is next to Russell Square.”' },
      { passage: passG6_2, stem: 'What color are the famous double-decker buses in London?', opts: ['Red', 'Yellow', 'Blue', 'Green'], ans: 0, exp: '“the red double-decker bus.”' },
      { passage: passG6_2, stem: 'On which side do people and cars drive and walk in the UK?', opts: ['Keep to the left', 'Keep to the right', 'In the middle', 'Any side'], ans: 0, exp: '“in the UK, people and cars always keep to the left!”' },
      { passage: passG6_2, stem: 'London has an underground train system called the tube.', isTrue: true, exp: '“or the underground tube.”' },
    ];
    readG6.forEach((item, idx) => {
      const num = 41 + idx;
      if ('isTrue' in item) {
        q.push(makeJudge(`g6-e-${num}`, num, '四、短文阅读理解 (41-50题)', item.stem, item.isTrue, item.exp));
      } else {
        q.push(makeChoice(`g6-e-${num}`, num, '四、短文阅读理解 (41-50题)', item.stem, item.opts!, item.ans!, item.exp, item.passage, 'reading'));
      }
    });
  }

  const extMap: Record<GradeLevel, ExamQuestion[]> = {
    '3': [
      makeExtension(
        'g3-e-ext-1',
        51,
        '【思维冲顶 1·自然拼读首字母归纳】下列四个单词中，首字母按英文字母表先后顺序排列完全正确的一组是：',
        ['arm, bag, cat, duck', 'bag, arm, cat, duck', 'duck, cat, bag, arm', 'arm, cat, bag, duck'],
        0,
        '【名师解析】首字母分别为 a, b, c, d，严格符合英文字母表 A-B-C-D 先后顺序。'
      ),
      makeExtension(
        'g3-e-ext-2',
        52,
        '【思维冲顶 2·社交文化情景交际】在西方英语国家，当有新同学来到班级时，大家通常用温暖友好的话语让他感到宾至如归。下列哪一句话最得体？',
        ['Welcome to our class! We can help you.', 'Who are you? Go away.', 'Look at my new shoes.', 'I am sleeping.'],
        0,
        '【名师解析】“Welcome to our class! We can help you.”热情友善，体现团队互助与关爱新同学的优秀品质。'
      ),
    ],
    '4': [
      makeExtension(
        'g4-e-ext-1',
        51,
        '【思维冲顶 1·空间方位逻辑推理】In a classroom, the teacher\'s desk is in the front. The blackboard is behind the teacher\'s desk. Tom\'s desk is near the window. Amy sits between Tom and John. Who is on Amy\'s left or right?',
        ['Tom and John', 'Only the teacher', 'The blackboard', 'Nobody'],
        0,
        '【名师解析】“between Tom and John”意为在 Tom 和 John 之间，说明 Amy 两侧分别是 Tom 和 John。'
      ),
      makeExtension(
        'g4-e-ext-2',
        52,
        '【思维冲顶 2·祈使句与公共礼仪】In the school library, which sign (标语) should we follow to keep the room quiet?',
        ['Please keep quiet and don\'t shout!', 'Run fast in the room!', 'Turn on the loud music!', 'Eat delicious hamburgers here!'],
        0,
        '【名师解析】图书馆需要保持安静，不可喧哗，故应遵守“Please keep quiet and don\'t shout!”。'
      ),
    ],
    '5': [
      makeExtension(
        'g5-e-ext-1',
        51,
        '【思维冲顶 1·阅读逻辑特征推理】Mr. Miller is a middle school teacher. He always helps students with their questions patiently, but if someone forgets to do homework, he will be very serious and ask them to finish it immediately. What is Mr. Miller like?',
        ['He is helpful and strict.', 'He is lazy and impolite.', 'He is shy and quiet.', 'He is afraid of students.'],
        0,
        '【名师解析】耐心地解答问题说明他很 helpful/kind，对作业认真不妥协说明他很 strict。'
      ),
      makeExtension(
        'g5-e-ext-2',
        52,
        '【思维冲顶 2·反义词与词根拓展】The antonym (反义词) of "helpful" is "helpless", and the antonym of "polite" is "impolite". What is the antonym of "active" (活跃的)?',
        ['quiet / inactive', 'strict', 'funny', 'clever'],
        0,
        '【名师解析】active 表示活跃活跃的，其反义词是 quiet（安静的）或通过否定前缀构成的 inactive（不活跃的）。'
      ),
    ],
    '6': [
      makeExtension(
        'g6-e-ext-1',
        51,
        '【思维冲顶 1·地图路径逆向推理】You are at the science museum now. You arrived here by turning left at the bank from Dongfang Road. If you want to return to Dongfang Road from the museum, what should you do at the bank?',
        ['Turn right', 'Turn left', 'Go straight', 'Jump over the wall'],
        0,
        '【名师解析】逆向路径推理：来时在银行处左转（Turn left），返回时在原路口对应方向应相反，即向右转（Turn right）。'
      ),
      makeExtension(
        'g6-e-ext-2',
        52,
        '【思维冲顶 2·跨文化交际与交通法规】When traveling in London or Hong Kong, what is the most important traffic rule pedestrians (行人) and drivers should keep in mind?',
        ['Keep to the left (靠左行驶和行走)', 'Keep to the right', 'Cars don\'t need to stop at red lights', 'Walk on the highway'],
        0,
        '【名师解析】英联邦地区及香港地区交通规则为车辆靠左行驶（Keep to the left），过马路须先看右后看左。'
      ),
    ],
  };

  const ext = extMap[grade] || extMap['4'];

  return {
    id: `exam-${grade}-english`,
    grade,
    gradeLabel,
    subject: 'english',
    subjectLabel: '英语',
    title: paperTitle,
    subtitle: paperSubtitle,
    unitName,
    totalScore: 100,
    questionsCount: 50,
    extensionCount: 2,
    sections: [
      { title: '一、语音与自然拼读辨析', startNum: 1, endNum: 10, description: '字母认读、自然拼读规则、元音辅音音素与语调连读' },
      { title: '二、核心词汇与短语辨析', startNum: 11, endNum: 25, description: '单元核心单词识记、短语释义及词类辨析' },
      { title: '三、句型结构与情景交际', startNum: 26, endNum: 40, description: '核心功能句型、语法规则与日常真实生活情景对话' },
      { title: '四、短文阅读理解', startNum: 41, endNum: 50, description: '原汁原味双篇英文短文精读、细节理解与推理判断' },
    ],
    questions: q,
    extensionQuestions: ext,
  };
}
