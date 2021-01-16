import React from 'react';
import Video from 'react-native-video';

import PostComponent from './PostComponent';

const Display = ({style, source}) => {
  let player;
  return (
    <Video
      style={style}
      source={source}
      ref={(ref) => {
        player = ref;
      }}
      controls={true}
      onError={console.error}
    />
  );
};

const VideoPost = ({post}) => {
  return <PostComponent display={Display} post={post} />;
};

export default VideoPost;
