import {combineReducers} from 'redux';

import accountsReducers from './accountsReducers';
import themeReducers from './themeReducers';
import networkReducers from './networkReducers';

const rootReducers = combineReducers({
  accounts: accountsReducers,
  theme: themeReducers,
  networkReducers: network
});

export default rootReducers;
