# google-translate-unofficial
Unofficial Google Translate for Python - no API key required.





## Installation
```bash
pip3 install --upgrade https://github.com/pusheandoando/google-translate-unofficial.git
```





## Usage
```python
from google_translate import translate, translate_batch, get_languages
```

### Translate a string
```python
from google_translate import translate

translate("Hello world", target="es")
# "Hola mundo"

translate("Bonjour", target="en", source="fr")
# "Hello"

translate("こんにちは", target="de")
# "Hallo"
```


The `source` parameter defaults to `"auto"`, letting Google detect the language automatically. Languages can be passed as full names or ISO codes interchangeably.
```python
translate("Hello", target="spanish")
translate("Hello", target="es")
# both return "Hola"
```

### Translate a batch
```python
from google_translate import translate_batch

translate_batch(["cat", "dog", "house"], target="fr")
# ["chat", "chien", "maison"]
```

### Get supported languages

```python
from google_translate import get_languages

get_languages()
# ["afrikaans", "albanian", "amharic", ...]

get_languages(as_dict=True)
# {"afrikaans": "af", "albanian": "sq", "amharic": "am", ...}
```





## Notes
- The maximum safe input length is around 5000 characters per call.
- If you translate large batches in a tight loop you may hit rate limits. Add a small delay between calls if needed.