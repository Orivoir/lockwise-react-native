// <https://github.com/callstack/react-native-paper/blob/main/src/styles/DefaultTheme.tsx>
import {DefaultTheme} from 'react-native-paper';

const overridesProperties = {
  colors: {
    ...DefaultTheme.colors,
    error: '#e74c3c',
    primary: '#d80073',
  },
};

export default {
  ...DefaultTheme,
  ...overridesProperties,
};
