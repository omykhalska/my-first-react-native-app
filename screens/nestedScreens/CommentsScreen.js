import { useEffect, useMemo, useState } from 'react';
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
import { getUserId, getUserName } from '../../redux/auth/authSelectors';
import { AntDesign } from '@expo/vector-icons';
import USER from '../../data/user';

export default function CommentsScreen({ route }) {
  const { postId, postImage } = route.params;
  const commentOwnerName = useSelector(getUserName);
  const commentOwnerId = useSelector(getUserId);
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
        commentOwner: commentOwnerName,
        commentOwnerId,
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
      const colRef = await query(collection(docRef, 'comments'), orderBy('createdAt'));
      await onSnapshot(colRef, data => {
        setComments(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  const getDate = item => item?.createdAt?.toDate()?.toLocaleDateString() || 'Сегодня';

  const getTime = item => item?.createdAt?.toDate()?.toLocaleTimeString() || 'Только что';

  const renderItem = ({ item }) => (
    <View
      style={{
        ...styles.commentBox,
        flexDirection: item.commentOwnerId === commentOwnerId ? 'row-reverse' : 'row',
      }}
    >
      <View
        style={{
          marginLeft: item.commentOwnerId === commentOwnerId ? 16 : 0,
          marginRight: item.commentOwnerId === commentOwnerId ? 0 : 16,
        }}
      >
        <Image source={{ uri: USER.avatar }} style={styles.avatar} />
      </View>
      <View style={styles.comment}>
        <Text>{item.commentText}</Text>
        <Text
          style={{
            alignSelf: item.commentOwnerId === commentOwnerId ? 'flex-start' : 'flex-end',
            ...styles.commentDate,
          }}
        >{`${getDate(item)} | ${getTime(item)}`}</Text>
      </View>
    </View>
  );
  const memoizedRenderItem = useMemo(() => renderItem, [comments]);

  return (
    <View style={styles.container}>
      <View>
        <Image source={{ uri: postImage }} style={styles.picture} />
      </View>
      <View style={styles.commentsArea}>
        <FlatList data={comments} renderItem={memoizedRenderItem} keyExtractor={item => item.id} />
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
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  comment: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 16,
    borderRadius: 6,
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#212121',
  },
  commentDate: {
    marginTop: 8,
    fontSize: 10,
    lineHeight: 12,
    color: '#BDBDBD',
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
  avatar: {
    width: 28,
    height: 28,
    backgroundColor: '#e8e8e8',
    borderRadius: 14,
  },
});
