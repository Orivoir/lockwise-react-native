import {
  ACCOUNTS_REDUCERS_INITIAL_STATE
} from './../../constants';

/*
AccountCreate {
    platform: string,
    login: string,
    urlLogin: string | null,
    isFavorite: boolean
};

Account extends AccountCreate {
	id: number,
    createAt: number | Timestamp
};
*/

/**
 * @description reducers manager `accounts` accepts below actions: \
 * **ADD_ACCOUNT** `{account: Account}` \
 * **REMOVE_ACCOUNT** `{account: Account}` \
 * **UPDATE_ACCOUNT** `{account: Account}` (not a `lastAccount`, `newAccount` because `id` is immuable) \
 * **HYDRATE_ACCOUNTS** `{accounts: Account[]}`
 * @param {Account[]} state
 * @param {{type: string, ?account: Account, ?accounts: Account[]}} action
 * @returns {Account[]} always the new state
 */
export default function accountsReducers(state=ACCOUNTS_REDUCERS_INITIAL_STATE, action) {

  switch (action.type) {
    case "ADD_ACCOUNT":
      if(typeof action.account === "object") {
        return [
          ...state,
          action.account
        ];
      }
      return state;
    case "REMOVE_ACCOUNT":
      if(typeof action.account === "object") {
        return state.filter(account => (
          account.id !== action.account.id
        ));
      }
      return state;
    case "UPDATE_ACCOUNT":
      if(typeof action.account === "object") {
        return state.map(account => (
          account.id === action.account.id ? action.account: account
        ));
      }
      return state;
    case "HYDRATE_ACCOUNTS":
      if(action.accounts instanceof Array) {
        return action.accounts;
      }
      return state;

    default:
      return state;
  }

}
