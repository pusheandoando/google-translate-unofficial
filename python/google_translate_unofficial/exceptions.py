# google_translate_unofficial/exceptions.py





class TranslationError(Exception):
    def __init__(self, text, message="no translation found"):
        self.text = text
        super().__init__(f"[google_translate_unofficial] {text!r} -> {message}")


class LanguageNotSupported(Exception):
    def __init__(self, lang):
        super().__init__(f"[google_translate_unofficial] language not supported: {lang!r}")


class RequestFailed(Exception):
    def __init__(self, detail=""):
        msg = f"[google_translate_unofficial] request to Google Translate failed: {detail}" if detail else "[google_translate_unofficial] request to Google Translate failed"
        super().__init__(msg)


class TooManyRequests(Exception):
    def __init__(self):
        super().__init__("[google_translate_unofficial] server returned 429, wait before retrying or use translate_batch with a delay")