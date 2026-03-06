import Cookies from 'js-cookie';

export function setTokenCookie(token: string) {
  // Store token without Bearer prefix - client adds it when making requests
  return Cookies.set('token', token, {
    expires: 15,
  });
}
