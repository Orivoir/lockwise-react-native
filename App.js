import React from 'react';

import {createNativeStackNavigator} from 'react-native-screens/native-stack';

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
    <RootStack.Navigator mode="modal">
      <RootStack.Screen name="Main" component={MainStackRouting} />

      <RootStack.Screen
        name="ModalConfirmDelete"
        component={ModalConfirmDelete}
      />
    </RootStack.Navigator>
  );
};

export default App;
