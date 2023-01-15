import {
  StyleSheet,
  View,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const PhotoEditPopup = ({ visible, onPress }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onPress}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.backdrop}>
          <View style={styles.menuView}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>Фото профиля</Text>
              <TouchableOpacity
                style={{}}
                activeOpacity={0.8}
                onPress={() => {
                  onPress();
                  Alert.alert('Remove a photo');
                }}
              >
                <MaterialIcons name="delete" size={24} color="rgba(0,0,0,0.6)" />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonsBox}>
              <View style={styles.centered}>
                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={0.8}
                  onPress={() => {
                    onPress();
                    Alert.alert('Select a new photo');
                  }}
                >
                  <MaterialIcons name="image-search" size={24} color="#FF6C00" />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Галерея</Text>
              </View>

              <View style={styles.centered}>
                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={0.8}
                  onPress={() => {
                    onPress();
                    Alert.alert('Capture a new photo');
                  }}
                >
                  <MaterialIcons name="photo-camera" size={24} color="#FF6C00" />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Камера</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  menuView: {
    height: 'auto',
    borderColor: '#ccc',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#fff',
    elevation: 20,
    padding: 16,
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: '500',
    fontSize: 22,
    color: '#212121',
  },
  buttonsBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 8,
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
    marginBottom: 8,
  },
  centered: {
    alignItems: 'center',
  },
});
