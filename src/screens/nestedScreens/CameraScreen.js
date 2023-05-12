import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants';

export default function CameraScreen({ navigation }) {
  const [camera, setCamera] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(CameraType.back);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
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
          <Button title="Cancel" onPress={() => setImage(null)}></Button>
          <Button title="Send" onPress={() => navigation.navigate('Create', { image })} />
        </>
      ) : (
        <>
          <View style={styles.cameraContainer}>
            <Camera ref={ref => setCamera(ref)} style={styles.fixedRatio} type={type} />
          </View>
          <Button title="Flip Image" onPress={toggleCameraType}></Button>
          <Button title="Take Picture" onPress={takePicture} />
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
  },
  // btnBox: {
  //   width: '100%',
  //   minHeight: 150,
  //   backgroundColor: 'red',
  // },
  // buttonContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   backgroundColor: 'transparent',
  //   margin: 64,
  // },
  // button: {
  //   flex: 1,
  //   alignSelf: 'flex-end',
  //   alignItems: 'center',
  // },
  // text: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   color: COLORS.bgColor,
  // },
});
