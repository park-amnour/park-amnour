/**
 * Custom Hindi Transliteration Utility
 * Uses Google Input Tools API (unofficial but widely used for this exact purpose in React apps)
 */
export const transliterateToHindi = async (text) => {
  if (!text || text.trim() === '') return text;
  
  // Extract the last word to transliterate (standard behavior for transliteration inputs)
  const words = text.split(' ');
  const lastWord = words[words.length - 1];
  
  if (!lastWord || lastWord.trim() === '') return text;

  try {
    const response = await fetch(
      `https://inputtools.google.com/request?text=${encodeURIComponent(lastWord)}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`
    );
    const data = await response.json();
    
    if (data && data[0] === 'SUCCESS' && data[1][0][1][0]) {
      const transliteratedWord = data[1][0][1][0];
      words[words.length - 1] = transliteratedWord;
      return words.join(' ');
    }
    return text;
  } catch (error) {
    console.warn('Transliteration API failed:', error);
    return text;
  }
};
