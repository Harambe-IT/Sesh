import React, {useState} from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';

import TextBox from '../../components/Design/TextBox';

const CreateContentScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleChooseImageCallback = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      const uri = response.uri;
      const type = response.type;
      const name = response.fileName;
      const source = {
        uri,
        type,
        name,
      };
      setPhoto(source);
    }
  };

  return (
    <View>
      <View>
        {photo?.uri && (
          <Image style={styles.postImage} source={{uri: photo.uri}} />
        )}
      </View>
      <View>
        <Text>Title</Text>
        <TextBox placeholder="Title" onChangeText={setTitle} /*style={}*/ />
      </View>
      <View>
        <Text>Description</Text>
        <TextBox
          placeholder="Description"
          onChangeText={setDescription} /*style={}*/
        />
      </View>
      <TouchableOpacity
        onPress={() =>
          launchImageLibrary({mediaType: 'photo'}, handleChooseImageCallback)
        }>
        <Text>Upload Image</Text>
      </TouchableOpacity>
      <Button
        onPress={() => {
          auth().signOut();
        }}
        title="Logout"
        color="#841584"
        accessibilityLabel="Logout using this button"
      />
    </View>
  );
};

export default CreateContentScreen;

const styles = StyleSheet.create({
  postImage: {
    width: 250,
    height: 250,
    borderRadius: 5,
  },
});
