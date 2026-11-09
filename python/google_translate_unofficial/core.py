# google_translate_unofficial/core.py
import requests
from bs4 import BeautifulSoup

from google_translate_unofficial.constants import LANGUAGES
from google_translate_unofficial.exceptions import (
    LanguageNotSupported,
    RequestFailed,
    TooManyRequests,
    TranslationError
)





_ENDPOINT_JSON = "https://translate.googleapis.com/translate_a/single"
_ENDPOINT_HTML = "https://translate.google.com/m"
_USER_AGENT = (
    "Mozilla/5.0 (Linux; Android 10; K) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Mobile Safari/537.36"
)





class _Translator:
    _instance = None


    def __new__(cls):
        if cls._instance is None:
            instance = super().__new__(cls)
            session = requests.Session()
            session.headers.update({"User-Agent": _USER_AGENT})
            instance._session = session
            cls._instance = instance
        
        
        return cls._instance


    def _resolve(self, lang):
        if lang == "auto":
            return lang
        
        if lang in LANGUAGES:
            return LANGUAGES[lang]
        
        if lang in LANGUAGES.values():
            return lang
        
        
        raise LanguageNotSupported(lang)


    def _fetch_json(self, src, tgt, text):
        try:
            response = self._session.get(
                _ENDPOINT_JSON,
                params = {
                    "client": "gtx",
                    "dt": "t",
                    "sl": src,
                    "tl": tgt,
                    "q": text
                },
                timeout = 10,
            )
        except requests.exceptions.ConnectionError as exc:
            raise RequestFailed(str(exc)) from exc

        if response.status_code == 429:
            raise TooManyRequests()

        if not (200 <= response.status_code < 300):
            raise RequestFailed(f"HTTP {response.status_code}")

        try:
            data = response.json()
        except ValueError:
            return None

        segments = data[0] if data and isinstance(data, list) and data[0] else None
        if not segments:
            return None

        parts = []
        for segment in segments:
            if segment and segment[0]:
                parts.append(segment[0])

        result = "".join(parts).strip()
        
        
        return result if result else None


    def _fetch_html(self, src, tgt, text):
        try:
            response = self._session.get(
                _ENDPOINT_HTML,
                params = {
                    "sl": src,
                    "tl": tgt,
                    "q": text
                },
                timeout = 10,
            )
        except requests.exceptions.ConnectionError as exc:
            raise RequestFailed(str(exc)) from exc

        if response.status_code == 429:
            raise TooManyRequests()

        if not (200 <= response.status_code < 300):
            raise RequestFailed(f"HTTP {response.status_code}")

        soup = BeautifulSoup(response.text, "html.parser")
        element = soup.find("div", {"class": "t0"}) or soup.find("div", {"class": "result-container"})
        if not element:
            return None
        
        
        return element.get_text(strip=True) or None


    def translate(self, text, target="en", source="auto"):
        if not isinstance(text, str):
            raise TypeError(f"expected str, got {type(text).__name__}")

        text = text.strip()
        if not text:
            return text

        src = self._resolve(source)
        tgt = self._resolve(target)

        if src != "auto" and src == tgt:
            return text

        result = self._fetch_json(src, tgt, text)
        if result is not None:
            return result

        result = self._fetch_html(src, tgt, text)
        if result is not None:
            return result


        raise TranslationError(text)


    def translate_batch(self, batch, target="en", source="auto"):
        if not batch:
            raise ValueError("batch cannot be empty")

        
        return [self.translate(t, target=target, source=source) for t in batch]


    def get_languages(self, as_dict=False):
        return LANGUAGES if as_dict else list(LANGUAGES.keys())