import fs from 'fs';
import path from 'path';

// Helper to write file
function writeWordsFile(filePath, exportName, words) {
  const content = `import { WordItem } from '../types';

export const ${exportName}: WordItem[] = ${JSON.stringify(words, null, 2)};
`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Wrote ${words.length} words to ${filePath}`);
}

console.log('Building complete PEP vocabulary data for Grades 3, 4, 5, 6 with natural phonics & 2024 curriculum standards...');
