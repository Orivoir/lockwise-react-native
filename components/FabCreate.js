import React from 'react';
import {useWindowDimensions} from 'react-native';
import {FAB} from 'react-native-paper';

const FabCreate = ({onCreate}) => {
  const {width, height} = useWindowDimensions();

  const isLandscape = width >= height;

  const stylesPosition = !isLandscape
    ? {
        right: 8,
        bottom: 48,
      }
    : {
        right: 8,
        top: 16,
      };

  return (
    <FAB
      style={{
        position: 'absolute',
        ...stylesPosition,
      }}
      small={false}
      icon="pen-plus"
      onPress={onCreate}
    />
  );
};

export default FabCreate;
