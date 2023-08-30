import {
    TouchableWithoutFeedback,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Keyboard,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import {Formik} from 'formik';
import {Ionicons} from '@expo/vector-icons';
import {useRef, useState} from 'react';
import {authLogInUser} from '../../redux/auth/authOperations';
import {useAppDispatch, useKeyboard} from '../../helpers/hooks';
import {COLORS, IMAGES, SCHEMAS} from '../../constants';
import {NavigationProp} from '@react-navigation/native';
import {UserCredentials} from '../../interfaces';

interface IProps {
    navigation: NavigationProp<any, any>;
}

export default function LoginScreen({navigation}: IProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [focusedItem, setFocusedItem] = useState('');
    const [isHiddenPassword, setIsHiddenPassword] = useState(true);

    const {isKeyboardVisible} = useKeyboard();
    const {keyboardHeight} = useKeyboard();

    const passwordRef = useRef(null) as any;

    const dispatch = useAppDispatch();

    const onSubmit = ({email, password}: UserCredentials) => {
        setIsLoading(true);
        dispatch(authLogInUser(email, password));
        setIsLoading(false);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <ImageBackground source={IMAGES.bgPattern} style={styles.image}>
                    <View style={styles.regFormContainer}>
                        <Formik
                            initialValues={{email: '', password: ''}}
                            validationSchema={SCHEMAS.loginSchema}
                            onSubmit={(values, {resetForm}) => {
                                onSubmit(values);
                                resetForm();
                            }}
                        >
                            {(props) => (
                                <View>
                                    <Text style={styles.formTitle}>Login</Text>
                                    <KeyboardAvoidingView
                                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                    >
                                        <TextInput
                                            value={props.values.email}
                                            onChangeText={props.handleChange('email')}
                                            onFocus={() => {
                                                setFocusedItem('email');
                                            }}
                                            onBlur={() => {
                                                props.setFieldTouched('email');
                                                setFocusedItem('');
                                            }}
                                            onSubmitEditing={() => {
                                                if (passwordRef.current !== null) {
                                                    passwordRef.current.focus();
                                                }
                                            }}
                                            blurOnSubmit={false}
                                            returnKeyType="next"
                                            returnKeyLabel="next"
                                            placeholder="E-mail address"
                                            placeholderTextColor={COLORS.textSecondaryColor}
                                            autoComplete={'email'}
                                            keyboardType={'email-address'}
                                            style={[
                                                focusedItem === 'email'
                                                    ? {...styles.input, ...styles.inputOnFocus}
                                                    : styles.input,
                                            ]}
                                            underlineColorAndroid={'transparent'}
                                        />
                                        {props.errors.email && props.touched.email && (
                                            <Text style={styles.errorText}>{props.errors.email}</Text>
                                        )}

                                        <View
                                            style={{
                                                marginBottom: isKeyboardVisible ? keyboardHeight : 0,
                                            }}
                                        >
                                            <TextInput
                                                value={props.values.password}
                                                onChangeText={props.handleChange('password')}
                                                onFocus={() => {
                                                    setFocusedItem('password');
                                                }}
                                                onBlur={() => {
                                                    props.setFieldTouched('password');
                                                    setFocusedItem('');
                                                }}
                                                ref={passwordRef}
                                                returnKeyType="go"
                                                returnKeyLabel="go"
                                                placeholder="Password"
                                                placeholderTextColor={COLORS.textSecondaryColor}
                                                secureTextEntry={isHiddenPassword}
                                                style={[
                                                    focusedItem === 'password'
                                                        ? {...styles.input, ...styles.inputOnFocus}
                                                        : styles.input,
                                                ]}
                                                underlineColorAndroid={'transparent'}
                                            />
                                            <TouchableOpacity
                                                style={styles.passwordIcon}
                                                activeOpacity={0.8}
                                                onPress={() => setIsHiddenPassword(!isHiddenPassword)}
                                            >
                                                <Ionicons
                                                    name={isHiddenPassword ? 'ios-eye' : 'ios-eye-off'}
                                                    size={28}
                                                    color={COLORS.iconInputColor}
                                                />
                                            </TouchableOpacity>

                                            {props.errors.password && props.touched.password && (
                                                <Text style={styles.errorText}>
                                                    {props.errors.password}
                                                </Text>
                                            )}
                                        </View>
                                    </KeyboardAvoidingView>

                                    <TouchableOpacity
                                        onPress={() => props.handleSubmit()}
                                        activeOpacity={0.8}
                                        style={{
                                            ...styles.buttonContainer,
                                            display: isKeyboardVisible ? 'none' : 'flex',
                                        }}
                                        disabled={isLoading}
                                    >
                                        <Text style={styles.buttonText}>Log in</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Sign up')}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={{
                                    ...styles.text,
                                    marginBottom: isKeyboardVisible ? 20 : 110,
                                    display: isKeyboardVisible ? 'none' : 'flex',
                                }}
                            >
                                Don't have an account? SIGN UP
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    errorText: {
        color: COLORS.warningColor,
        fontSize: 12,
        textAlign: 'center',
    },
    regFormContainer: {
        alignSelf: 'stretch',
        paddingHorizontal: 16,
        backgroundColor: COLORS.bgColor,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    formTitle: {
        marginTop: 32,
        marginBottom: 16,
        alignSelf: 'center',
        fontFamily: 'Roboto-Medium',
        fontSize: 30,
        fontWeight: '500',
        lineHeight: 35,
        letterSpacing: 0.01,
    },
    input: {
        height: 50,
        marginTop: 16,
        padding: 16,
        paddingRight: 40,
        backgroundColor: COLORS.bgInputColor,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: COLORS.skeletonColor,
        borderRadius: 8,
        fontFamily: 'Roboto-Regular',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 19,
    },
    inputOnFocus: {
        backgroundColor: COLORS.bgColor,
        borderColor: COLORS.accentColor,
    },
    passwordIcon: {
        position: 'absolute',
        right: 10,
        top: 25,
    },
    buttonContainer: {
        marginTop: 44,
        alignItems: 'center',
        gap: 12,
        backgroundColor: COLORS.accentColor,
        borderRadius: 100,
        paddingHorizontal: 32,
        paddingVertical: 16,
        opacity: 1,
    },
    buttonText: {
        fontFamily: 'Roboto-Regular',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 19,
        color: COLORS.bgColor,
    },
    text: {
        marginTop: 16,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 19,
        color: COLORS.textAuthColor,
        opacity: 1,
    },
});
