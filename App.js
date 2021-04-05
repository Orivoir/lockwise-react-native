import React from 'react';

import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import AccountDetails from './components/Screens/AccountDetails';
import AccountEdit from './components/Screens/AccountEdit';
import Home from './components/Screens/Home';
import ModalConfirmDelete from './components/Screens/ModalConfirmDelete';
import StoreAccounts from './components/Screens/StoreAccounts';

const MainStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const MainStackRouting = () => {
  return (
    <MainStack.Navigator initialRouteName="Home">
      <MainStack.Screen name="Home" component={Home} />
      <MainStack.Screen name="AccountEdit" component={AccountEdit} />
      <MainStack.Screen name="StoreAccounts" component={StoreAccounts} />
      <MainStack.Screen name="AccountDetails" component={AccountDetails} />
    </MainStack.Navigator>
  );
};

const App = () => {
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

export default App;
