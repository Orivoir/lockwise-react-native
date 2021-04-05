import {combineReducers} from 'redux';

import accountsReducers from './accountsReducers';
import themeReducers from './themeReducers';

const rootReducers = combineReducers({
  accounts: accountsReducers,
  theme: themeReducers
});

export default rootReducers;
