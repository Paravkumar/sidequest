// Use curly braces for the import because it's a named export in this version
import { Filter } from 'bad-words';

const filter = new Filter();

// Add custom words to ban (e.g., "sex", "hookup")
filter.addWords('sex', 'hookup', 'nudes', 'weed', 'drugs','lund','gand','chut','chutad','chutiya','gandu','loda','bhenchod','madarchod','randi','behenchod','sassy','sussy','pussy','ciggs','cigarettes','cigars','bong','blunt','cigarette', 'vape','asla','joint','ganja','charas','sassi'); 

export function isProfane(text) {
  if (!text) return false;
  try {
    return filter.isProfane(text);
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