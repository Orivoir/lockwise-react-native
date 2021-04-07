import React from 'react';
import {connect, useDispatch} from 'react-redux';

import {clear, getAll} from './apis/local/accounts';
import Root from './components/Root';
import {Text} from 'react-native';
import NetworkInfo from '@react-native-community/netinfo';

import {Provider as PaperProvider} from 'react-native-paper';
import loadFixtures from './load-fixtures';

const App = ({accounts, theme, network}) => {
  const dispatch = useDispatch();

  // hydrate accounts
  React.useEffect(() => {
    if (accounts instanceof Array) {
      // accounts has already hydrate
      return;
    }

    getAll()
      .then(checkAccountsStorage => {
        console.log(
          'currently:',
          checkAccountsStorage.length,
          ' accounts fixtures',
        );
        dispatch({
          type: 'HYDRATE_ACCOUNTS',
          accounts: checkAccountsStorage,
        });
      })
      .catch(error => {
        console.error(`load accounts fixture has fail with: ${error.message}`);
        throw new Error('loads account fixtures has fail');
      });
  });

  React.useEffect(() => {
    const removeEventListener = NetworkInfo.addEventListener(newNetworkState => {
      if(
        newNetworkState.isConnected != network.isConnected ||
        newNetworkState.isInternetReachable != network.isInternetReachable ||
        newNetworkState.isWifiEnabled != network.isWifiEnabled ||
        newNetworkState.details?.ssid != network.details?.ssid
      ) {
        console.log("has upgrade network state");
        dispatch({
          type: "NETWORK_CHANGE",
          network: newNetworkState
        });
        }
    });

    return () => {
      removeEventListener();
    };
  });

  return (
    <>
      {!accounts ? (
        <Text>Loading...</Text>
      ) : (
        <PaperProvider theme={theme.value}>
          <Root />
        </PaperProvider>
      )}
    </>
  );
};

export default connect(state => ({
  accounts: state.accounts,
  theme: state.theme,
  network: state.network
}))(App);
