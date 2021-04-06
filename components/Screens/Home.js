import React from 'react';
import AccountList from '../AccountList';
import {connect} from 'react-redux';

const Home = ({navigation, accounts}) => {
  return (
    <AccountList accounts={accounts} />
  );
};

export default connect(state => ({
  accounts: state.accounts
}))(Home);
