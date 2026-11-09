#!/usr/bin/env node
// js/tests/translate-cli.js
import { translate } from '../src/index.js';
import {
  LanguageNotSupported,
  RequestFailed,
  TooManyRequests,
  TranslationError,
} from '../src/exceptions.js';





function parseArgs(argv) {
  const args = { target: 'en', source: 'auto' };

  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];

    if (flag === '--text') {
      args.text = argv[i + 1];
      i += 1;
    } else if (flag === '--target') {
      args.target = argv[i + 1];
      i += 1;
    } else if (flag === '--source') {
      args.source = argv[i + 1];
      i += 1;
    }
  }


  return args;
}


async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.text) {
    process.stderr.write('missing required argument: --text\n');
    process.exit(1);
  }

  try {
    const result = await translate(args.text, args.target, args.source);
    process.stdout.write(`${result}\n`);
  } catch (exc) {
    if (
      exc instanceof LanguageNotSupported ||
      exc instanceof RequestFailed ||
      exc instanceof TooManyRequests ||
      exc instanceof TranslationError
    ) {
      process.stderr.write(`${exc.message}\n`);
      process.exit(1);
    }

    throw exc;
  }
}


main();