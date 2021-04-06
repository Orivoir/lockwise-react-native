import {THEME_REDUCERS_INITIAL_STATE} from './../../constants';

import LightTheme from './../../themes/light';
import DarkTheme from './../../themes/dark';

/*
Theme {
  name: string,
  value: PaperTheme
}
*/

/**
 * @description reducers manager `UI theme` accepts below actions: \
 * **TOGGLE_THEME** `{}` \
 * **LIGHT_THEME** `{}` \
 * **DARK_THEME** `{}`
 * @param {Theme} state
 * @param {{type: string}} action
 * @returns {Theme} always the new state
 */
export default function themeReducers(
  state = THEME_REDUCERS_INITIAL_STATE,
  action,
) {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return state.name === 'light'
        ? {
            name: 'dark',
            value: DarkTheme,
          }
        : {
            name: 'light',
            value: LightTheme,
          };
    case 'LIGHT_THEME':
      if (state.name === 'light') {
        return state;
      }
      return {
        name: 'light',
        value: LightTheme,
      };
    case 'DARK_THEME':
      if (state.name === 'dark') {
        return state;
      }
      return {
        name: 'dark',
        value: DarkTheme,
      };
    default:
      return state;
  }
}
