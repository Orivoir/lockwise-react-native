import React from 'react';
import {useWindowDimensions} from 'react-native';
import {FAB, useTheme} from 'react-native-paper';
import { connect } from 'react-redux';
import {isAvailable} from './../apis/synchronize/accounts';

import {
  SAFE_SSID
} from './../constants';

const FabSynchronize = ({network, onSynchronize}) => {

  const [isAvailableServerSync, setIsAvailableServerSync] = React.useState(false);

  const {width, height} = useWindowDimensions();
  const isAvailableNetwork = (network.isConnected && network.isInternetReachable && network.isWifiEnabled && network.details.ssid === SAFE_SSID);

  if(isAvailableNetwork) {
    isAvailable()
    .then(isSuccess => {
      setIsAvailableServerSync(isSuccess);
    })
    .catch(error => {
      console.error(`check status server sync has crash with: ${error.message}`);
      throw new Error('check status server sync has crash');
    });
  }

  const isLandscape = width >= height;

  const {colors} = useTheme();
  const iconName = isAvailableServerSync ? "database-sync": "sync-alert";
  const iconColor = isAvailableServerSync ? colors.accent: colors.error;

  const stylesPosition = !isLandscape ? {
      right: 72,
      bottom: 48,
    }: {
      right: 72,
      top: 16,
  };

  return (
    <FAB
      style={{
        position: 'absolute',
        ...stylesPosition,
        backgroundColor: iconColor
      }}
      small={false}
      icon={iconName}
      onPress={onSynchronize}
    />
  );
};

export default connect(state => ({
  network: state.network
}))(FabSynchronize);
