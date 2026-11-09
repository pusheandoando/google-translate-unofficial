// js/src/index.js
import { Translator } from './core.js';
import { LANGUAGES } from './constants.js';
import {
  LanguageNotSupported,
  RequestFailed,
  TooManyRequests,
  TranslationError,
} from './exceptions.js';





const translator = new Translator();





function translate(text, target = 'en', source = 'auto') {
  return translator.translate(text, target, source);
}


function translateBatch(batch, target = 'en', source = 'auto') {
  return translator.translateBatch(batch, target, source);
}


function getLanguages(asDict = false) {
  return translator.getLanguages(asDict);
}





export {
  translate,
  translateBatch,
  getLanguages,
  LANGUAGES,
  TranslationError,
  LanguageNotSupported,
  RequestFailed,
  TooManyRequests,
};