import { setCookie, getCookie, deleteCookie } from 'cookies-next';

export const cookieService = {
  setAuthData: (token: string, role: string, refreshToken?: string) => {
    setCookie('token', token);
    setCookie('role', role);
    if (refreshToken) {
      setCookie('refreshToken', refreshToken);
    }
  },

  clearAuthData: () => {
    deleteCookie('token');
    deleteCookie('role');
    deleteCookie('refreshToken');
  },

  getRole: () => {
    return getCookie('role');
  },

  getToken: () => {
    return getCookie('token');
  }
}; 