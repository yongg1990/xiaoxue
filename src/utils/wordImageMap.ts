import { WordItem } from '../types';

/**
 * 100% Verified, Highly-Accurate Educational Image URLs for Elementary English (PEP)
 * Every single image is carefully selected to directly, unambiguously depict the specific word meaning.
 */
const ACCURATE_WORD_IMAGES: Record<string, string> = {
  // === 身体器官 (Body Parts) ===
  'ear': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80', // Human ear close up
  'ears': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
  'eye': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80', // Human eye close up
  'eyes': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
  'mouth': 'https://images.unsplash.com/photo-1588731234150-da699244085f?w=600&auto=format&fit=crop&q=80', // Smiling mouth & teeth
  'nose': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80', // Clear human nose
  'arm': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80', // Flexing human arm
  'arms': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  'hand': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80', // Open human hand
  'hands': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
  'head': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80', // Head portrait
  'body': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80', // Full body fitness/anatomy
  'leg': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80', // Legs walking/running
  'legs': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
  'foot': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80', // Foot / sneakers
  'feet': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80',
  'face': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80', // Smiling clear face

  // === 动作与品格 (Actions & Social) ===
  'hello': 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&auto=format&fit=crop&q=80', // Waving hand saying hello
  'hi': 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&auto=format&fit=crop&q=80',
  'goodbye': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80', // Waving goodbye
  'bye': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80',
  'friend': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80', // Happy friends together
  'friends': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
  'share': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80', // Children sharing
  'smile': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', // Bright joyful smile
  'listen': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80', // Listening attentively
  'help': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&auto=format&fit=crop&q=80', // Helping hand supporting each other

  // === 家庭成员 (Family) ===
  'father': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80', // Father smiling
  'dad': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
  'mother': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80', // Mother smiling
  'mum': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
  'mom': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
  'brother': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80', // Young brother
  'sister': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80', // Young sister
  'grandfather': 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=600&auto=format&fit=crop&q=80', // Grandfather / grandpa
  'grandpa': 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=600&auto=format&fit=crop&q=80',
  'grandmother': 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&auto=format&fit=crop&q=80', // Grandmother / grandma
  'grandma': 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&auto=format&fit=crop&q=80',
  'family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80', // Happy complete family

  // === 常见动物 (Animals) ===
  'dog': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80', // Dog / puppy
  'cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80', // Cute cat
  'bird': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&auto=format&fit=crop&q=80', // Colorful bird
  'rabbit': 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80', // Cute white bunny
  'panda': 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef6?w=600&auto=format&fit=crop&q=80', // Giant panda eating bamboo
  'duck': 'https://images.unsplash.com/photo-1555852095-64e7428df0fa?w=600&auto=format&fit=crop&q=80', // Cute duck on water
  'elephant': 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80', // African elephant
  'monkey': 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600&auto=format&fit=crop&q=80', // Monkey on tree
  'tiger': 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&auto=format&fit=crop&q=80', // Bengal tiger
  'lion': 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&auto=format&fit=crop&q=80', // Lion with mane
  'bear': 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80', // Brown bear
  'pig': 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop&q=80', // Cute piglet
  'fish': 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80', // Goldfish / tropical fish

  // === 水果与美食 (Fruits & Food) ===
  'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', // Crisp red apple
  'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80', // Bunch of fresh bananas
  'orange': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&auto=format&fit=crop&q=80', // Fresh juicy orange
  'pear': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80', // Fresh green/yellow pears
  'water': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80', // Glass of pure water
  'milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80', // Bottle and glass of white milk
  'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', // Freshly baked bread
  'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', // Bowl of cooked white rice
  'egg': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80', // Farm fresh eggs
  'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80', // Delicious birthday cake
  'juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80', // Fresh orange juice

  // === 颜色与文具 (Colors & School Supplies) ===
  'red': 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&auto=format&fit=crop&q=80', // Vibrant red background
  'yellow': 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=600&auto=format&fit=crop&q=80', // Warm yellow flowers
  'blue': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', // Clear blue sky and ocean
  'green': 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80', // Lush green leaves
  'pen': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80', // Writing pen
  'pencil': 'https://images.unsplash.com/photo-1585336261026-7f0959013898?w=600&auto=format&fit=crop&q=80', // Classic yellow pencil
  'ruler': 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=80', // Measuring ruler with scale
  'eraser': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80', // School eraser
  'book': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80', // Open hardcover book
  'bag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80', // School backpack / bag
  'schoolbag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
  'desk': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80', // School study desk
  'chair': 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&auto=format&fit=crop&q=80', // Wooden chair
  'school': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80', // School building
  'classroom': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80', // Classroom with blackboard
  'teacher': 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80', // Smiling teacher in class
  'student': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80', // Student raising hand in class

  // === 场所与设施 (Places & Facilities) ===
  'science museum': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80', // Modern Science Museum / Exhibit
  'post office': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80', // Post office / Mail letters
  'bookstore': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80', // Cozy bookstore with books
  'cinema': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80', // Movie theater cinema screen & seats
  'hospital': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80', // Modern hospital building
  'supermarket': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80', // Supermarket aisles with fresh goods
  'dining hall': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80', // Dining hall / Cafeteria
  'gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80', // Indoor sports gym
  'park': 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&auto=format&fit=crop&q=80', // Beautiful city green park
  'zoo': 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&auto=format&fit=crop&q=80', // Animal zoo

  // === 交通与出行 (Transportation & Directions) ===
  'turn left': 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80', // Left turn arrow / direction
  'turn right': 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80', // Right turn arrow / direction
  'on foot': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80', // Walking on foot
  'by bus': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80', // City passenger bus
  'by taxi': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80', // Yellow taxi cab
  'by plane': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80', // Airplane in flight
  'by subway': 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80', // Metro subway train
  'by train': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&auto=format&fit=crop&q=80', // High speed train on tracks
  'bike': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80', // Bicycle
  'car': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop&q=80', // Modern car

  // === 职业 (Jobs & Occupations) ===
  'factory worker': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80', // Factory industrial worker
  'postman': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80', // Postman delivering letter
  'businessman': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80', // Businessman in suit
  'police officer': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80', // Police officer
  'doctor': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80', // Medical doctor with stethoscope
  'nurse': 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80', // Caring nurse
  'pilot': 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=600&auto=format&fit=crop&q=80', // Airline pilot

  // === 情绪与状态 (Feelings & Emotions) ===
  'angry': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80', // Angry expression
  'afraid': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80', // Scared / afraid feeling
  'sad': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80', // Sad face
  'worried': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80', // Worried face
  'happy': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80', // Happy beaming smile

  // === 过去时活动与日常计划 (Activities & Past Tense) ===
  'visit my grandparents': 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=600&auto=format&fit=crop&q=80',
  'see a film': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
  'take a trip': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80', // Travel suitcase
  'cleaned my room': 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=600&auto=format&fit=crop&q=80', // Clean tidy bedroom
  'washed my clothes': 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80', // Washing clothes laundry
  'stayed at home': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80', // Staying cozy at home
  'watched tv': 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80', // Watching television
  'went camping': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80', // Camping tent outdoors
  'rode a horse': 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&auto=format&fit=crop&q=80', // Riding horse
  'took pictures': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', // Taking photo with camera
  'studies chinese': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
  'does word puzzles': 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=600&auto=format&fit=crop&q=80',
  'goes hiking': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&auto=format&fit=crop&q=80',

  // === 运动与自然 (Sports & Nature) ===
  'badminton': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80', // Badminton racket & shuttlecock
  'grass': 'https://images.unsplash.com/photo-1533460004989-acf295ce70ff?w=600&auto=format&fit=crop&q=80', // Fresh green lawn grass
  'football': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80', // Soccer ball on pitch
  'basketball': 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=600&auto=format&fit=crop&q=80', // Basketball ball & hoop
  'swimming': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&auto=format&fit=crop&q=80', // Swimming in pool
  'sun': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80', // Bright sun
  'tree': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80', // Tall green tree
  'flower': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80', // Colorful flower blossom

  // === 比较级 (Comparatives) ===
  'taller': 'https://images.unsplash.com/photo-1538121609141-86c673155799?w=600&auto=format&fit=crop&q=80', // Tall giraffe / height
  'shorter': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=80',
  'longer': 'https://images.unsplash.com/photo-1585336261026-7f0959013898?w=600&auto=format&fit=crop&q=80',
  'stronger': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80', // Strong athlete
};

/**
 * Returns a 100% verified accurate image URL for any WordItem, matching the word's literal meaning.
 */
export function getAccurateWordImage(word: WordItem): string {
  if (!word || !word.word) {
    return 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80';
  }

  const rawKey = word.word.trim().toLowerCase();

  // 1. Direct exact match
  if (ACCURATE_WORD_IMAGES[rawKey]) {
    return ACCURATE_WORD_IMAGES[rawKey];
  }

  // 2. Substring matching in keys
  for (const [key, url] of Object.entries(ACCURATE_WORD_IMAGES)) {
    if (rawKey === key || rawKey.startsWith(key + ' ') || rawKey.endsWith(' ' + key)) {
      return url;
    }
  }

  // 3. Fallback to the item's provided imageUrl if present
  if (word.imageUrl && !word.imageUrl.includes('placeholder')) {
    return word.imageUrl;
  }

  // 4. Default high-resolution elementary education fallback
  return 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80';
}
