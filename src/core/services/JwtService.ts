const ID_TOKEN_KEY = "id_token" as string;
const REFRESH_TOKEN_KEY = "refresh_token" as string;
const USER_KEY = "user" as string;

/**
 * @description get token form localStorage
 */
export const getToken = (): string | null => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

/**
 * @description remove token form localStorage
 */
export const destroyToken = (): void => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

/**
 * @description get refresh token form localStorage
 */
export const getRefreshToken = (): string | null => {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * @description save refresh token into localStorage
 * @param token: string
 */
export const saveRefreshToken = (token: string): void => {
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * @description remove refresh token form localStorage
 */
export const destroyRefreshToken = (): void => {
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * @description get user from localStorage
 */
export const getUser = (): any => {
  const user = window.localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * @description save user into localStorage
 * @param user: any
 */
export const saveUser = (user: any): void => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * @description remove user from localStorage
 */
export const destroyUser = (): void => {
  window.localStorage.removeItem(USER_KEY);
};

export default {
  getToken,
  saveToken,
  destroyToken,
  getRefreshToken,
  saveRefreshToken,
  destroyRefreshToken,
  getUser,
  saveUser,
  destroyUser,
};
