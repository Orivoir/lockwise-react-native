import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

import {Provider as ReduxProvider} from 'react-redux';
import store from './store/index';

import App from './App';
import React from 'react';

import {enableScreens} from 'react-native-screens';

/*! NOT DEPLACE:
 * should run before mount of first React component
 * @see: <https://github.com/software-mansion/react-native-screens/tree/master/native-stack>
 */
enableScreens();

const Main = () => {
  return (
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  );
};

export default Main;

AppRegistry.registerComponent(appName, () => Main);
