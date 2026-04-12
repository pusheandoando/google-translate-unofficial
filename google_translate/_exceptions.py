# google_translate/_exceptions.py





class TranslationError(Exception):
    def __init__(self, text, message="no translation found"):
        self.text = text
        super().__init__(f"[google_translate] {text!r} -> {message}")


class LanguageNotSupported(Exception):
    def __init__(self, lang):super().__init__(f"[google_translate] language not supported: {lang!r}")


class RequestFailed(Exception):
    def __init__(self, detail=""):
        msg = f"[google_translate] request to Google Translate failed: {detail}" if detail else "request to Google Translate failed"
        super().__init__(msg)


class TooManyRequests(Exception):
    def __init__(self):
        super().__init__("[google_translate] server returned 429, wait before retrying or use translate_batch with a delay")