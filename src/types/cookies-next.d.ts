declare module 'cookies-next' {
  export function getCookie(name: string): string | undefined;
  export function setCookie(name: string, value: string, options?: CookieOptions): void;
  export function deleteCookie(name: string): void;
} 