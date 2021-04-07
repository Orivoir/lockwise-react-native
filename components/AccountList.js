import React from 'react';
import {FlatList} from 'react-native';
import {useTheme, Card} from 'react-native-paper';
import AccountItem from './AccountItem';

const AccountList = ({accounts, onDelete, onUpdate}) => {
  const {colors} = useTheme();

  return (
    <>
      <FlatList
        style={{
          padding: 4,
          backgroundColor: colors.background,
        }}
        data={accounts}
        renderItem={({item}) => (
          <AccountItem
            account={item}
            key={item.id}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        )}
        keyExtractor={account => account.id}
      />

      {accounts.length === 0 && (
        <Card>
          <Card.Title
            title="Empty account"
            subtitle="this accounts list is currently empty"
          />
        </Card>
      )}
    </>
  );
};

export default AccountList;
