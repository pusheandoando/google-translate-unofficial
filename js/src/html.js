// js/src/html.js





const RESULT_CLASS_NAMES = ['t0', 'result-container'];
const TAG_PATTERN = /<[^>]*>/g;
const ENTITY_PATTERN = /&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi;
const MAX_CODE_POINT = 0x10ffff;

const NAMED_ENTITIES = new Map([
  ['amp', '&'],
  ['lt', '<'],
  ['gt', '>'],
  ['quot', '"'],
  ['apos', "'"],
  ['nbsp', ' '],
]);


function buildElementPattern(className) {
  const classAttribute = `class\\s*=\\s*["'](?:[^"']*\\s)?${className}(?:\\s[^"']*)?["']`;


  return new RegExp(`<([a-z][a-z0-9]*)\\b[^>]*?\\s${classAttribute}[^>]*>([\\s\\S]*?)</\\1>`, 'i');
}


const RESULT_PATTERNS = RESULT_CLASS_NAMES.map(buildElementPattern);





function decodeEntity(match, body) {
  if (body.charAt(0) !== '#') {
    const named = NAMED_ENTITIES.get(body.toLowerCase());
    if (named === undefined) {
      return match;
    }

    return named;
  }

  let digits = body.slice(1);
  let radix = 10;
  if (body.charAt(1).toLowerCase() === 'x') {
    digits = body.slice(2);
    radix = 16;
  }

  const codePoint = parseInt(digits, radix);

  if (!Number.isInteger(codePoint) || codePoint === 0 || codePoint > MAX_CODE_POINT) {
    return match;
  }


  return String.fromCodePoint(codePoint);
}


function decodeEntities(text) {
  return text.replace(ENTITY_PATTERN, decodeEntity);
}


function extractTranslationFromHtml(html) {
  for (const pattern of RESULT_PATTERNS) {
    const match = pattern.exec(html);
    if (!match) {
      continue;
    }

    const text = decodeEntities(match[2].replace(TAG_PATTERN, '')).trim();
    if (text) {
      return text;
    }
  }


  return null;
}





export { extractTranslationFromHtml };