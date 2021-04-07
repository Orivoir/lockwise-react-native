import {NETWORK_REDUCERS_INITIAL_STATE} from './../../constants';

export default function networkReducers(
  state = NETWORK_REDUCERS_INITIAL_STATE,
  action,
) {
  switch (action.type) {
    case 'NETWORK_CHANGE':
      if (typeof action.network === 'object') {
        return action.network;
      }
      return state;
    default:
      return state;
  }
}
