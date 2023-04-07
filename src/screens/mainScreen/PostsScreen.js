import { StyleSheet, Text, View, FlatList, RefreshControl } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { getAllPosts } from '../../firebase';
import { getUserAvatar } from '../../redux/auth/authSelectors';
import { useSelector } from 'react-redux';
import { Post } from '../../components/Post';
import { Loader } from '../../components/Loader';
import { COLORS } from '../../constants';

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
    return (
      <Loader>
        <Text>Downloading data...</Text>
      </Loader>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.publications}>
          <FlatList
            data={posts}
            renderItem={memoizedRenderItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={({ highlighted }) => (
              <View style={[styles.separator, highlighted && { marginLeft: 0 }]} />
            )}
            ListEmptyComponent={
              <View style={styles.publications}>
                <Text
                  style={{
                    ...styles.title,
                    textAlign: 'center',
                    color: COLORS.textSecondaryColor,
                  }}
                >
                  No publications here yet...
                </Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.accentColor]}
                tintColor={COLORS.accentColor}
                title={'Refreshing...'}
              />
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    fontFamily: 'Roboto-Regular',
    backgroundColor: COLORS.bgColor,
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
    color: COLORS.textPrimaryColor,
  },
  separator: {
    width: '100%',
    height: 24,
  },
});
