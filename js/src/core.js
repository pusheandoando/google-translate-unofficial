// js/src/core.js
import { LANGUAGES } from './constants.js';
import { LanguageNotSupported, TranslationError } from './exceptions.js';
import { request } from './http.js';
import { extractTranslationFromHtml } from './html.js';





const ENDPOINT_JSON = 'https://translate.googleapis.com/translate_a/single';
const ENDPOINT_HTML = 'https://translate.google.com/m';





class Translator {
  _resolve(lang) {
    if (lang === 'auto') {
      return lang;
    }

    if (Object.prototype.hasOwnProperty.call(LANGUAGES, lang)) {
      return LANGUAGES[lang];
    }

    if (Object.values(LANGUAGES).includes(lang)) {
      return lang;
    }


    throw new LanguageNotSupported(lang);
  }


  async _fetchJson(src, tgt, text) {
    const response = await request(ENDPOINT_JSON, {
      client: 'gtx',
      dt: 't',
      sl: src,
      tl: tgt,
      q: text,
    });

    let data;
    try {
      data = await response.json();
    } catch (exc) {
      return null;
    }

    const segments = Array.isArray(data) && data[0] ? data[0] : null;
    if (!segments) {
      return null;
    }

    const parts = [];
    for (const segment of segments) {
      if (segment && segment[0]) {
        parts.push(segment[0]);
      }
    }

    const result = parts.join('').trim();


    return result ? result : null;
  }


  async _fetchHtml(src, tgt, text) {
    const response = await request(ENDPOINT_HTML, {
      sl: src,
      tl: tgt,
      q: text,
    });

    const html = await response.text();


    return extractTranslationFromHtml(html);
  }


  async translate(text, target = 'en', source = 'auto') {
    if (typeof text !== 'string') {
      throw new TypeError(`expected string, got ${typeof text}`);
    }

    const trimmed = text.trim();
    if (!trimmed) {
      return trimmed;
    }

    const src = this._resolve(source);
    const tgt = this._resolve(target);

    if (src !== 'auto' && src === tgt) {
      return trimmed;
    }

    const jsonResult = await this._fetchJson(src, tgt, trimmed);
    if (jsonResult !== null) {
      return jsonResult;
    }

    const htmlResult = await this._fetchHtml(src, tgt, trimmed);
    if (htmlResult !== null) {
      return htmlResult;
    }


    throw new TranslationError(trimmed);
  }


  async translateBatch(batch, target = 'en', source = 'auto') {
    if (!batch || !batch.length) {
      throw new RangeError('batch cannot be empty');
    }

    const results = [];
    for (const item of batch) {
      results.push(await this.translate(item, target, source));
    }


    return results;
  }


  getLanguages(asDict = false) {
    return asDict ? LANGUAGES : Object.keys(LANGUAGES);
  }
}





export { Translator };