import React from 'react';
import {useTheme} from 'react-native-paper';
import {View} from 'react-native';
import {Card, Button, HelperText} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {remove} from './../../apis/local/accounts';

const ModalConfirmDelete = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {colors} = useTheme();

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
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        paddingHorizontal: 16,
      }}>
      <Card>
        <Card.Title
          title="Confirm delete action"
          subtitle={`Do you really want delete account ${account.platform} ?`}
        />

        <Card.Content>
          <HelperText type="error" visible={true}>
            *This action cant be reverse
          </HelperText>
        </Card.Content>

        <Card.Actions
          style={{
            justifyContent: 'space-between',
          }}>
          <Button onPress={onCancel} labelStyle={{fontSize: 18}}>
            cancel
          </Button>
          <Button
            onPress={onDelete}
            labelStyle={{fontSize: 16, color: colors.error}}>
            delete
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default ModalConfirmDelete;
