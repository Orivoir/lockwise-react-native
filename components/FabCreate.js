import React from 'react';
import {FAB} from 'react-native-paper';

const FabCreate = ({onCreate}) => {
  return (
    <FAB
      style={{
        position: "absolute",
        left: 8,
        bottom: 8
      }}
      small={false}
      icon="pen-plus"
      onPress={onCreate}
    />
  );
}

export default FabCreate;