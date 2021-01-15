import React from 'react';
import {Image} from 'react-native';
import Video from 'react-native-video';
import CreatePageComponent from '../../components/createContent/CreatePageComponent';

const Preview = ({style, fileSource}) => {
  if (fileSource) {
    let player;
    return (
      <Video
        style={style}
        source={{uri: fileSource.uri}}
        ref={(ref) => {
          player = ref;
        }}
      />
    );
  } else {
    return (
      <Image
        style={style}
        source={require('../../assets/images/createContent/icon_clips.png')}
      />
    );
  }
};

const CreateClipScreen = ({navigation}) => {
  return (
    <CreatePageComponent
      contentFileType="video"
      preview={Preview}
      navigation={navigation}
    />
  );
};

export default CreateClipScreen;
