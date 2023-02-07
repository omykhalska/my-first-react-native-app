import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getUserData } from '../../helpers/handleFirebase';

export default function PostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);

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
        console.log(e.message);
      }
    };
    getAllPosts();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.publication}>
        <View style={styles.userDataBox}>
          <Image
            source={
              item.userAvatar
                ? { uri: item.userAvatar }
                : require('../../assets/blank-profile-picture.png')
            }
            style={styles.userAvatar}
          />
          <Text style={styles.userName}>{item.userName}</Text>
        </View>
        <Image source={{ uri: item.photo }} style={styles.picture} />
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.extraData}>
          <View>
            <TouchableOpacity
              style={{ ...styles.comments, width: 24 }}
              onPress={() => {
                navigation.navigate('Comments', { postId: item.id, postImage: item.photo });
              }}
            >
              <Feather name="message-circle" size={24} color="#BDBDBD" style={styles.messageIcon} />
              <Text style={styles.commentsCount}>{item.comments}</Text>
            </TouchableOpacity>
          </View>
          {item.location && (
            <View>
              <TouchableOpacity
                style={styles.comments}
                onPress={() => {
                  navigation.navigate('Map', { location: item.location });
                }}
              >
                <Feather name="map-pin" size={24} color="#BDBDBD" />
                <Text style={styles.location}>{item.address}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

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
  publication: {
    marginBottom: 32,
  },
  userDataBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 28,
    height: 28,
    backgroundColor: '#e8e8e8',
    borderRadius: 14,
  },
  userName: {
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 15,
    color: '#212121',
  },
  publications: {
    flex: 1,
    flexGrow: 1,
    paddingTop: 16,
  },
  picture: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
  },
  title: {
    marginTop: 8,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: '#212121',
  },
  extraData: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  comments: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageIcon: {
    transform: [{ rotateY: '180deg' }],
  },
  commentsCount: {
    marginLeft: 6,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: '#BDBDBD',
  },
  location: {
    marginLeft: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#212121',
    textDecorationLine: 'underline',
  },
});
