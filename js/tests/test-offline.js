// js/tests/test-offline.js
import assert from 'node:assert/strict';

import { translate, RequestFailed, TooManyRequests } from '../src/index.js';
import { extractTranslationFromHtml } from '../src/html.js';
import { buildQueryString } from '../src/query.js';





const JSON_ENDPOINT_MARKER = 'translate_a/single';
const originalFetch = globalThis.fetch;





function jsonResponse(payload) {
  return {
    status: 200,
    json: async () => payload,
    text: async () => JSON.stringify(payload),
  };
}


function htmlResponse(html) {
  return {
    status: 200,
    json: async () => {
      throw new SyntaxError('not json');
    },
    text: async () => html,
  };
}


function statusResponse(status) {
  return {
    status,
    json: async () => null,
    text: async () => '',
  };
}





const tests = [
  {
    name: 'html: decodes named and numeric entities',
    run: async () => {
      const html = '<div class="result-container">Tom &amp; Jerry &#65;&#x42; caf&#233;</div>';
      assert.equal(extractTranslationFromHtml(html), 'Tom & Jerry AB caf\u00e9');
    },
  },
  {
    name: 'html: prefers t0 over result-container',
    run: async () => {
      const html = '<div class="result-container">second</div><div class="t0">first</div>';
      assert.equal(extractTranslationFromHtml(html), 'first');
    },
  },
  {
    name: 'html: handles single quotes and extra classes',
    run: async () => {
      const html = "<div class='foo result-container bar'>  hello  </div>";
      assert.equal(extractTranslationFromHtml(html), 'hello');
    },
  },
  {
    name: 'html: ignores attributes that only end with the class name',
    run: async () => {
      const html = '<div data-class="t0">nope</div>';
      assert.equal(extractTranslationFromHtml(html), null);
    },
  },
  {
    name: 'html: strips nested tags and keeps escaped markup as text',
    run: async () => {
      const html = '<div class="t0">a<br>b &lt;i&gt;</div>';
      assert.equal(extractTranslationFromHtml(html), 'ab <i>');
    },
  },
  {
    name: 'html: leaves unknown and invalid entities untouched',
    run: async () => {
      const html = '<div class="t0">&constructor; &#99999999; &#0;</div>';
      assert.equal(extractTranslationFromHtml(html), '&constructor; &#99999999; &#0;');
    },
  },
  {
    name: 'html: returns null when nothing matches',
    run: async () => {
      assert.equal(extractTranslationFromHtml('<p>nothing</p>'), null);
    },
  },
  {
    name: 'query: encodes keys and values',
    run: async () => {
      assert.equal(buildQueryString({ q: 'a b&c', sl: 'auto' }), 'q=a%20b%26c&sl=auto');
    },
  },
  {
    name: 'translate: joins JSON segments and sends the Node user agent',
    run: async () => {
      let captured;
      globalThis.fetch = async (url, options) => {
        captured = { url, options };
        return jsonResponse([[['Hola', 'Hello'], [' mundo', ' world']]]);
      };

      const result = await translate('Hello world', 'es');

      assert.equal(result, 'Hola mundo');
      assert.ok(captured.url.includes(JSON_ENDPOINT_MARKER));
      assert.ok(captured.url.includes('tl=es'));
      assert.ok(captured.url.includes('sl=auto'));
      assert.equal(typeof captured.options.headers['User-Agent'], 'string');
    },
  },
  {
    name: 'translate: omits the user agent outside Node',
    run: async () => {
      let captured;
      globalThis.fetch = async (url, options) => {
        captured = options;
        return jsonResponse([[['Hola', 'Hello']]]);
      };

      const originalProcess = globalThis.process;
      globalThis.process = undefined;
      try {
        await translate('Hello', 'es');
      } finally {
        globalThis.process = originalProcess;
      }

      assert.deepEqual(captured.headers, {});
    },
  },
  {
    name: 'translate: falls back to the HTML endpoint',
    run: async () => {
      globalThis.fetch = async (url) => {
        if (url.includes(JSON_ENDPOINT_MARKER)) {
          return jsonResponse([]);
        }

        return htmlResponse('<div class="result-container">Hola</div>');
      };

      assert.equal(await translate('Hello', 'es'), 'Hola');
    },
  },
  {
    name: 'translate: maps HTTP 429 to TooManyRequests',
    run: async () => {
      globalThis.fetch = async () => statusResponse(429);
      await assert.rejects(translate('Hello', 'es'), TooManyRequests);
    },
  },
  {
    name: 'translate: maps network errors to RequestFailed',
    run: async () => {
      globalThis.fetch = async () => {
        throw new TypeError('Failed to fetch');
      };
      await assert.rejects(translate('Hello', 'es'), RequestFailed);
    },
  },
  {
    name: 'translate: reports a missing fetch as RequestFailed',
    run: async () => {
      globalThis.fetch = undefined;
      await assert.rejects(translate('Hello', 'es'), RequestFailed);
    },
  },
];





async function run() {
  const failed = [];

  for (const test of tests) {
    try {
      await test.run();
      console.log(`  PASS  ${test.name}`);
    } catch (exc) {
      console.log(`  FAIL  ${test.name} -> ${exc.message}`);
      failed.push(test.name);
    } finally {
      globalThis.fetch = originalFetch;
    }
  }

  console.log(`Results: ${tests.length - failed.length} passed, ${failed.length} failed out of ${tests.length}`);

  if (failed.length) {
    process.exit(1);
  }
}


run();