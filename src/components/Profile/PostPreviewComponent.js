import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const PostPreviewComponent = ({style, source}) => {
  return (
    <View style={styles.container}>
      <Image source={source} style={styles.imagePreview} />
    </View>
  );
};

export default PostPreviewComponent;

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  imagePreview: {
    width: 155,
    height: 155,
    borderRadius: 20,
  },
});
