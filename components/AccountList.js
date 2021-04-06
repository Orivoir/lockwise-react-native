import React from 'react';
import {FlatList, Text} from 'react-native';
import {useTheme} from 'react-native-paper';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
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
        <Text>this accounts list is currently empty</Text>
      )}
    </>
  );
};

export default AccountList;
