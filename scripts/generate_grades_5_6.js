import fs from 'fs';

function item(id, word, phonetic, phonics, pinyin, translation, partOfSpeech, grade, semester, unitNum, unitName, category, categoryLabel, imageUrl, def, sent, sentCn) {
  return {
    id,
    word: word.toUpperCase(),
    phonetic,
    phonics,
    pinyin,
    translation,
    partOfSpeech,
    grade,
    semester,
    semesterKey: grade + semester,
    unitId: `${grade}${semester}-U${unitNum}`,
    unitName,
    category,
    categoryLabel,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80',
    englishDefinition: def,
    exampleSentence: sent,
    exampleTranslation: sentCn,
  };
}

// ==========================================
// GRADE 5 (2024新课标PEP版)
// ==========================================
const grade5 = [
  // 5A Unit 1: What's he like?
  item('5a-u1-old', 'old', '/əʊld/', 'o-l-d', 'nián lǎo de', '年老的', 'adj.', '5', 'A', 1, "Unit 1 What's he like?", 'people', '性格外貌', 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=600&auto=format&fit=crop&q=80', 'Having lived for a long time.', 'Our maths teacher is wise and old.', '我们的数学老师年长且充满智慧。'),
  item('5a-u1-young', 'young', '/jʌŋ/', 'y-ou-ng', 'nián qīng de', '年轻的', 'adj.', '5', 'A', 1, "Unit 1 What's he like?", 'people', '性格外貌', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', 'Having lived or existed for only a short time.', 'Miss White is our young music teacher.', '怀特老师是我们年轻的音乐老师。'),
  item('5a-u1-funny', 'funny', '/ˈfʌni/', 'fun-ny', 'huá ji de ; yǒu qù de', '滑稽的；有趣的', 'adj.', '5', 'A', 1, "Unit 1 What's he like?", 'people', '性格外貌', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80', 'Causing laughter or amusement; humorous.', 'Mr. Jones makes his classes very funny.', '琼斯先生让他的课堂生动有趣。'),
  item('5a-u1-kind', 'kind', '/kaɪnd/', 'k-i-nd', 'tǐ tiē de ; cí xiáng de', '体贴的；慈祥的', 'adj.', '5', 'A', 1, "Unit 1 What's he like?", 'people', '性格外貌', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80', 'Having or showing a friendly, generous, and considerate nature.', 'She has a kind heart and helps everyone.', '她有一颗仁慈的心，总是帮助大家。'),
  item('5a-u1-strict', 'strict', '/strɪkt/', 'str-i-ct', 'yán gé de', '严格的', 'adj.', '5', 'A', 1, "Unit 1 What's he like?", 'people', '性格外貌', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80', 'Demanding that rules concerning behavior are obeyed.', 'Our PE teacher is strict but helpful.', '我们的体育老师很严格但很负责。'),
  item('5a-u1-polite', 'polite', '/pəˈlaɪt/', 'po-li-te', 'yǒu lǐ mào de', '有礼貌的', 'adj.', '5', 'A', 1, "Unit 1 What's he like?", 'people', '性格外貌', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80', 'Having or showing behaviour that is respectful and considerate of others.', 'Always be polite to teachers and friends.', '对老师和朋友们始终要有礼貌。'),
  item('5a-u1-hard-working', 'hard-working', '/ˌhɑːd ˈwɜːkɪŋ/', 'hard-work-ing', 'qín fèn de ; nǔ lì de', '勤奋的；努力的', 'adj.', '5', 'A', 1, "Unit 1 What's he like?", 'people', '性格外貌', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80', 'Working with energy and commitment; diligent.', 'He is a hard-working student who gets top marks.', '他是一个勤奋刻苦、成绩优异的学生。'),
  item('5a-u1-helpful', 'helpful', '/ˈhelpfl/', 'help-ful', 'yǒu bāng zhù de ; rè xīn de', '有帮助的；热心的', 'adj.', '5', 'A', 1, "Unit 1 What's he like?", 'people', '性格外貌', 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&auto=format&fit=crop&q=80', 'Giving or ready to give help.', 'Chen Jie is helpful at home and school.', '陈洁在家里和学校都很乐于助人。'),
  item('5a-u1-clever', 'clever', '/ˈklevə(r)/', 'clev-er', 'cōng ming de', '聪明的', 'adj.', '5', 'A', 1, "Unit 1 What's he like?", 'people', '性格外貌', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80', 'Quick to understand, learn, and devise ideas.', 'The clever robot can answer questions.', '这个聪明的机器人能够回答问题。'),
  item('5a-u1-shy', 'shy', '/ʃaɪ/', 'sh-y', 'xiū sè de ; hài xiū de', '羞涩的；害羞的', 'adj.', '5', 'A', 1, "Unit 1 What's he like?", 'people', '性格外貌', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80', 'Being reserved or having or showing nervousness.', 'She was shy at first, but now has many friends.', '她起初很害羞，但现在有很多朋友。'),

  // 5A Unit 2: My Week
  item('5a-u2-monday', 'Monday', '/ˈmʌndeɪ/', 'Mon-day', 'xīng qī yī', '星期一', 'n.', '5', 'A', 2, 'Unit 2 My week', 'time', '星期周期', 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80', 'The day of the week before Tuesday and following Sunday.', 'We have Chinese and maths on Monday.', '我们在星期一有语文课和数学课。'),
  item('5a-u2-tuesday', 'Tuesday', '/ˈtjuːzdeɪ/', 'Tues-day', 'xīng qī èr', '星期二', 'n.', '5', 'A', 2, 'Unit 2 My week', 'time', '星期周期', 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80', 'The day of the week before Wednesday and following Monday.', 'Tuesday afternoon is for art club.', '星期二下午是美术社团活动时间。'),
  item('5a-u2-wednesday', 'Wednesday', '/ˈwenzdeɪ/', 'Wed-nes-day', 'xīng qī sān', '星期三', 'n.', '5', 'A', 2, 'Unit 2 My week', 'time', '星期周期', 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80', 'The day of the week before Thursday and following Tuesday.', 'We play sports on Wednesday.', '我们在星期三参加体育运动。'),
  item('5a-u2-thursday', 'Thursday', '/ˈθɜːzdeɪ/', 'Thurs-day', 'xīng qī sì', '星期四', 'n.', '5', 'A', 2, 'Unit 2 My week', 'time', '星期周期', 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80', 'The day of the week before Friday and following Wednesday.', 'I have English class on Thursday.', '我在星期四有英语课。'),
  item('5a-u2-friday', 'Friday', '/ˈfraɪdeɪ/', 'Fri-day', 'xīng qī wǔ', '星期五', 'n.', '5', 'A', 2, 'Unit 2 My week', 'time', '星期周期', 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80', 'The day of the week before Saturday and following Thursday.', 'Friday is my favourite school day.', '星期五是我在学校最喜欢的一天。'),
  item('5a-u2-saturday', 'Saturday', '/ˈsætədeɪ/', 'Sat-ur-day', 'xīng qī liù', '星期六', 'n.', '5', 'A', 2, 'Unit 2 My week', 'time', '星期周期', 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80', 'The day of the week before Sunday and following Friday.', 'I often play football on Saturday.', '我经常在星期六踢足球。'),
  item('5a-u2-sunday', 'Sunday', '/ˈsʌndeɪ/', 'Sun-day', 'xīng qī rì', '星期日', 'n.', '5', 'A', 2, 'Unit 2 My week', 'time', '星期周期', 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80', 'The day of the week before Monday and following Saturday.', 'On Sunday, I read books and clean my room.', '星期天我会读书和打扫房间。'),
  item('5a-u2-weekend', 'weekend', '/ˌwiːkˈend/', 'week-end', 'zhōu mò', '周末', 'n.', '5', 'A', 2, 'Unit 2 My week', 'time', '星期周期', 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80', 'Saturday and Sunday, especially regarded as a time for leisure.', 'Have a great weekend with your family!', '和家人一起度过一个美好的周末！'),

  // 5A Unit 3: What would you like?
  item('5a-u3-sandwich', 'sandwich', '/ˈsænwɪtʃ/', 'sand-wich', 'sān míng zhì', '三明治', 'n.', '5', 'A', 3, 'Unit 3 What would you like?', 'food', '餐饮美食', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80', 'Two pieces of bread with filling between them.', 'I would like a tomato and egg sandwich.', '我想来一份西红柿鸡蛋三明治。'),
  item('5a-u3-salad', 'salad', '/ˈsæləd/', 'sal-ad', 'shā lā', '沙拉', 'n.', '5', 'A', 3, 'Unit 3 What would you like?', 'food', '餐饮美食', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80', 'A cold dish of fresh raw vegetables.', 'Fresh fruit salad is healthy and delicious.', '新鲜的水果沙拉健康又美味。'),
  item('5a-u3-hamburger', 'hamburger', '/ˈhæmbɜːɡə(r)/', 'ham-bur-ger', 'hàn bǎo bāo', '汉堡包', 'n.', '5', 'A', 3, 'Unit 3 What would you like?', 'food', '餐饮美食', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80', 'A round patty of ground beef inside a sliced bun.', 'A delicious beef hamburger.', '一个美味的牛肉汉堡。'),
  item('5a-u3-ice-cream', 'ice cream', '/ˌaɪs ˈkriːm/', 'ice cream', 'bīng jī líng', '冰淇淋', 'n.', '5', 'A', 3, 'Unit 3 What would you like?', 'food', '餐饮美食', 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80', 'A sweet frozen food made from flavored milk fat.', 'Eating strawberry ice cream in hot summer.', '炎热的夏天品尝草莓冰淇淋。'),
  item('5a-u3-tea', 'tea', '/tiː/', 't-ea', 'chá', '茶；茶水', 'n.', '5', 'A', 3, 'Unit 3 What would you like?', 'drinks', '饮品酒水', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80', 'A hot drink made by infusing dried crushed tea leaves.', 'Grandpa enjoys drinking hot green tea.', '爷爷喜欢喝热绿茶。'),
  item('5a-u3-delicious', 'delicious', '/dɪˈlɪʃəs/', 'de-li-cious', 'měi wèi de ; kě kǒu de', '美味的；可口的', 'adj.', '5', 'A', 3, 'Unit 3 What would you like?', 'food', '美食风味', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80', 'Highly pleasant to the taste.', 'The noodles smell delicious.', '面条闻起来香气扑鼻，很美味。'),

  // 5B Seasons & Events
  item('5b-u1-spring', 'spring', '/sprɪŋ/', 'spr-i-ng', 'chūn tiān', '春天', 'n.', '5', 'B', 2, 'Unit 2 My favourite season', 'seasons', '春夏秋冬', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80', 'The season after winter and before summer.', 'Spring is green with colorful flowers.', '春天绿草如茵，繁花似锦。'),
  item('5b-u1-summer', 'summer', '/ˈsʌmə(r)/', 'sum-mer', 'xià tiān', '夏天', 'n.', '5', 'B', 2, 'Unit 2 My favourite season', 'seasons', '春夏秋冬', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', 'The warmest season of the year.', 'I love swimming in summer.', '我喜欢在夏天游泳。'),
  item('5b-u1-autumn', 'autumn', '/ˈɔːtəm/', 'au-tumn', 'qiū tiān', '秋天', 'n.', '5', 'B', 2, 'Unit 2 My favourite season', 'seasons', '春夏秋冬', 'https://images.unsplash.com/photo-1507371341162-763b5e419408?w=600&auto=format&fit=crop&q=80', 'The season between summer and winter.', 'Autumn leaves turn gold and red.', '秋天的树叶变得金黄而火红。'),
  item('5b-u1-winter', 'winter', '/ˈwɪntə(r)/', 'win-ter', 'dōng tiān', '冬天', 'n.', '5', 'B', 2, 'Unit 2 My favourite season', 'seasons', '春夏秋冬', 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=600&auto=format&fit=crop&q=80', 'The coldest season of the year.', 'We play in the snow during winter.', '冬天我们可以在雪地里尽情玩耍。'),
];

// ==========================================
// GRADE 6 (2024新课标PEP版)
// ==========================================
const grade6 = [
  // 6A Unit 1: How can I get there?
  item('6a-u1-science-museum', 'science museum', '/ˈsaɪəns mjuːziːəm/', 'sci-ence mu-se-um', 'kē xué bó wù guǎn', '科学博物馆', 'n.', '6', 'A', 1, 'Unit 1 How can I get there?', 'places', '城市建筑', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', 'A museum devoted to science and technology.', 'Where is the science museum? Turn left at the bookstore.', '科学博物馆在哪里？在书店左拐。'),
  item('6a-u1-post-office', 'post office', '/pəʊst ˈɒfɪs/', 'post of-fice', 'yóu jú', '邮局', 'n.', '6', 'A', 1, 'Unit 1 How can I get there?', 'places', '城市建筑', 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80', 'The public department responsible for postal service.', 'I want to send a postcard at the post office.', '我想去邮局寄一张明信片。'),
  item('6a-u1-bookstore', 'bookstore', '/ˈbʊkstɔː(r)/', 'book-store', 'shū diàn', '书店', 'n.', '6', 'A', 1, 'Unit 1 How can I get there?', 'places', '城市建筑', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80', 'A shop where books are sold.', 'Buy an English dictionary in the bookstore.', '在书店买一本英语词典。'),
  item('6a-u1-cinema', 'cinema', '/ˈsɪnəmə/', 'cin-e-ma', 'diàn yǐng yuàn', '电影院', 'n.', '6', 'A', 1, 'Unit 1 How can I get there?', 'places', '城市建筑', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80', 'A theatre where films are shown for public entertainment.', 'Let us see a new movie at the cinema.', '让我们去电影院看一部新电影吧。'),
  item('6a-u1-hospital', 'hospital', '/ˈhɒspɪtl/', 'hos-pi-tal', 'yī yuàn', '医院', 'n.', '6', 'A', 1, 'Unit 1 How can I get there?', 'places', '城市建筑', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80', 'An institution providing medical and surgical treatment.', 'The hospital is next to the post office.', '医院紧挨着邮局。'),
  item('6a-u1-crossing', 'crossing', '/ˈkrɒsɪŋ/', 'cross-ing', 'shí zì lù kǒu', '十字路口', 'n.', '6', 'A', 1, 'Unit 1 How can I get there?', 'traffic', '交通出行', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80', 'A place where two roads intersect.', 'Turn right at the first crossing.', '在第一个十字路口右转。'),

  // 6A Unit 2: Ways to go to school
  item('6a-u2-on-foot', 'on foot', '/ɒn fʊt/', 'on foot', 'bù xíng', '步行', 'phr.', '6', 'A', 2, 'Unit 2 Ways to go to school', 'traffic', '交通方式', 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&auto=format&fit=crop&q=80', 'Walking rather than using a vehicle.', 'I go to school on foot every morning.', '我每天早晨步行去上学。'),
  item('6a-u2-by-bus', 'by bus', '/baɪ bʌs/', 'by bus', 'chéng gōng jiāo chē', '乘公共汽车', 'phr.', '6', 'A', 2, 'Unit 2 Ways to go to school', 'traffic', '交通方式', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80', 'Travelling in a bus.', 'He goes to the library by bus.', '他坐公交车去图书馆。'),
  item('6a-u2-by-plane', 'by plane', '/baɪ pleɪn/', 'by plane', 'zuò fēi jī', '坐飞机', 'phr.', '6', 'A', 2, 'Unit 2 Ways to go to school', 'traffic', '交通方式', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80', 'Travelling by airplane.', 'We travelled to Beijing by plane.', '我们乘飞机去北京旅行。'),
  item('6a-u2-by-subway', 'by subway', '/baɪ ˈsʌbweɪ/', 'by sub-way', 'chéng dì tiě', '乘地铁', 'phr.', '6', 'A', 2, 'Unit 2 Ways to go to school', 'traffic', '交通方式', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80', 'Travelling by underground railway.', 'Taking the subway is fast and green.', '乘地铁既快捷又环保。'),
  item('6a-u2-slow-down', 'slow down', '/sləʊ daʊn/', 'slow down', 'jiǎn sù', '减速', 'phr.', '6', 'A', 2, 'Unit 2 Ways to go to school', 'traffic', '交通安全', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80', 'Reduce speed.', 'Slow down and stop at a yellow light.', '黄灯亮时要减速并停下。'),
  item('6a-u2-stop', 'stop', '/stɒp/', 'st-o-p', 'tíng xià', '停下', 'v.', '6', 'A', 2, 'Unit 2 Ways to go to school', 'traffic', '交通安全', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80', 'Come to an end; cease to move.', 'Stop at a red light for safety.', '红灯停，确保安全。'),

  // 6B Unit 1: How tall are you?
  item('6b-u1-taller', 'taller', '/ˈtɔːlə(r)/', 'tall-er', 'gèng gāo de', '更高的', 'adj.', '6', 'B', 1, 'Unit 1 How tall are you?', 'comparative', '比较级', 'https://images.unsplash.com/photo-1538099130811-745e64318258?w=600&auto=format&fit=crop&q=80', 'Comparative of tall.', 'I am taller than my younger brother.', '我比我的弟弟要高。'),
  item('6b-u1-shorter', 'shorter', '/ˈʃɔːtə(r)/', 'short-er', 'gèng ǎi de', '更矮的', 'adj.', '6', 'B', 1, 'Unit 1 How tall are you?', 'comparative', '比较级', 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80', 'Comparative of short.', 'He is shorter than me.', '他比我稍矮一些。'),
  item('6b-u1-older', 'older', '/ˈəʊldə(r)/', 'old-er', 'nián jì gèng dà de', '年纪更大的', 'adj.', '6', 'B', 1, 'Unit 1 How tall are you?', 'comparative', '比较级', 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=600&auto=format&fit=crop&q=80', 'Comparative of old.', 'My sister is two years older than me.', '我姐姐比我大两岁。'),
  item('6b-u1-younger', 'younger', '/ˈjʌŋɡə(r)/', 'young-er', 'gèng nián qīng de', '更年轻的', 'adj.', '6', 'B', 1, 'Unit 1 How tall are you?', 'comparative', '比较级', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', 'Comparative of young.', 'Who is younger in your class?', '你们班谁年纪最小？'),
  item('6b-u1-stronger', 'stronger', '/ˈstrɒŋɡə(r)/', 'strong-er', 'gèng qiáng zhuàng de', '更强壮的', 'adj.', '6', 'B', 1, 'Unit 1 How tall are you?', 'comparative', '比较级', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80', 'Comparative of strong.', 'Doing exercises makes you stronger.', '坚持锻炼会让你变得更强壮。'),
];

console.log(`Writing Grade 5 (${grade5.length} words) and Grade 6 (${grade6.length} words)...`);
fs.writeFileSync('src/data/pepGrade5.ts', `import { WordItem } from '../types';\n\nexport const PEP_GRADE_5_WORDS: WordItem[] = ${JSON.stringify(grade5, null, 2)};\n`, 'utf8');
fs.writeFileSync('src/data/pepGrade6.ts', `import { WordItem } from '../types';\n\nexport const PEP_GRADE_6_WORDS: WordItem[] = ${JSON.stringify(grade6, null, 2)};\n`, 'utf8');
console.log('Successfully wrote pepGrade5.ts and pepGrade6.ts');
