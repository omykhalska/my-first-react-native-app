import { StyleSheet, Text, View } from 'react-native';

export default function CreatePostsScreen() {
  return (
    <View style={styles.container}>
      <Text>Create Posts Screen</Text>
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
