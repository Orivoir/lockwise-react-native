import React from 'react';

import {Checkbox, Card, Text} from 'react-native-paper';

const SynchronizeAccountsItem = ({account, onToggleSyncAccount}) => {
  const [isSelectSyncAccount, setIsSelectSyncAccount] = React.useState(false);

  const onLocalToggleSelectSyncAccount = () => {
    setIsSelectSyncAccount(
      currentIsSelectSyncAccount => !currentIsSelectSyncAccount,
    );
    onToggleSyncAccount({account, isSelected: !isSelectSyncAccount});
  };

  return (
    <Card
      style={{
        marginVertical: 4,
      }}>
      <Card.Title title={account.platform} subtitle={account.login} />

      <Card.Content />

      <Card.Actions>
        <Text>Synchronize</Text>
        <Checkbox.Android
          status={isSelectSyncAccount ? 'checked' : 'unchecked'}
          onPress={onLocalToggleSelectSyncAccount}
        />
      </Card.Actions>
      {/* <Text>id: {account.id}</Text> */}
      {/* <Text>platform: {account.platform}</Text> */}
      {/* <Text>login: {account.login}</Text> */}
      {/* <Text>login URL: {account.urlLogin || "not exists"}</Text> */}
      {/* <CheckBox onValueChange={onToggleSelectSyncAccount} value={isSelectSyncAccount} /> */}
      {/* <Text>is selected {isSelectSyncAccount ? "yes": "no"}</Text> */}
      {/* <Button title="toggle select" onPress={onLocalToggleSelectSyncAccount} /> */}
    </Card>
  );
};

export default SynchronizeAccountsItem;
