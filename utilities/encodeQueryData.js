// Adopted from https://stackoverflow.com/a/12040639/374385.
export default function encodeQueryData(data) {
  return Object.keys(data).map(key => [key, data[key]].map(encodeURIComponent).join('=')).join('&');
}
