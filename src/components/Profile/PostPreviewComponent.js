import React from "react";
import {View, Image, StyleSheet} from "react-native";

const PostPreviewComponent = ({style, source, type}) => {
  let player;
  return (
    <View style={styles.container}>
      {type === "clip" ? (
        <Video
          style={styles.imagePreview}
          source={source}
          ref={(ref) => {
            player = ref;
          }}
          controls={true}
          onError={console.error}
        />
      ) : (
        <Image source={source} style={styles.imagePreview} />
      )}
    </View>
  );
};

export default PostPreviewComponent;

const styles = StyleSheet.create({
  container: {
    margin: "1%",
  },
  imagePreview: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 20,
  },
});
