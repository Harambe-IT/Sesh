import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import Video from 'react-native-video';

const VideoPost = ({post}) => {
  const {Owner, Content, Likes, Reactions} = post;
  let Player;

  return (
    <View>
      <View style={styles.container}>
        <Image
          style={styles.tinyProfilePicture}
          source={Owner.ProfilePictureURL}
        />
        <Text>{Owner.Name}</Text>
        <Text>{Content.Type}</Text>
      </View>

      <Video
        style={styles.postImage}
        source={post.Content.ContentURL}
        ref={(ref) => {
          Player = ref;
        }}
        repeat={false}
        paused={true}
        onError={console.error}
      />

      <View style={styles.container}>
        <Text>{Likes.length}</Text>
        <Text>{Reactions.length}</Text>
      </View>
    </View>
  );
};

export default VideoPost;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  tinyProfilePicture: {
    width: 25,
    height: 25,
    borderRadius: 25,
  },
  postImage: {
    width: 250,
    height: 250,
    borderRadius: 5,
  },
});
