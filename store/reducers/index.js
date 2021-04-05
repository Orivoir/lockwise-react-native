import {combineReducers} from 'redux';

import accountsReducers from './accountsReducers';

const rootReducers = combineReducers({
  accounts: accountsReducers
});

export default rootReducers;
