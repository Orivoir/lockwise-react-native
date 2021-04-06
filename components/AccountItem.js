import React from 'react';
import {
  // prototype view component
  View,
  Text,
  Button,
  Switch
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

const AccountItem = ({account}) => {

  const onCopyPassword = () => {
    console.info("run copy password for:", account.password);
    Clipboard.setString(account.password);
  };

  return (
    <View>
      <Text>{account.platform}</Text>
      <Text>{account.login}</Text>

      <View>
        <Switch value={!!account.isFavorite}  />
        <Button title="copy password" onPress={onCopyPassword} />
        {!!account.loginUrl && (
          <Button title="open link" />
        )}
        <Button title="update" />
        <Button title="delete" />
      </View>
    </View>
  );
}

export default AccountItem;
