import { StyleSheet, Text, View, FlatList, RefreshControl } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { getAllPosts } from '../../helpers/handleFirebase';
import { getUserAvatar } from '../../redux/auth/authSelectors';
import { useSelector } from 'react-redux';
import { Post } from '../../components/Post';
import { Loader } from '../../components/Loader';

export default function PostsScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(null);
  const userAvatar = useSelector(getUserAvatar);

  useEffect(() => {
    getAllPosts(setPosts);
  }, [userAvatar]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllPosts(setPosts);
    setRefreshing(false);
  };

  const renderItem = ({ item }) => <Post item={item} navigation={navigation} />;
  const memoizedRenderItem = useMemo(() => renderItem, [posts]);

  if (posts === null) {
    return <Loader />;
  } else {
    return (
      <View style={styles.container}>
        {posts.length > 0 ? (
          <View style={styles.publications}>
            <FlatList
              data={posts}
              renderItem={memoizedRenderItem}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#FF6C00']}
                  tintColor={'#FF6C00'}
                  title={'Refreshing...'}
                />
              }
            />
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
