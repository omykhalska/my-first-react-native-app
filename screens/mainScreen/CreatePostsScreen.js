import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as yup from 'yup';

const publicationSchema = yup.object({
  image: yup.string(),
  title: yup.string().required('Это поле не может быть пустым').min(2, 'Слишком короткое описание'),
  location: yup
    .string()
    .required('Это поле не может быть пустым')
    .min(2, 'Слишком короткое описание'),
});

export default function CreatePostsScreen() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={200}
        contentContainerStyle={styles.container}
        scrollEnabled={false}
      >
        <View style={styles.form}>
          <Formik
            initialValues={{ title: '', location: '', image: '' }}
            validationSchema={publicationSchema}
            onSubmit={(values, { resetForm }) => {
              console.log(values);
              resetForm();
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              setFieldTouched,
              handleSubmit,
              isValid,
              dirty,
            }) => (
              <View>
                <View style={styles.pictureBox}>
                  <Image source={null} style={styles.picture} />
                  <TouchableOpacity
                    style={styles.cameraBtnBox}
                    activeOpacity={0.8}
                    onPress={() => {}}
                  >
                    <MaterialIcons name="photo-camera" size={24} color="#BDBDBD" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.text}>Загрузите фото</Text>

                <TextInput
                  value={values.title}
                  onChangeText={handleChange('title')}
                  onBlur={() => {
                    setFieldTouched('title');
                  }}
                  placeholder="Название..."
                  placeholderTextColor="#BDBDBD"
                  style={{ ...styles.input, fontWeight: '500' }}
                  underlineColorAndroid={'transparent'}
                />
                {errors.title && touched.title && (
                  <Text style={styles.errorText}>{errors.title}</Text>
                )}

                <View>
                  <TextInput
                    value={values.location}
                    onChangeText={handleChange('location')}
                    onBlur={() => {
                      setFieldTouched('location');
                    }}
                    placeholder="Местность..."
                    placeholderTextColor="#BDBDBD"
                    style={{ ...styles.input, paddingLeft: 28 }}
                    underlineColorAndroid={'transparent'}
                  />
                  <Feather name="map-pin" size={24} color="#BDBDBD" style={styles.locationIcon} />

                  {errors.location && touched.location && (
                    <Text style={styles.errorText}>{errors.location}</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                  disabled={!(isValid && dirty)}
                  style={[
                    !(isValid && dirty)
                      ? styles.submitBtn
                      : {
                          ...styles.submitBtn,
                          backgroundColor: '#FF6C00',
                        },
                  ]}
                >
                  <Text
                    style={[
                      !(isValid && dirty)
                        ? styles.buttonText
                        : {
                            ...styles.buttonText,
                            color: '#FFF',
                          },
                    ]}
                  >
                    Опубликовать
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>

        {/*Trash Button START*/}
        <View>
          <TouchableOpacity onPress={() => {}} opacity={0.8} style={styles.trashBtnBox}>
            <Feather name="trash-2" size={24} color="#BDBDBD" />
          </TouchableOpacity>
        </View>
        {/*Trash Button END*/}
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 32,
    fontFamily: 'Roboto-Regular',
    backgroundColor: '#fff',
  },
  pictureBox: {
    backgroundColor: '#E8E8E8',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderStyle: 'solid',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picture: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  cameraBtnBox: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: 90, // 240/2 - 60/2
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
  },
  text: {
    marginTop: 8,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#BDBDBD',
  },
  input: {
    height: 50,
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#E8E8E8',
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
  },
  locationIcon: {
    position: 'absolute',
    left: 0,
    top: 25,
  },
  errorText: {
    color: '#AF0606',
    fontSize: 12,
    textAlign: 'center',
  },
  submitBtn: {
    marginVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#F6F6F6',
    borderRadius: 100,
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#BDBDBD',
  },
  trashBtnBox: {
    width: 70,
    height: 40,
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
});
