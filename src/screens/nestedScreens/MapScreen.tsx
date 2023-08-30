import {StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {RouteProp} from "@react-navigation/native";

interface IProps {
    route: RouteProp<any, any>
}

export default function MapScreen({route}: IProps) {
    const {latitude, longitude} = route.params?.location;
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
                <Marker coordinate={{latitude, longitude}}/>
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
