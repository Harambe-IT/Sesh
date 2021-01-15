import React from 'react';
import {Image} from 'react-native';
import CreatePageComponent from '../../components/createContent/CreatePageComponent';

const Preview = ({style, fileSource}) => {
  return (
    <Image
      style={style}
      source={
        fileSource
          ? {uri: fileSource.uri}
          : require('../../assets/images/createContent/icon_pictures.png')
      }
    />
  );
};

const CreatePictureScreen = ({navigation}) => {
  return (
    <CreatePageComponent
      contentFileType="image"
      preview={Preview}
      navigation={navigation}
    />
  );
};

export default CreatePictureScreen;
