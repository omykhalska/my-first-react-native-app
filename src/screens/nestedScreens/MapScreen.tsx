import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeStackNavigatorParamList } from '../../navigation/MainNavigation';

type Props = NativeStackScreenProps<NativeStackNavigatorParamList, 'Map'>

export default function MapScreen({ route }: Props) {
  const { latitude, longitude } = route.params?.location;
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.006,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    fontFamily: 'Roboto-Regular',
  },
  map: {
    flex: 1,
  },
});
