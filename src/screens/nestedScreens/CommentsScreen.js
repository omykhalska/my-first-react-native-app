import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';
import { getUserId } from '../../redux/auth/authSelectors';
import { getAllComments, createComment } from '../../helpers/handleFirebase';
import { Comment } from '../../components/Comment';
import { Loader } from '../../components/Loader';
import { useKeyboard } from '../../helpers/hooks';

export default function CommentsScreen({ route }) {
  const { postId, postImage } = route.params;

  const [commentIsUploading, setCommentIsUploading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(null);

  const isKeyboardVisible = useKeyboard();

  const userId = useSelector(getUserId);

  useEffect(() => {
    getAllComments(postId, setComments);
  }, []);

  const memoizedRenderItem = useMemo(
    () =>
      ({ item }) =>
        <Comment data={item} />,
    [comments],
  );

  const handleSubmit = async () => {
    setCommentIsUploading(true);
    await createComment({ postId, commentText, userId });
    setCommentText('');
    setCommentIsUploading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image source={{ uri: postImage }} style={styles.picture} />
      </View>

      <View style={styles.commentsArea}>
        {!comments && <Loader />}
        <FlatList data={comments} renderItem={memoizedRenderItem} keyExtractor={item => item.id} />
      </View>
      <View style={{ height: 96, marginBottom: isKeyboardVisible ? 4 : 0 }}>
        {commentIsUploading ? (
          <Text style={styles.notification}>Sending your comment...</Text>
        ) : (
          <>
            <KeyboardAvoidingView>
              <TextInput
                style={[styles.textArea, styles.shadow]}
                placeholder="Комментировать..."
                placeholderTextColor={'#BDBDBD'}
                onChangeText={setCommentText}
                value={commentText}
                returnKeyType="done"
                returnKeyLabel="done"
              />
            </KeyboardAvoidingView>
            {commentText ? (
              <View style={[styles.submitBtn, styles.shadow]}>
                <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit}>
                  <AntDesign name="arrowup" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : null}
          </>
        )}
      </View>
    </SafeAreaView>
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
  textArea: {
    marginTop: 30,
    height: 52,
    padding: 16,
    paddingRight: 54,
    backgroundColor: '#F6F6F6',
    borderRadius: 100,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: '#212121',
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
  notification: {
    marginTop: 30,
    alignSelf: 'center',
  },
});
