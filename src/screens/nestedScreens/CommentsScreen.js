import { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';
import { getUserId } from '../../redux/auth/authSelectors';
import { getAllComments, createComment } from '../../firebase';
import { Comment } from '../../components/Comment';
import { Loader } from '../../components/Loader';
import { useKeyboard } from '../../helpers/hooks';
import { COLORS, SHADOW } from '../../constants';

const imgHeight = Math.round(((Dimensions.get('window').width - 32) / 1.4) * 0.75);

export default function CommentsScreen({ route }) {
  const { postId, postImage } = route.params;

  const [commentIsUploading, setCommentIsUploading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(null);
  const [height, setHeight] = useState(0);

  const headerHeight = useHeaderHeight();

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
      <View style={{ minHeight: 96, marginBottom: isKeyboardVisible ? 8 : 0 }}>
        {commentIsUploading ? (
          <Text style={styles.notification}>Sending your comment...</Text>
        ) : (
          <>
            <KeyboardAvoidingView
              keyboardVerticalOffset={headerHeight + StatusBar.currentHeight}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <TextInput
                style={[styles.textArea, SHADOW, { height: Math.max(52, height) }]}
                placeholder="Write your comment"
                placeholderTextColor={COLORS.textSecondaryColor}
                onChangeText={setCommentText}
                onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height)}
                value={commentText}
                multiline
                returnKeyType="send"
                returnKeyLabel="send"
              />
            </KeyboardAvoidingView>
            {commentText && (
              <View style={[styles.submitBtn, SHADOW]}>
                <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit}>
                  <AntDesign name="arrowup" size={24} color={COLORS.bgColor} />
                </TouchableOpacity>
              </View>
            )}
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
    backgroundColor: COLORS.bgColor,
  },
  picture: {
    width: '85%',
    height: imgHeight,
    resizeMode: 'cover',
    alignSelf: 'center',
    backgroundColor: COLORS.skeletonColor,
    borderRadius: 8,
  },
  commentsArea: {
    flex: 1,
    marginTop: 30,
  },
  textArea: {
    marginTop: 30,
    maxHeight: 76,
    padding: 16,
    paddingRight: 54,
    backgroundColor: COLORS.bgInputColor,
    borderRadius: 100,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.textPrimaryColor,
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
    backgroundColor: COLORS.accentColor,
    borderRadius: 17,
  },
  notification: {
    marginTop: 30,
    alignSelf: 'center',
  },
});
