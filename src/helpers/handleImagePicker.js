import * as ImagePicker from 'expo-image-picker';
import {handleError} from './handleError';

export const pickImage = async (options = {}) => {
    try {
        let result = await ImagePicker.launchImageLibraryAsync(options);

        if (!result.canceled) {
            return result.assets[0].uri;
        }
    } catch (e) {
        handleError(e);
    }
};

// export const takePhoto = async options => {
//   try {
//     let result = await ImagePicker.launchCameraAsync(options);
//
//     if (!result.cancelled) {
//       return result.uri;
//     }
//   } catch (e) {
//     handleError(e);
//   }
// };
