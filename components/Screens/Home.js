import React from 'react';
import AccountList from '../AccountList';
import {connect} from 'react-redux';

const Home = ({navigation, accounts}) => {

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
    <AccountList
      accounts={accounts}
      onDelete={onDelete}
      onUpdate={onUpdate}
    />
  );
};

export default connect(state => ({
  accounts: state.accounts
}))(Home);
