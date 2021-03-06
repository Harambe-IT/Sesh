import React from 'react';
import {Image} from 'react-native';

import PostComponent from './PostComponent';

const Display = ({style, source}) => {
  return <Image style={style} source={source} />;
};

const Picture = ({post, page}) => {
  return <PostComponent display={Display} post={post} page={page} />;
};

export default Picture;
