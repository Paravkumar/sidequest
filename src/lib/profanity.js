// Use curly braces for the import because it's a named export in this version
import { Filter } from 'bad-words';

const filter = new Filter();

// Add custom words to ban (e.g., "sex", "hookup")
const customWords = ['sex', 'hookup', 'nudes', 'weed', 'drugs','lund','gand','chut','chutad','chutiya','gandu','loda','bhenchod','madarchod','randi','behenchod','sassy','sussy','pussy','ciggs','cigarettes','cigars','bong','blunt','cigarette', 'vape','asla','joint','ganja','charas','sassi']; 
filter.addWords(...customWords);

const wordList = new Set([...(filter.list || []), ...customWords].map((w) => String(w).toLowerCase()).filter(Boolean));

const normalizeLetters = (value) => {
  return value
    .replace(/[^a-z]+/g, "")
    .replace(/x/g, "u")
    .replace(/v/g, "u")
    .replace(/q/g, "g")
    .replace(/ph/g, "f")
    .replace(/vv/g, "w")
    .replace(/(.)\1+/g, "$1");
};

const normalizeCompact = (value) => {
  return value
    .replace(/[^a-z0-9]+/g, "")
    .replace(/[0]/g, "o")
    .replace(/[1!|]/g, "i")
    .replace(/[3]/g, "e")
    .replace(/[4@]/g, "a")
    .replace(/[5$]/g, "s")
    .replace(/[7]/g, "t")
    .replace(/[8]/g, "b")
    .replace(/[9]/g, "g")
    .replace(/[x\*]/g, "u")
    .replace(/(.)\1+/g, "$1");
};

const containsObfuscatedProfanity = (letters) => {
  if (!letters || letters.length < 3) return false;
  for (const word of wordList) {
    if (word.length < 3) continue;
    if (letters.includes(word)) return true;
  }
  return false;
};

export function isProfane(text) {
  if (!text) return false;
  try {
    const raw = String(text);
    const rawLower = raw.toLowerCase();
    const lettersOnly = normalizeLetters(rawLower);
    const compactNormalized = normalizeCompact(rawLower);

    return filter.isProfane(raw)
      || (compactNormalized.length >= 3 && filter.isProfane(compactNormalized))
      || containsObfuscatedProfanity(lettersOnly)
      || containsObfuscatedProfanity(compactNormalized);
  } catch (e) {
    return false; // Safety fallback
  }
}

export function cleanText(text) {
  if (!text) return "";
  try {
    return filter.clean(text); 
  } catch (e) {
    return text; // Safety fallback
  }
}