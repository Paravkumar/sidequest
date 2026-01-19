import Filter from 'bad-words';

const filter = new Filter();

// Add custom words to ban (e.g., "sex", "hookup")
// The library already blocks standard swears like "fuck", "shit", etc.
filter.addWords('sex', 'hookup', 'nudes', 'weed', 'drugs'); 

export function isProfane(text) {
  if (!text) return false;
  return filter.isProfane(text);
}

export function cleanText(text) {
  if (!text) return "";
  return filter.clean(text); // Replaces bad words with asterisks (****)
}