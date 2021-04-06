import React from 'react';
import {Menu, IconButton, useTheme} from 'react-native-paper';

const AccountMenuItem = ({
  account,
  onOpenLink,
  onCopyPassword,
  onUpdate,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openMenuRenderer = React.useRef(
    <IconButton icon="dots-horizontal" size={32} onPress={() => setIsOpen(true)} />
  ).current;

  const onClose = () => setIsOpen(false);

  const onLocalUpdate = () => {
    onClose();
    onUpdate();
  };

  const onLocalDelete = () => {
    onClose();
    onDelete();
  };

  const onLocalCopyPassword = () => {
    onClose();
    onCopyPassword();
  };

  const onLocalOpenLink = () => {
    onClose();
    onOpenLink();
  };

  const {colors} = useTheme();

  return (
    <Menu visible={isOpen} onDismiss={onClose} anchor={openMenuRenderer}>
      <Menu.Item
        title="copy password"
        titleStyle={styles.item}
        onPress={onLocalCopyPassword}
        icon="content-copy"
      />

      <Menu.Item
        title="open link"
        titleStyle={styles.item}
        onPress={onLocalOpenLink}
        disabled={!account.loginUrl}
        icon="open-in-new"
      />

      <Menu.Item
        title="update"
        titleStyle={styles.item}
        onPress={onLocalUpdate}
        icon="pencil"
      />

      <Menu.Item
        title="delete"
        titleStyle={{
          color: colors.error,
          ...styles.item,
        }}
        onPress={onLocalDelete}
        icon="delete"
      />
    </Menu>
  );
};

export default AccountMenuItem;

const styles = {
  item: {
    fontSize: 20,
  },
};
