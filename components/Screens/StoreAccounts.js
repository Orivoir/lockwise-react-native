import React from 'react';
import AccountList from '../AccountList';
import {connect} from 'react-redux';

const StoreAccounts = ({navigation, accounts}) => {

  const onDelete = account => {
    navigation.navigate('ModalConfirmDelete', {
      account
    });
  };

  const onUpdate = account => {
    navigation.navigate('AccountEdit', {
      account
    });
  };

  return (
    // Stores account show all accounts
    <AccountList
      accounts={accounts}
      onDelete={onDelete}
      onUpdate={onUpdate}
    />
  );
};

export default connect(state => ({
  accounts: state.accounts
}))(StoreAccounts);
