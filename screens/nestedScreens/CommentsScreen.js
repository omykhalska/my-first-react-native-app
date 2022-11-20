import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getUserName } from '../../redux/auth/authSelectors';
import { AntDesign, Ionicons } from '@expo/vector-icons';

export default function CommentsScreen({ navigation, route }) {
  const { postId, postImage } = route.params;
  const commentOwner = useSelector(getUserName);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getAllComments();
  }, []);

  const createComment = async () => {
    try {
      const docRef = doc(db, 'posts', postId);
      const colRef = collection(docRef, 'comments');
      await addDoc(colRef, {
        commentText,
        commentOwner,
        createdAt: serverTimestamp(),
      });
      await updateDoc(docRef, { comments: comments.length + 1 });
    } catch (e) {
      console.log(e.message);
    }
  };

  const getAllComments = async () => {
    try {
      const docRef = doc(db, 'posts', postId);
      const colRef = await query(collection(docRef, 'comments'), orderBy('createdAt', 'desc'));
      await onSnapshot(colRef, data => {
        setComments(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image source={{ uri: postImage }} style={styles.picture} />
      </View>
      <View style={styles.commentsArea}>
        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <View style={styles.commentBox}>
              <Text>{item.commentText}</Text>
              <Text>{item.createdAt.toDate().toLocaleString('ru-Ru')}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
      <View>
        <TextInput
          style={{ ...styles.textArea, ...styles.shadow }}
          placeholder="Комментировать..."
          onChangeText={setCommentText}
          value={commentText}
        />

        <View style={{ ...styles.submitBtn, ...styles.shadow }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              createComment().then(() => setCommentText(''));
              navigation.navigate('Posts');
            }}
          >
            <AntDesign name="arrowup" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    fontFamily: 'Roboto-Regular',
    backgroundColor: '#fff',
  },
  picture: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
  },
  commentsArea: {
    flex: 1,
    marginTop: 30,
  },
  commentBox: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'blue',
  },

  textArea: {
    marginTop: 30,
    marginBottom: 16,
    height: 50,
    padding: 16,
    paddingRight: 40,
    backgroundColor: '#F6F6F6',
    borderRadius: 100,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: '#BDBDBD',
  },
  submitBtn: {
    position: 'absolute',
    right: 10,
    top: 38,
    width: 34,
    height: 34,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6C00',
    borderRadius: 17,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
});
