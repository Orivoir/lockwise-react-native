import React from 'react';
import AccountList from '../AccountList';
import {connect} from 'react-redux';
import FabCreate from '../FabCreate';
import FabSynchronize from '../FabSynchronize';

const StoreAccounts = ({navigation, accounts}) => {
  const onDelete = account => {
    navigation.navigate('ModalConfirmDelete', {
      account,
    });
  };

  const onUpdate = account => {
    navigation.navigate('AccountEdit', {
      account,
    });
  };

  const onCreateAccount = () => {
    navigation.navigate('AccountEdit', {});
  };

  const onSynchronize = () => {
    navigation.navigate('Synchronize');
  };

  return (
    <>
      {/* Stores account show all accounts */}
      <AccountList
        accounts={accounts}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
      <FabSynchronize onSynchronize={onSynchronize} />
      <FabCreate onCreate={onCreateAccount} />
    </>
  );
};

export default connect(state => ({
  accounts: state.accounts,
}))(StoreAccounts);
