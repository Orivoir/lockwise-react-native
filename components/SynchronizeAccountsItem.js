import React from 'react';

import {
  // prototype view components
  View,
  Text,
  Button
} from 'react-native';

const SynchronizeAccountsItem = ({
  account,
  onToggleSyncAccount
}) => {

  const [isSelectSyncAccount, setIsSelectSyncAccount] = React.useState(false);

  const onLocalToggleSelectSyncAccount = () => {
    setIsSelectSyncAccount(currentIsSelectSyncAccount => !currentIsSelectSyncAccount);
    onToggleSyncAccount({account, isSelected: !isSelectSyncAccount});
  };

  return (
    <View>
      <Text>id: {account.id}</Text>
      <Text>platform: {account.platform}</Text>
      <Text>login: {account.login}</Text>
      <Text>login URL: {account.urlLogin || "not exists"}</Text>
      {/* <CheckBox onValueChange={onToggleSelectSyncAccount} value={isSelectSyncAccount} /> */}
      <Text>is selected {isSelectSyncAccount ? "yes": "no"}</Text>
      <Button title="toggle select" onPress={onLocalToggleSelectSyncAccount} />
    </View>
  );
}

export default SynchronizeAccountsItem;
