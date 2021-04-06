import React from 'react';
import { ScrollView } from 'react-native';
import AccountItem from './AccountItem';

const AccountList = ({
  accounts,
  onDelete
}) => {
  return (
    <ScrollView>
      {accounts.map(account => (
        <AccountItem
          account={account}
          key={account.id}
          onDelete={onDelete}
        />
      ))}
    </ScrollView>
  );
}

export default AccountList;