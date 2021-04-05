import React from 'react';
import { connect, useDispatch } from 'react-redux';

import {getAll} from './apis/local/accounts';
import Root from './components/Root';
import {Text} from 'react-native';

const App = ({
  accounts
}) => {

  const dispatch = useDispatch();

  React.useEffect(() => {
    getAll()
    .then(accountsStorage => {
      dispatch({
        type: "HYDRATE_ACCOUNTS",
        accounts: accountsStorage
      });
    })
    .catch(error => {
      console.error(`read accounts error: ${error.message}`);
      throw new Error('read accounts has crash');
    })
  });

  return (
    <>
    {!accounts ? (
      <Text>Loading...</Text>
    ): <Root />}
    </>
  );
}

export default connect(state => ({
  accounts: state.accounts
}))(App);
