import { ActivityIndicator, StyleSheet, View } from 'react-native';

export const Loader = ({ style = {}, children }) => (
  <View style={styles.loadingIndicator}>
    <ActivityIndicator size="large" color="#FF6C00" style={style} />
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
