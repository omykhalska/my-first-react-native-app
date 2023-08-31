import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AntDesign, Feather } from '@expo/vector-icons'
import { getUserId } from '../redux/auth/authSelectors'
import { setLike, removeLike, deletePost } from '../firebase'
import { COLORS, IMAGES } from '../constants'
import { NavigationProp } from '@react-navigation/native'
import { IPost } from '../interfaces'

const imgHeight = Math.round((Dimensions.get('window').width - 32) / 1.4)

interface IProps {
  item: IPost;
  navigation: NavigationProp<any, any>;
  screen?: 'PostsScreen' | 'ProfileScreen';
}

export const Post = ({ item, navigation, screen = 'PostsScreen' }: IProps) => {
  const [isLiked, setIsLiked] = useState<null | boolean>(null)

  const userId = useSelector(getUserId)!

  useEffect(() => {
    setIsLiked(item.likes.includes(userId!))
  })

  const toggleLike = async () => {
    if (isLiked) {
      await removeLike(item.id, userId)
    } else {
      await setLike(item.id, userId)
    }
  }

  const onDeletePost = async () => {
    Alert.alert('Delete this post', 'Do you confirm the deletion ?', [
      {
        text: 'Cancel',
        onPress: () => {
        },
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          await deletePost(item)
        },
      },
    ])
  }

  return (
    <View style={styles.publication}>
      {screen === 'PostsScreen' ? (
        <>
          <View style={styles.userDataBox}>
            <Image
              source={item.userAvatar ? { uri: item.userAvatar } : IMAGES.user}
              style={styles.userAvatar}
            />
            <Text style={styles.userName}>{item.userName}</Text>
          </View>
          <Image source={{ uri: item.photo }} style={styles.picture} />
          <Text style={{ ...styles.title, marginTop: 8 }}>{item.title}</Text>
        </>
      ) : (
        <>
          <View style={[styles.centered, styles.titleBox]}>
            <Text style={styles.title}>{item.title}</Text>
            <TouchableOpacity onPress={onDeletePost}>
              <Feather
                name='delete'
                size={24}
                color={COLORS.textPrimaryColor}
              />
            </TouchableOpacity>
          </View>
          <Image source={{ uri: item.photo }} style={styles.picture} />
        </>
      )}
      <View style={styles.extraData}>
        <View style={styles.centered}>
          <TouchableOpacity style={styles.centered} onPress={toggleLike}>
            <AntDesign
              name={isLiked ? 'like1' : 'like2'}
              size={24}
              color={COLORS.accentColor}
            />
            <Text style={styles.commentsCount}>{item.likes?.length || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ ...styles.centered, marginLeft: 24 }}
            onPress={() => {
              navigation.navigate('Comments', {
                postId: item.id,
                postImage: item.photo,
              })
            }}
          >
            <AntDesign name='message1' size={24} color={COLORS.accentColor} />
            <Text style={styles.commentsCount}>{item.comments}</Text>
          </TouchableOpacity>
        </View>

        {item.location && (
          <View>
            <TouchableOpacity
              style={styles.centered}
              onPress={() => {
                navigation.navigate('Map', { location: item.location })
              }}
            >
              <AntDesign
                name='enviromento'
                size={24}
                color={COLORS.accentColor}
              />
              <Text style={styles.location}>{item.address}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  publication: {
    marginBottom: 8,
  },
  userDataBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.skeletonColor,
    borderRadius: 14,
  },
  userName: {
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 15,
    color: COLORS.textPrimaryColor,
  },
  picture: {
    width: '100%',
    height: imgHeight,
    resizeMode: 'cover',
    backgroundColor: COLORS.skeletonColor,
    borderRadius: 8,
  },
  titleBox: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.textPrimaryColor,
  },
  extraData: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  centered: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentsCount: {
    marginLeft: 6,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.textPrimaryColor,
  },
  location: {
    marginLeft: 4,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.textPrimaryColor,
    textDecorationLine: 'underline',
  },
})
