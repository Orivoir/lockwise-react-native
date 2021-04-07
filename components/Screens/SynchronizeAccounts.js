import React from 'react';

import {getCount,isAvailable as isAvailableServerSync,getAll} from './../../apis/synchronize/accounts'
import {createMultiple, updateMultiple} from './../../apis/local/accounts';

import {
  // prototype view components
  View,
  Text,
  Button
} from 'react-native';
import SynchronizeAccountsList from '../SynchronizeAccountsList';
import { useFocusEffect } from '@react-navigation/core';
import { connect, useDispatch } from 'react-redux';

const SynchronizeAccounts = ({navigation, accounts}) => {

  const [isPending, setIsPending] = React.useState(true);
  const [synchronizeStatus, setSynchronizeStatus] = React.useState({progress: null, value: false});
  const [accountsSelected, setAccountsSelected] = React.useState([]);

  const numberAccounts = React.useRef(null);
  const syncAccounts = React.useRef(null);

  const onLoad = () => {
    getCount()
    .then(({count}) => {
      console.info('server has', count, 'account')
      getAll(count)
      .then(fetchAccounts => {
        numberAccounts.current = count;
        syncAccounts.current = fetchAccounts;
        setIsPending(false);
      })
      .catch(error => {
        console.error("fetch all accounts has crash with:", error.message);
        throw new Error('fetch all account has crash');
      })
    })
    .catch(error => {
      console.error("fetch count has crash with:", error.message);
      throw new Error('fetch count has crash');
    });
  };

  useFocusEffect(() => {

    if(!numberAccounts.current && !syncAccounts.current) {
      isAvailableServerSync()
      .then(isAvailable => {
        if(isAvailable) {
          console.info('server sync always available');
          onLoad();
        } else {
          navigation.navigate('Main');
        }
      })
      .catch(error => {
        console.error(`verify status server sync has crash with: ${error.message}`);
        throw new Error('verify status server sync has crash');
      });
    }

  });

  const onReload = () => {
    setIsPending(true);
    onLoad();
  };

  const onToggleSyncAccount = ({account, isSelected}) => {
    if(isSelected) {
      setAccountsSelected(currentAccountsSelected => ([
        ...currentAccountsSelected,
        account
      ]));
    } else {
      setAccountsSelected(currentAccountsSelected => (
        currentAccountsSelected.filter(currentAccountSelected => currentAccountSelected.id !== account.id)
      ));
    }
  };

  const dispatch = useDispatch();
  const onStartSynchronizeAccount = () => {

    if(synchronizeStatus.value) {
      console.warn('already into sync action');
      return;
    }

    if(accountsSelected.length === 0) {
      console.warn('has start sync for 0 account, synchronize task has been aborted');
      return;
    }
    setSynchronizeStatus({
      value: true,
      progress: 0
    });

    const findAccountFromStore = syncAccount => {
      return accounts.find(storeAccount => (
        // because synchronize server not shared same id for account :'(
        storeAccount.login === syncAccount.login &&
        storeAccount.platform === syncAccount.platform
      ))
    };

    let steps = 0;

    const endStep = stepStatus => {
      steps++;
      const {type, accountsSynchronized} = stepStatus;
      const ACTION_NAME = type === "update" ? "UPDATE_MULTIPLE_ACCOUNTS": "ADD_MULTIPLE_ACCOUNTS";

      console.log(`upgrade redux store ${type} ${ACTION_NAME} number accounts:${accountsSynchronized.length}`);

      // accountsSynchronized.forEach(accountSynchronized => {
        // upgrade store
        dispatch({
          type: ACTION_NAME,
          accounts: accountsSynchronized
        });
      // });

      if(steps === 2) {
        // have finish synchronize with upgrade and create
        console.log("> finish sync");
        setSynchronizeStatus({
          value: false,
          progress: null
        });
        setAccountsSelected([]);
      }
    };

    const onProgressSynchronize = () => {
      setSynchronizeStatus(currentSynchronizeStatus => {
        console.log(`> sync progress: ${currentSynchronizeStatus.progress + 1}/${(accountsToUpdate.length)+(accountsToCreate.length)}`);
        return {
          value: currentSynchronizeStatus.value,
          progress: currentSynchronizeStatus.progress + 1
        };
      });
    };

    const accountsToCreate = [];
    const accountsToUpdate = [];

    console.info('> start accounts group by:')
    // accounts group by
    accountsSelected.forEach(accountSelected => {
      const cloneAccountIntoStore = findAccountFromStore(accountSelected);

      const accountCloned = {
        login: accountSelected.login,
        platform: accountSelected.platform,
        password: accountSelected.password,
        isFavorite: accountSelected.isFavorite,
        loginUrl: accountSelected.urlLogin
      };

      if(cloneAccountIntoStore) {
        accountsToUpdate.push({
          ...accountCloned,
          // because update a account already exists into store
          id: cloneAccountIntoStore.id
        });
      } else {
        accountsToCreate.push(accountCloned);
      }
    });

    console.info('> to update: ', accountsToUpdate.length);
    console.info('> to create: ', accountsToCreate.length);
    console.info('> start synchronize:');

    createMultiple(accountsToCreate, onProgressSynchronize)
    .then(accountsToCreateBack => {
      console.log(`> has synchronize with create: ${accountsToCreateBack.length}/${accountsToCreate.length} accounts`);
      endStep({
        type: "create",
        accountsSynchronized: accountsToCreateBack
      });
    })
    .catch(error => {
      console.error("sycnhronize create multiple has fail with status:", error);
      throw new Error("sycnhronize create multiple has fail");
    });

    updateMultiple(accountsToUpdate, onProgressSynchronize)
    .then(accountToUpdateBack => {
      console.log(`> has synchronize with update ${accountToUpdateBack.length}/${accountsToUpdate.length} accounts`);
      endStep({
        type: "update",
        accountsSynchronized: accountToUpdateBack
      });
    })
    .catch(error => {
      console.error("sycnhronize update multiple has fail with status:", error);
      throw new Error("sycnhronize update multiple has fail");
    });

  };

  if(synchronizeStatus.value) {
    return (
      <Text>{synchronizeStatus.progress}</Text>
    );
  }

  return (
    <View>
      {isPending ? (
        <Text>Loading...</Text>
      ): (
        <>
          <Text>Server sync has {numberAccounts.current} accounts</Text>

          <View>
            <Button onPress={onStartSynchronizeAccount} title={`synchronize ${accountsSelected.length}/${syncAccounts.current.length} accounts`} />
          </View>

          <View>
            <Button title="reload" onPress={onReload} />
          </View>

          <SynchronizeAccountsList accounts={syncAccounts.current} onToggleSyncAccount={onToggleSyncAccount} />
        </>
      )}
    </View>
  );
}

export default connect(state => ({
  accounts: state.accounts
}))(SynchronizeAccounts);
