# google-translate-unofficial (Node.js)
Unofficial Google Translate for Node.js - no API key required.





## Installation
```bash
npm install google-translate-unofficial
```





## Usage
```bash
import { translate, translateBatch, getLanguages } from 'google-translate-unofficial';
// or: const { translate, translateBatch, getLanguages } = require('google-translate-unofficial');
```


### Translate a string
```bash
import { translate } from 'google-translate-unofficial';

await translate('Hello world', 'es');
// "Hola mundo"

await translate('Bonjour', 'en', 'fr');
// "Hello"

await translate('こんにちは', 'de');
// "Hallo"
```

The `source` parameter defaults to `"auto"`, letting Google detect the language automatically. Languages can be passed as full names or ISO codes interchangeably.

```bash
await translate('Hello', 'spanish');
await translate('Hello', 'es');
// both return "Hola"
```


### Translate a batch
```bash
import { translateBatch } from 'google-translate-unofficial';

await translateBatch(['cat', 'dog', 'house'], 'fr');
// ["chat", "chien", "maison"]
```


### Get supported languages
```bash
import { getLanguages } from 'google-translate-unofficial';

getLanguages();
// ["afrikaans", "albanian", "amharic", ...]

getLanguages(true);
// {"afrikaans": "af", "albanian": "sq", "amharic": "am", ...}
```





## Environments
The package has no dependencies and only needs a global fetch. It ships as native ES modules (src), a CommonJS build (dist/index.cjs) and a browser global build (dist/google-translate-unofficial.global.js), so it works in Node 18+, bundlers (Vite, webpack, Next.js), React, React Native and Chrome extensions.


### ES modules
```bash
import { translate } from 'google-translate-unofficial';
```


### CommonJS
```bash
const { translate } = require('google-translate-unofficial');
```


### Browser without a bundler
```bash
<script src="https://cdn.jsdelivr.net/npm/google-translate-unofficial"></script>
<script>
  GoogleTranslateUnofficial.translate('Hello', 'es').then(console.log);
</script>
```


### Chrome extension (Manifest V3)
Declare the hosts in manifest.json:

```bash
"host_permissions": ["https://translate.googleapis.com/*", "https://translate.google.com/*"]
```

Call translate from the service worker or an extension page. With a bundler use the ES module import. Without one, load the global build in a classic service worker:

```bash
importScripts('google-translate-unofficial.global.js');

GoogleTranslateUnofficial.translate('Hello', 'es').then(console.log);
```

Content scripts follow the CORS rules of the page they run in, so send a message to the service worker and translate there.


### CORS in regular web pages
Google does not publish these endpoints for browser use, and a request from a regular web page can be blocked by CORS. Extension service workers with host permissions and React Native are not affected. For web apps, route the call through your own backend if the browser blocks it.





## Notes
- The maximum safe input length is around 5000 characters per call.
- If you translate large batches in a tight loop you may hit rate limits. Add a small delay between calls if needed.