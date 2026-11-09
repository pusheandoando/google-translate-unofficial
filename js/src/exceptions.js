// js/src/exceptions.js





class TranslationError extends Error {
  constructor(text, message = 'no translation found') {
    super(`[google_translate_unofficial] ${JSON.stringify(text)} -> ${message}`);
    this.name = 'TranslationError';
    this.text = text;
  }
}


class LanguageNotSupported extends Error {
  constructor(lang) {
    super(`[google_translate_unofficial] language not supported: ${JSON.stringify(lang)}`);
    this.name = 'LanguageNotSupported';
    this.lang = lang;
  }
}


class RequestFailed extends Error {
  constructor(detail = '') {
    const message = detail
      ? `[google_translate_unofficial] request to Google Translate failed: ${detail}`
      : '[google_translate_unofficial] request to Google Translate failed';
    super(message);
    this.name = 'RequestFailed';
  }
}


class TooManyRequests extends Error {
  constructor() {
    super('[google_translate_unofficial] server returned 429, wait before retrying or use translateBatch with a delay');
    this.name = 'TooManyRequests';
  }
}





export {
  TranslationError,
  LanguageNotSupported,
  RequestFailed,
  TooManyRequests,
};