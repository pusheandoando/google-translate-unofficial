// js/src/query.js





function buildQueryString(params) {
  const pairs = [];

  for (const [key, value] of Object.entries(params)) {
    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }


  return pairs.join('&');
}





export { buildQueryString };