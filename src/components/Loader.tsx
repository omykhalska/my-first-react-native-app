import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants';
import { ReactNode } from 'react';

interface IProps {
  size?: 'small' | 'large';
  style?: {};
  children?: ReactNode;
}

export const Loader = ({ size = 'large', style = {}, children }: IProps) => (
  <View style={styles.loadingIndicator}>
    <ActivityIndicator size={size} color={COLORS.accentColor} style={style} />
    {children}
  </View>
);

const styles = StyleSheet.create({
  loadingIndicator: {
    zIndex: 100,
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
