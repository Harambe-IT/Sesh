import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';

import {createNewPost} from '../../features/posts/postSlice';
import TextBox from '../Design/TextBox';
import PrimaryButton from '../Design/CupertinoButtonDanger';

const CreatePageComponent = ({contentFileType, preview, navigation}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileSource, setFileSource] = useState(null);
  const Preview = preview;

  const dispatch = useDispatch();
  const {isUploading, errors, uploadPercentage, uploaded} = useSelector(
    (state) => state.posts,
  );

  const cameraCallback = (response) => {
    if (!response.didCancel && !response.error) {
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
      dispatch(createNewPost({fileSource: fileSource, title, description}));
    }
  };

  useEffect(() => {
    uploaded && navigation.navigate('Explore');
  }, [uploaded]);

  return (
    <View style={styles.container}>
      {/* <View>
        <Text>{isUploading && uploadPercentage}</Text>
      </View> */}
      <View>
        <TouchableOpacity
          onPress={() =>
            launchCamera({mediaType: contentFileType}, cameraCallback)
          }>
          <Preview style={styles.postFile} fileSource={fileSource} />
        </TouchableOpacity>
      </View>
      <TextBox
        placeholder="Title"
        onChangeText={setTitle}
        placeholderTextColor="grey"
        textColor="black"
        errors={errors?.title}
      />
      <TextBox
        placeholder="Description"
        onChangeText={setDescription}
        placeholderTextColor="grey"
        textColor="black"
        errors={errors?.description}
      />
      <PrimaryButton
        onPress={handleUpload}
        disabled={isUploading}
        text="Post"
        style={styles.uploadButton}
      />
    </View>
  );
};

export default CreatePageComponent;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  postFile: {
    width: 250,
    height: 250,
    borderRadius: 5,
  },
  uploadButton: {
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 25,
  },
});
