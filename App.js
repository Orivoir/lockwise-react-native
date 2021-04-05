import React from 'react';
import { connect, useDispatch } from 'react-redux';

import {getAll, clear} from './apis/local/accounts';
import Root from './components/Root';
import {Text} from 'react-native';

import {Provider as PaperProvider} from 'react-native-paper';
import loadFixtures from './load-fixtures';

const App = ({
  accounts,
  theme
}) => {

  const dispatch = useDispatch();

  // hydrate accounts
  React.useEffect(() => {
    if(accounts instanceof Array) {
      // accounts has already hydrate
      return;
    }

    clear()
    .then(() => {
      console.log("storage clear\nstart load fixtures:");

      loadFixtures()
      .then(accountsLoad => {
        console.log("append: ",  accountsLoad.length, " accounts fixtures");
        dispatch({
          type: "HYDRATE_ACCOUNTS",
          accounts: accountsLoad
        });

        getAll()
        .then(accountsStorage => {
          console.log("total accounts storage: ", accountsStorage.length);
        });
      })
      .catch(error => {
        console.error(`load accounts fixture has fail with: ${error.message}`);
        throw new Error('loads account fixtures has fail');
      });

    });

  });

  return (
    <>
    {!accounts ? (
      <Text>Loading...</Text>
    ): (
      <PaperProvider theme={theme.value}>
        <Root />
      </PaperProvider>
    )}
    </>
  );
}

export default connect(state => ({
  accounts: state.accounts,
  theme: state.theme
}))(App);
