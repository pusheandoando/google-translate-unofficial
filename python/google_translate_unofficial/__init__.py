# google_translate_unofficial/__init__.py
from google_translate_unofficial.core import _Translator
from google_translate_unofficial.constants import LANGUAGES
from google_translate_unofficial.exceptions import (
    LanguageNotSupported,
    RequestFailed,
    TooManyRequests,
    TranslationError,
)





_t = _Translator()





def translate(text, target="en", source="auto"):
    return _t.translate(text, target=target, source=source)


def translate_batch(batch, target="en", source="auto"):
    return _t.translate_batch(batch, target=target, source=source)


def get_languages(as_dict=False):
    return _t.get_languages(as_dict=as_dict)





__all__ = [
    "translate",
    "translate_batch",
    "get_languages",
    "LANGUAGES",
    "TranslationError",
    "LanguageNotSupported",
    "RequestFailed",
    "TooManyRequests",
]