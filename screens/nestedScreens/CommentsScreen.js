import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getUserName } from '../../redux/auth/authSelectors';
import { useState } from 'react';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function CommentsScreen({ navigation, route }) {
  const { postId } = route.params;
  const commentOwner = useSelector(getUserName);
  const [commentText, setCommentText] = useState('');

  const createPost = async () => {
    try {
      const docRef = doc(db, 'posts', postId);
      const colRef = collection(docRef, 'comments');
      await addDoc(colRef, {
        commentText,
        commentOwner,
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        multiline={true}
        style={styles.textArea}
        placeholder="useless placeholder"
        onChangeText={setCommentText}
        value={commentText}
      />
      <TouchableOpacity
        onPress={() => {
          setCommentText('');
          createPost();
          navigation.navigate('Posts');
        }}
        activeOpacity={0.8}
        style={styles.submitBtn}
      >
        <Text style={styles.buttonText}>Отправить</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 32,
    fontFamily: 'Roboto-Regular',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 200,
    marginTop: 16,
    padding: 16,
    backgroundColor: 'transparent',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E8E8E8',
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
  },
  submitBtn: {
    marginVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#FF6C00',
    borderRadius: 100,
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#FFF',
  },
});
