import React from 'react';

import {update, create} from './../../apis/local/accounts';

import {View} from 'react-native';

import {
  Button,
  Headline,
  HelperText,
  TextInput,
  useTheme,
} from 'react-native-paper';

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

  const isValidFields = () => {
    // loginUrl is optional field
    const {password, login, platform} = fields.current;

    return (
      password.length >= 2 &&
      password.length <= 255 &&
      login.length >= 2 &&
      login.length <= 255 &&
      platform.length >= 2 &&
      platform.length <= 255
    );
  };

  const [isVisibleError, setIsVisibleError] = React.useState(false);

  const onSubmit = () => {
    const isValid = isValidFields();

    if (!isValid) {
      setIsVisibleError(true);
    } else {
      setIsVisibleError(false);
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
    }
  };

  const {colors} = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}>
      <Headline>{actionType} account</Headline>

      <HelperText type="error" visible={isVisibleError}>
        field.s is invalid.
      </HelperText>

      <View
        style={{
          flex: 1,
          justifyContent: 'space-evenly',
          // backgroundColor: "red"
        }}>
        <View>
          <TextInput
            autoCorrect={false}
            autoFocus={false}
            onFocus={() => setIsVisibleError(false)}
            mode="flat"
            label="Platform"
            defaultValue={defaultValue.platform}
            onChangeText={newText => (fields.current.platform = newText)}
          />
        </View>
        <View>
          <TextInput
            autoCorrect={false}
            autoFocus={false}
            onFocus={() => setIsVisibleError(false)}
            mode="flat"
            label="Login"
            defaultValue={defaultValue.login}
            onChangeText={newText => (fields.current.login = newText)}
          />
        </View>
        <View>
          <TextInput
            autoCorrect={false}
            autoFocus={false}
            onFocus={() => setIsVisibleError(false)}
            mode="flat"
            label="Login URL"
            defaultValue={defaultValue.loginUrl}
            onChangeText={newText => (fields.current.loginUrl = newText)}
          />
          <HelperText type="info">
            should be format: "http://" or "https://" URL
          </HelperText>
        </View>
        <View>
          <TextInput
            autoCorrect={false}
            autoFocus={false}
            onFocus={() => setIsVisibleError(false)}
            mode="flat"
            label="Password"
            secureTextEntry
            defaultValue={defaultValue.password}
            onChangeText={newText => (fields.current.password = newText)}
          />
        </View>
        <View>
          <Button mode="contained" onPress={onSubmit}>
            {actionType} account
          </Button>
        </View>
      </View>
    </View>
  );
};

export default AccountEdit;
