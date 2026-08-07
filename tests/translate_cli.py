# tests/translate_cli.py
import sys
import argparse

from google_translate import translate
from google_translate._exceptions import (
    LanguageNotSupported,
    RequestFailed,
    TooManyRequests,
    TranslationError,
)





def _build_parser():
    parser = argparse.ArgumentParser(description="Quick translation test via CLI.")
    parser.add_argument("--text", required=True, help="Text to translate.")
    parser.add_argument("--target", default="en", help="Target language (name or ISO code).")
    parser.add_argument("--source", default="auto", help="Source language (name or ISO code).")
    return parser


def main():
    parser = _build_parser()
    args = parser.parse_args()

    try:
        result = translate(args.text, target=args.target, source=args.source)
        print(result)
    except (LanguageNotSupported, RequestFailed, TooManyRequests, TranslationError) as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)





if __name__ == "__main__":
    main()