import { AntDesign, Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  StatusBar,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
} from 'react-native';

import POSTS from '../../data/posts';
import USER from '../../data/user';

export default function ProfileScreen() {
  const [posts, setPosts] = useState(POSTS);
  const [user, setUser] = useState(USER);

  const renderItem = item => (
    <View style={styles.publication} key={item.id}>
      <Image source={{ uri: item.url }} style={styles.picture} />
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.extraData}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.extraDataInnerBox}>
            <Image
              source={require('../../assets/icons/message-circle.png')}
              style={{ width: 24, height: 24 }}
            />
            <Text style={styles.extraDataText}>{item.comments.length}</Text>
          </View>
          <View style={{ ...styles.extraDataInnerBox, marginLeft: 24 }}>
            <Feather name="thumbs-up" size={24} color="#FF6C00" />
            <Text style={styles.extraDataText}>{item.likes}</Text>
          </View>
        </View>
        <View style={styles.extraDataInnerBox}>
          <Feather name="map-pin" size={24} color="#BDBDBD" />
          <Text style={{ ...styles.extraDataText, textDecorationLine: 'underline' }}>
            {item.location}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ImageBackground source={require('../../assets/bg-image.jpg')} style={styles.image}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.contentBox}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Image source={{ uri: user.avatar }} style={styles.image} />
              </View>
              <TouchableOpacity activeOpacity={0.8} style={styles.buttonIcon} onPress={() => {}}>
                <AntDesign name="closecircleo" size={24} color="#E8E8E8" style={styles.icon} />
              </TouchableOpacity>
            </View>

            <View>
              <Text style={styles.userName}>{user.name}</Text>
            </View>

            <View style={styles.publications}>{posts.map(renderItem)}</View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  image: {
    flex: 1,
    alignItems: 'center',
    resizeMode: 'cover',
  },
  contentBox: {
    flex: 1,
    width: Dimensions.get('window').width,
    marginTop: 148 - StatusBar.currentHeight,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  avatarContainer: {
    flex: 1,
    alignSelf: 'center',
    position: 'absolute',
    top: -60,
    width: 120,
    height: 120,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  avatar: {
    flex: 1,
    borderRadius: 16,
    zIndex: 10,
    overflow: 'hidden',
  },
  buttonIcon: {
    position: 'absolute',
    right: -12,
    top: 81,
    borderRadius: 12,
    zIndex: 11,
  },
  icon: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: 12,
  },
  userName: {
    marginTop: 92,
    alignSelf: 'center',
    fontWeight: '500',
    fontSize: 30,
    lineHeight: 35,
    color: '#212121',
  },
  publications: {
    flex: 1,
    flexGrow: 1,
    paddingBottom: 12,
  },
  publication: {
    marginTop: 34,
  },
  picture: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
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
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  extraDataInnerBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  extraDataText: {
    marginLeft: 8,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#212121',
  },
});
