import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getUserData } from '../../helpers/handleFirebase';
import { handleError } from '../../helpers/handleError';
import { getUserAvatar } from '../../redux/auth/authSelectors';
import { useSelector } from 'react-redux';
import { Post } from '../../components/Post';

export default function PostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const userAvatar = useSelector(getUserAvatar);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const q = await query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        await onSnapshot(q, async data => {
          const posts = [];
          for (const doc of data.docs) {
            const { userName, userAvatar } = await getUserData(doc.data().userId);
            posts.push({ ...doc.data(), id: doc.id, userName, userAvatar });
          }
          setPosts(posts);
        });
      } catch (e) {
        handleError(e);
      }
    };
    getAllPosts();
  }, [userAvatar]);

  const renderItem = ({ item }) => <Post item={item} navigation={navigation} />;
  const memoizedRenderItem = useMemo(() => renderItem, [posts]);

  return (
    <View style={styles.container}>
      {posts.length > 0 ? (
        <View style={styles.publications}>
          <FlatList data={posts} renderItem={memoizedRenderItem} keyExtractor={item => item.id} />
        </View>
      ) : (
        <View style={styles.publications}>
          <Text style={{ ...styles.title, textAlign: 'center', color: '#BDBDBD' }}>
            Здесь еще нет публикаций...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    fontFamily: 'Roboto-Regular',
    backgroundColor: '#fff',
  },
  publications: {
    flex: 1,
    flexGrow: 1,
    paddingTop: 16,
  },
  title: {
    marginTop: 8,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: '#212121',
  },
});
