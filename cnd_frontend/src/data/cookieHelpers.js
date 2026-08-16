// utils/cookieHelpers.js
export function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [k, v] = cookie.trim().split('=');
    if (k === name) return v;
  }
  return null;
}
