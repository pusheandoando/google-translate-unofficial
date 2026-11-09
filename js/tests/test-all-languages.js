// js/tests/test-all-languages.js
import { translate, getLanguages, LANGUAGES } from '../src/index.js';





const TEXT = 'Tyger Tyger, burning bright. In the forests of the night. What immortal hand or eye, could frame thy fearful symmetry?';
const SOURCE = 'en';
const DELAY_MS = 500;





function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


async function run() {
  const languages = getLanguages();
  let total = languages.length;
  const passed = [];
  const failed = [];

  console.log(`Testing translation of ${total} languages`);
  console.log(`Source text: ${JSON.stringify(TEXT)}`);
  console.log('-'.repeat(60));

  for (const lang of languages) {
    const code = LANGUAGES[lang];

    if (code === SOURCE) {
      console.log(`  SKIP  ${lang} (${code}), same as source`);
      total -= 1;
      continue;
    }

    try {
      const result = await translate(TEXT, code, SOURCE);
      console.log(`  PASS  ${lang} (${code}) -> ${JSON.stringify(result)}`);
      passed.push(lang);
    } catch (exc) {
      console.log(`  FAIL  ${lang} (${code}) -> ${exc.message}`);
      failed.push([lang, code, exc.message]);
    }

    await wait(DELAY_MS);
  }

  console.log('-'.repeat(60));
  console.log(`Results: ${passed.length} passed, ${failed.length} failed out of ${total}`);

  if (failed.length) {
    console.log('\nFailed languages:');

    for (const [lang, code, reason] of failed) {
      console.log(`  ${lang} (${code}): ${reason}`);
    }

    process.exit(1);
  }
}


run();