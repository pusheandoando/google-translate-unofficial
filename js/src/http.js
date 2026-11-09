// js/src/http.js
import { RequestFailed, TooManyRequests } from './exceptions.js';
import { buildQueryString } from './query.js';





const USER_AGENT = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';





function isNodeRuntime() {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null
  );
}


function buildHeaders() {
  // Browsers forbid or ignore a custom User-Agent, and sending it can trigger a CORS preflight.
  if (isNodeRuntime()) {
    return { 'User-Agent': USER_AGENT };
  }


  return {};
}


async function request(endpoint, params) {
  if (typeof globalThis.fetch !== 'function') {
    throw new RequestFailed('fetch is not available in this environment');
  }

  const url = `${endpoint}?${buildQueryString(params)}`;

  let response;
  try {
    response = await globalThis.fetch(url, { headers: buildHeaders() });
  } catch (exc) {
    throw new RequestFailed(exc.message);
  }

  if (response.status === 429) {
    throw new TooManyRequests();
  }

  if (!(response.status >= 200 && response.status < 300)) {
    throw new RequestFailed(`HTTP ${response.status}`);
  }


  return response;
}





export { request };