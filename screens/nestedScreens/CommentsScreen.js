import { StyleSheet, Text, View } from 'react-native';

export default function CommentsScreen() {
  return (
    <View style={styles.container}>
      <Text>Comments Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Roboto-Regular',
  },
});
