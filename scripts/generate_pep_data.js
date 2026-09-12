import fs from 'fs';
import path from 'path';

// Helper to generate word items
function createWord(data) {
  return {
    id: data.id,
    word: data.word.toUpperCase(),
    phonetic: data.phonetic || '',
    phonics: data.phonics || '',
    pinyin: data.pinyin || '',
    translation: data.translation || '',
    partOfSpeech: data.pos || 'n.',
    grade: data.grade,
    semester: data.semester,
    semesterKey: data.grade + data.semester,
    unitId: `${data.grade}${data.semester}-U${data.unit}`,
    unitName: data.unitName,
    category: data.category,
    categoryLabel: data.categoryLabel,
    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80',
    englishDefinition: data.def,
    exampleSentence: data.sentence,
    exampleTranslation: data.sentenceCn,
  };
}

console.log('Building complete PEP vocabulary files...');
