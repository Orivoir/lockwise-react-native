import React from 'react';
import { ScrollView } from 'react-native';
import AccountItem from './AccountItem';

const AccountList = ({
  accounts,
  onDelete,
  onUpdate,
  onToggleFavorite
}) => {
  return (
    <ScrollView>
      {accounts.map(account => (
        <AccountItem
          account={account}
          key={account.id}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ScrollView>
  );
}

export default AccountList;