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
  const [synchronizeStatus, setSynchronizeStatus] = React.useState({progess: null, value: false});
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
          navigation.navigation('Main');
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

    if(accountsSelected.length === 0) {
      console.warn('has start sync for 0 account, synchronize task has been aborted');
      return;
    }

    const findAccountFromStore = syncAccount => {
      return accounts.find(storeAccount => (
        // because synchronize server not shared same id for account :'(
        storeAccount.login === syncAccount.login &&
        storeAccount.platform === syncAccount.platform &&
        storeAccount.password === syncAccount.password &&
        storeAccount.isFavorite === syncAccount.isFavorite &&
        // because synchronize server not use same attribute name for "loginUrl"
        storeAccount.loginUrl === syncAccount.urlLogin
      ))
    };

    const endStep = stepStatus => {
      const {type, accountsSynchronized} = stepStatus;
      const ACTION_NAME = type === "update" ? "UPDATE_ACCOUNT": "ADD_ACCOUNT";

      console.log(`upgrade redux store ${type} ${ACTION_NAME} number accounts:${accountsSynchronized.length}`);

      // upgrade store
      accountsSynchronized.forEach(accountSynchronized => {
        dispatch({
          type: ACTION_NAME,
          account: accountSynchronized
        });
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

    createMultiple(accountsToCreate)
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

    updateMultiple(accountsToUpdate)
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
      <Text>{synchronizeStatus.progess}</Text>
    );
  }

  return (
    <View>
      {isPending ? (
        <Text>Loading...</Text>
      ): (
        <>
          <Text>Server sync has {numberAccounts.currnet} accounts</Text>

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
