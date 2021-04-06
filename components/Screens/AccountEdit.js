import React from 'react';

import {update, create} from './../../apis/local/accounts';

import {
  // components for prototype view
  View,
  Text,
  TextInput,
  Button,
} from 'react-native';
import {useDispatch} from 'react-redux';

const AccountEdit = ({route, navigation}) => {
  const {account} = route.params;

  const actionType = React.useRef(account ? 'update' : 'create').current;

  const defaultValue = React.useRef({
    login: account?.login || '',
    password: account?.password || '',
    platform: account?.platform || '',
    loginUrl: account?.loginUrl || '',
  }).current;

  const fields = React.useRef({
    login: defaultValue.login,
    password: defaultValue.password,
    platform: defaultValue.platform,
    loginUrl: defaultValue.loginUrl,
  });

  const dispatch = useDispatch();

  const onSubmit = () => {
    const fx = actionType === 'update' ? update : create;

    // during update should give the account ID target
    // not give `last account`, `new account` because `id` property
    // is immuable
    const param =
      actionType === 'create'
        ? fields.current
        : {
            ...account, // original properties (contains id)
            ...fields.current, // override properties
          };

    fx(param)
      .then(accountBack => {
        if (!accountBack) {
          if (actionType === 'create') {
            // fields invalid
            console.warn('create account reject fields invalid');
          } else {
            console.warn(
              'Oops, has ask update a account not exists from the storage',
            );
            // synchronize store with the storage
            dispatch({
              type: 'REMOVE_ACCOUNT',
              account,
            });

            navigation.goBack();
          }
        } else {
          console.info('action FormEdit success with:', accountBack);
          // synchronize store with the storage
          const ACTION_NAME =
            actionType === 'update' ? 'UPDATE_ACCOUNT' : 'ADD_ACCOUNT';

          dispatch({
            type: ACTION_NAME,
            account: accountBack,
          });

          navigation.goBack();
        }
      })
      .catch(error => {
        console.error(
          `storage edit account for action ${actionType} has crash with: ${error.message}`,
        );
        throw new Error('storage call from FormEdit has crash');
      });
  };

  return (
    <View>
      <Text>{actionType} account</Text>

      <View>
        <View>
          <Text>Platform</Text>
          <TextInput
            defaultValue={defaultValue.platform}
            onChangeText={newText => (fields.current.platform = newText)}
          />
        </View>
        <View>
          <Text>Login</Text>
          <TextInput
            defaultValue={defaultValue.login}
            onChangeText={newText => (fields.current.login = newText)}
          />
        </View>
        <View>
          <Text>Login URL</Text>
          <TextInput
            defaultValue={defaultValue.loginUrl}
            onChangeText={newText => (fields.current.loginUrl = newText)}
          />
        </View>
        <View>
          <Text>Password</Text>
          <TextInput
            secureTextEntry
            defaultValue={defaultValue.password}
            onChangeText={newText => (fields.current.password = newText)}
          />
        </View>
        <View>
          <Button title={actionType} onPress={onSubmit} />
        </View>
      </View>
    </View>
  );
};

export default AccountEdit;
