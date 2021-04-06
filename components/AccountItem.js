import React from 'react';
import {
  // prototype view component
  View,

  // open link component
  Linking,
} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';
import {useDispatch} from 'react-redux';
import {toggleFavorite} from './../apis/local/accounts';
import AccountMenuItem from './AccountMenuItem';
import {Switch, Card, Text, Divider} from 'react-native-paper';

/*
AccountCreate {
    platform: string,
    login: string,
    urlLogin: string | null,
    isFavorite: boolean
};

Account extends AccountCreate {
	id: number,
    createAt: number | Timestamp
};
*/

const AccountItem = ({account, onDelete, onUpdate}) => {
  const [localIsFavorite, setLocalIsFavorite] = React.useState(
    account.isFavorite,
  );

  const onCopyPassword = () => {
    console.info('run copy password for:', account.password);
    Clipboard.setString(account.password);
  };

  const onLocalDelete = () => {
    onDelete(account);
  };

  const onLocalUpdate = () => {
    onUpdate(account);
  };

  const onOpenLink = () => {
    Linking.canOpenURL(account.loginUrl)
      .then(canOpen => {
        if (canOpen) {
          Linking.openURL(account.loginUrl)
            .then(result => {
              console.log('open url task finish with status: ', result);
            })
            .catch(error => {
              console.error(`open url has crash with: ${error.message}.`);
              throw new Error('open url has crash.');
            });
        } else {
          console.warn('can open url for:', account.loginUrl);
        }
      })
      .catch(error => {
        console.error(`check can open url has crash with: ${error.message}`);
        throw new Error('check can open URL has crash.');
      });
  };

  const dispatch = useDispatch();

  const onToggleFavorite = () => {
    setLocalIsFavorite(currentLocalIsFavorite => !currentLocalIsFavorite);

    toggleFavorite(account)
      .then(accountBack => {
        if (!accountBack) {
          console.warn(
            'ask toggle favorite a account not exists into file storage',
          );
          // synchronize store with file storage
          dispatch({
            type: 'REMOVE_ACCOUNT',
            account: accountBack,
          });
        } else {
          // synchronize store with file storage
          dispatch({
            type: 'UPDATE_ACCOUNT',
            account: accountBack,
          });
        }
      })
      .catch(error => {
        console.error(
          `local api toggle favorite has crash with: ${error.message}`,
        );
        throw new Error('local api toggle favorite has crash');
      });
  };

  return (
    <Card>
      <Card.Title title={account.platform} subtitle={account.login} />

      <Card.Actions style={{justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>{localIsFavorite ? 'remove' : 'add'} favorite</Text>
          <Switch value={localIsFavorite} onValueChange={onToggleFavorite} />
        </View>

        <AccountMenuItem
          account={account}
          onOpenLink={onOpenLink}
          onCopyPassword={onCopyPassword}
          onUpdate={onLocalUpdate}
          onDelete={onLocalDelete}
        />
      </Card.Actions>

      <Divider />
    </Card>
  );
};

export default AccountItem;
