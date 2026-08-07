# tests/test_all_languages.py
import sys
import time

from google_translate import translate, get_languages, LANGUAGES





_TEXT = "Tyger Tyger, burning bright. In the forests of the night. What immortal hand or eye, could frame thy fearful symmetry?"
_SOURCE = "en"
_DELAY = 0.5





def run():
    languages = get_languages()
    total = len(languages)
    passed = []
    failed = []

    print(f"Testing translation of {total} languages")
    print(f"Source text: {_TEXT!r}")
    print("-" * 60)

    for lang in languages:
        code = LANGUAGES[lang]

        if code == _SOURCE:
            print(f"  SKIP  {lang} ({code}), same as source")
            total -= 1
            continue

        try:
            result = translate(_TEXT, target=code, source=_SOURCE)
            print(f"  PASS  {lang} ({code}) -> {result!r}")
            passed.append(lang)
        except Exception as exc:
            print(f"  FAIL  {lang} ({code}) -> {exc}")
            failed.append((lang, code, str(exc)))

        time.sleep(_DELAY)

    print("-" * 60)
    print(f"Results: {len(passed)} passed, {len(failed)} failed out of {total}")

    if failed:
        print("\nFailed languages:")
        
        for lang, code, reason in failed:
            print(f"  {lang} ({code}): {reason}")
        
        sys.exit(1)





if __name__ == "__main__":
    run()