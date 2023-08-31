import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeStackNavigatorParamList } from '../../navigation/MainNavigation';

type Props = NativeStackScreenProps<NativeStackNavigatorParamList, 'Camera'>

export default function CameraScreen({ navigation, route }: Props) {
  const { previous_screen } = route.params;

  const [camera, setCamera] = useState<Camera | null>(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);
  const [type, setType] = useState(CameraType.back);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title='Grant permission' />
      </View>
    );
  }

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync();
      setImage(data.uri);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      {image ? (
        <>
          <View style={styles.cameraContainer}>
            <Image source={{ uri: image }} style={styles.fixedRatio} />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setImage(null)}>
              <MaterialIcons name='clear' size={48} color={COLORS.bgColor} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Posts', { screen: previous_screen, params: { image } })}>
              <MaterialIcons name='check' size={48} color={COLORS.bgColor} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.cameraContainer}>
            <Camera ref={ref => setCamera(ref)} style={styles.fixedRatio} type={type} />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={toggleCameraType}>
              <MaterialIcons name='flip-camera-android' size={48} color={COLORS.bgColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={takePicture}>
              <MaterialIcons name='camera' size={48} color={COLORS.bgColor} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.shadowColor,
  },
  permissionText: {
    textAlign: 'center',
    color: COLORS.bgColor,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 3 / 4,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    minHeight: 150,
  },
});
