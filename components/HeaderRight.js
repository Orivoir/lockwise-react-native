import { useNavigation } from '@react-navigation/core';
import React from 'react';
import {View} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import { useDispatch } from 'react-redux';

const HeaderRight = () => {

  const navigation = useNavigation();

  const onShowAllAccounts = () => {
    navigation.navigate('StoreAccounts');
  };

  const dispatch = useDispatch();

  const onToggleTheme = () => {
    dispatch({
      type: "TOGGLE_THEME"
    });
  };

  const {colors} = useTheme();

  return (
    <View
      style={{
        flexDirection: "row"
      }}
    >
      <IconButton
        icon="archive"
        size={32}
        onPress={onShowAllAccounts}
        color={colors.primary}
      />
      <IconButton
        icon="theme-light-dark"
        size={32}
        onPress={onToggleTheme}
        color={colors.primary}
      />
    </View>
  );
}

export default HeaderRight;