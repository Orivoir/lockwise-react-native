import React from 'react';

import {
  // prototype view components
  View,
  Text,
  Button,
  ScrollView
} from 'react-native';
import SynchronizeAccountsItem from './SynchronizeAccountsItem';

const SynchronizeAccountsList = ({
  accounts,
  onToggleSyncAccount
}) => {

  return (
    <ScrollView>
      {accounts.map(account => (
        <SynchronizeAccountsItem
          key={account.id}
          account={account}
          onToggleSyncAccount={onToggleSyncAccount}
        />
      ))}
    </ScrollView>
  );
}

export default SynchronizeAccountsList;