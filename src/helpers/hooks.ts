import {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import {useDispatch} from 'react-redux'
import {AppDispatch} from "../redux/store";

export const useKeyboard = () => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
            setKeyboardVisible(true);
            setKeyboardHeight(e.endCoordinates.height);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
            setKeyboardHeight(0);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    return {isKeyboardVisible, keyboardHeight};
};

type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;