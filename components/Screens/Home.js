import React from 'react';
import AccountList from '../AccountList';
import {connect} from 'react-redux';
import FabCreate from '../FabCreate';
import FabSynchronize from '../FabSynchronize';

const Home = ({navigation, accounts}) => {
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
      {/* Home screen show only favorite account */}
      <AccountList
        accounts={accounts.filter(account => account.isFavorite)}
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
}))(Home);
