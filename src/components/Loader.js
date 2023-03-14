import { ActivityIndicator, StyleSheet } from 'react-native';

export const Loader = ({ style = {} }) => (
  <ActivityIndicator
    size="large"
    color="#FF6C00"
    style={{ ...styles.loadingIndicator, ...style }}
  />
);

const styles = StyleSheet.create({
  loadingIndicator: {
    zIndex: 1000,
    width: '100%',
    height: '100%',
  },
});
