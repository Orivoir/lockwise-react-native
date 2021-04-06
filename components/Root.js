import React from 'react';

import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import AccountDetails from './Screens/AccountDetails';
import AccountEdit from './Screens/AccountEdit';
import Home from './Screens/Home';
import ModalConfirmDelete from './Screens/ModalConfirmDelete';
import StoreAccounts from './Screens/StoreAccounts';
import HeaderRight from './HeaderRight';
import { useTheme } from 'react-native-paper';

const MainStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const MainStackRouting = () => {

  const {colors} = useTheme();

  return (
    <MainStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerRight: HeaderRight,
        headerStyle: {
          backgroundColor: colors.background
        },
        headerTitleStyle: {
          color: colors.text
        }
      }}>
      <MainStack.Screen name="Home" component={Home} />
      <MainStack.Screen name="AccountEdit" component={AccountEdit} />
      <MainStack.Screen name="StoreAccounts" component={StoreAccounts} />
      <MainStack.Screen name="AccountDetails" component={AccountDetails} />
    </MainStack.Navigator>
  );
};

const Root = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        mode="modal"
        screenOptions={{headerShown: false}}>
        <RootStack.Screen name="Main" component={MainStackRouting} />

        <RootStack.Screen
          name="ModalConfirmDelete"
          component={ModalConfirmDelete}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Root;
