import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

import {Provider as ReduxProvider} from 'react-redux';
import store from './store/index';

import App from './App';
import React from 'react';

const Main = () => {

  return (
    <React.StrictMode>
      <ReduxProvider store={store}>
          <App />
      </ReduxProvider>
    </React.StrictMode>
  )
};

export default Main;

AppRegistry.registerComponent(appName, () => Main);
