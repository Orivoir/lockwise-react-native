import { useNavigation } from '@react-navigation/core';
import React from 'react';
import {View, Button} from 'react-native';

const HeaderRight = () => {

  const navigation = useNavigation();

  const onShowAllAccounts = () => {
    navigation.navigate('StoreAccounts');
  };

  return (
    <View>
      <Button title="All accounts" onPress={onShowAllAccounts} />
    </View>
  );
}

export default HeaderRight;