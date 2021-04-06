import React from 'react';
import {View, Text, Button} from 'react-native';
import {useDispatch} from 'react-redux';

import {remove} from './../../apis/local/accounts';

const ModalConfirmDelete = ({route, navigation}) => {
  const dispatch = useDispatch();

  const {account} = route.params;

  if (!account) {
    console.warn('Oops, call ModalConfirmDelete with empty account');
    navigation.navigate('Home');
    return <></>;
  }

  const onCancel = () => {
    navigation.goBack();
  };

  const onDelete = () => {
    remove(account)
      .then(accountRemoved => {
        if (!accountRemoved) {
          console.warn(
            'Oops, account ask remove not exists into storage for: ',
            account,
          );
        } else {
          console.info('account ', account.id, ' has been remove into storage');
        }

        dispatch({
          type: 'REMOVE_ACCOUNT',
          account,
        });

        navigation.goBack();
      })
      .catch(error => {
        console.error(
          `apis local has fail remove account for: "${account.id}" with: ${error.message}`,
        );
        throw new Error('storage remove account has crash');
      });
  };

  return (
    <View>
      <View>
        <Text>Confirm delete action</Text>
        <Text>Do you really want delete account {account.platform} ?</Text>
        <Text>This action cant be reverse.</Text>
      </View>

      <View>
        <Button title="cancel" onPress={onCancel} />
        <Button title="delete" onPress={onDelete} />
      </View>
    </View>
  );
};

export default ModalConfirmDelete;
