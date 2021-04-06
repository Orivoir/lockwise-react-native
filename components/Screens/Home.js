import React from 'react';
import AccountList from '../AccountList';
import {connect} from 'react-redux';

const Home = ({navigation, accounts}) => {

  const onDelete = account => {
    navigation.navigate('ModalConfirmDelete', {
      account
    });
  };

  return (
    <AccountList
      accounts={accounts}
      onDelete={onDelete}
    />
  );
};

export default connect(state => ({
  accounts: state.accounts
}))(Home);
