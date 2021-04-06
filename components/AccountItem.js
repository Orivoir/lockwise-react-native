import React from 'react';
import {
  // prototype view component
  View,
  Text,
  Button,
  Switch,

  // open link component
  Linking
} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';

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

const AccountItem = ({
  account,
  onDelete,
  onUpdate
}) => {

  const onCopyPassword = () => {
    console.info("run copy password for:", account.password);
    Clipboard.setString(account.password);
  };

  const onLocalDelete = () => {
    onDelete(account)
  };

  const onLocalUpdate= () => {
    onUpdate(account);
  };

  const onOpenLink = () => {
    Linking.canOpenURL(account.loginUrl)
    .then(canOpen => {

      if(canOpen) {
        Linking.openURL(account.loginUrl)
        .then(result => {
          console.log("open url task finish with status: ", result);
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

  return (
    <View>
      <Text>{account.platform}</Text>
      <Text>{account.login}</Text>

      <View>
        <Switch value={!!account.isFavorite}  />
        <Button title="copy password" onPress={onCopyPassword} />

        {!!account.loginUrl && (
          <Button title="open link" onPress={onOpenLink} />
        )}

        <Button title="update" onPress={onLocalUpdate} />
        <Button title="delete" onPress={onLocalDelete} />
      </View>
    </View>
  );
}

export default AccountItem;
