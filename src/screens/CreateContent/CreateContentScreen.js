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

import {useDispatch, useSelector} from 'react-redux';
import {createNewPost} from '../../features/posts/postSlice';

const CreateContentScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileSource, setFileSource] = useState(null);

  const dispatch = useDispatch();
  const {isUploading, errors} = useSelector((state) => state.posts);

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
      setFileSource(source);
    }
  };

  const handleUpload = () => {
    if (!isUploading) {
      console.log('Trying to upload..');
      dispatch(createNewPost({fileSource: fileSource, title, description}));
    }
  };

  return (
    <View>
      {fileSource?.uri && (
        <View>
          <Image style={styles.postImage} source={{uri: fileSource.uri}} />
        </View>
      )}
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
          launchCamera({mediaType: 'image'}, handleChooseImageCallback)
        }>
        <Text>Choose Image</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleUpload} disabled={isUploading}>
        <Text>Post</Text>
      </TouchableOpacity>
      {errors && (
        <View>
          <Text>{JSON.stringify(errors)}</Text>
        </View>
      )}
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
