// <https://github.com/callstack/react-native-paper/blob/main/src/styles/DarkTheme.tsx>
import {DarkTheme} from 'react-native-paper';

const overridesProperties = {
  colors: {
    ...DarkTheme.colors,
    primary: '#1abc9c',
    accent: '#f39c12',
  },
};

export default {
  ...DarkTheme,
  ...overridesProperties,
};
