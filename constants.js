// file contains helpers value constants used by reducers and components

import LightTheme from './themes/light';

export const ACCOUNTS_REDUCERS_INITIAL_STATE = null;
export const THEME_REDUCERS_INITIAL_STATE = {
  name: 'light',
  value: LightTheme,
};
export const NETWORK_REDUCERS_INITIAL_STATE = {
  type: 'none',
  isConnected: false,
  isInternetReachable: false,
  isWifiEnable: false,
  details: null,
  isInitialState: true,
};

export const SAFE_SSID = 'SFR_F430';
export const SYNCHRONIZE_BASE_URL = 'http://192.168.1.92:8080/';
export const SYNCHRONIZE_MAX_ITEMS_FETCH_BY_PAGE = 10;
export const TIMEOUT_SERVER_SYNCHRONIZE = 5e3;
