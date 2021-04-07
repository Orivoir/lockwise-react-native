import React from 'react';

import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import AccountEdit from './Screens/AccountEdit';
import Home from './Screens/Home';
import ModalConfirmDelete from './Screens/ModalConfirmDelete';
import StoreAccounts from './Screens/StoreAccounts';
import SynchronizeAccounts from './Screens/SynchronizeAccounts';

import HeaderRight from './HeaderRight';
import {useTheme} from 'react-native-paper';

const MainStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();
const SynchronizeStack = createNativeStackNavigator();

const SynchronizeRouting = () => {

  return (
    <SynchronizeStack.Navigator
      initialRouteName="SynchronizeAccounts"
    >
      {/* recheck synchronize server status before operation because HTTP connection not listen disconnect  */}
      {/* if synchronize server is available fetch and show list accounts account into synchronize server with a select list */}
      {/* add option synchronize for a single account and synchronize all */}
      <SynchronizeStack.Screen name="SynchronizeAccounts" component={SynchronizeAccounts} />
    </SynchronizeStack.Navigator>
  )
};

const MainStackRouting = () => {
  const {colors} = useTheme();

  return (
    <MainStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerRight: HeaderRight,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
        },
      }}>
      <MainStack.Screen name="Home" options={{headerTitle: "Favorites"}} component={Home} />
      <MainStack.Screen name="AccountEdit" options={{headerTitle: "Edit"}} component={AccountEdit} />
      <MainStack.Screen name="StoreAccounts" options={{headerTitle: "Accounts"}} component={StoreAccounts} />
    </MainStack.Navigator>
  );
};

const Root = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal" screenOptions={{headerShown: false}}>
        <RootStack.Screen name="Main" component={MainStackRouting} />

        <RootStack.Screen name="Synchronize" component={SynchronizeRouting} />

        <RootStack.Screen
          name="ModalConfirmDelete"
          component={ModalConfirmDelete}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Root;
