import React from 'react';
import {Menu, Button} from 'react-native-paper';

const AccountMenuItem = ({
  account,
  onOpenLink,
  onCopyPassword,
  onUpdate,
  onDelete
}) => {

  const [isOpen, setIsOpen] = React.useState(false);

  const openMenuRenderer = React.useRef(
    <Button
      mode="text"
      onPress={() => setIsOpen(true)}
    >
      open menu
    </Button>
  ).current;

  const onClose = () => (
    setIsOpen(false)
  );

  const onLocalUpdate = () => {
    onClose();
    onUpdate();
  };

  const onLocalDelete = () => {
    onClose();
    onDelete()
  };

  const onLocalCopyPassword = () => {
    onClose();
    onCopyPassword();
  };

  const onLocalOpenLink = () => {
    onClose();
    onOpenLink();
  };

  return (
    <Menu
      visible={isOpen}
      onDismiss={onClose}
      anchor={openMenuRenderer}
    >
      <Menu.Item title="copy password" onPress={onLocalCopyPassword} />

      {!!account.loginUrl && (
        <Menu.Item title="open link" onPress={onLocalOpenLink} />
      )}

      <Menu.Item title="update" onPress={onLocalUpdate} />

      <Menu.Item title="delete" onPress={onLocalDelete} />
    </Menu>
  );
}

export default AccountMenuItem;