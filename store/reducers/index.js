import {combineReducers} from 'redux';

import accountsReducers from './accountsReducers';
import themeReducers from './themeReducers';
import networkReducers from './networkReducers';

const rootReducers = combineReducers({
  accounts: accountsReducers,
  theme: themeReducers,
  network: networkReducers
});

export default rootReducers;
