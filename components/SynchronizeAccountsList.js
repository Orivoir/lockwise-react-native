import React from 'react';

import {
  FlatList
} from 'react-native';
import { useTheme } from 'react-native-paper';
import SynchronizeAccountsItem from './SynchronizeAccountsItem';

const SynchronizeAccountsList = ({
  accounts,
  onToggleSyncAccount
}) => {

  const {colors} = useTheme();

  return (
    <>
    <FlatList
      data={accounts}
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingVertical: 16,
        backgroundColor: colors.background
      }}
      renderItem={({item}) => (
        <SynchronizeAccountsItem
          key={item.id}
          account={item}
          onToggleSyncAccount={onToggleSyncAccount}
        />
      )}
      keyExtractor={account => account.id}
    />
      {/* {accounts.map(account => (
        <SynchronizeAccountsItem
          key={account.id}
          account={account}
          onToggleSyncAccount={onToggleSyncAccount}
        />
      ))} */}
    {/* </FlatList> */}
    </>
  );
}

export default SynchronizeAccountsList;