import React from 'react';
import { ScrollView } from 'react-native';
import AccountItem from './AccountItem';

const AccountList = ({
  accounts
}) => {
  return (
    <ScrollView>
      {accounts.map(account => (
        <AccountItem account={account} key={account.id} />
      ))}
    </ScrollView>
  );
}

export default AccountList;