import React, {useState, useEffect} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import Video from 'react-native-video';

import auth from '@react-native-firebase/auth';

const VideoPost = ({post}) => {
  const {owner, content, likes, reactions} = post;
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(
      likes?.filter((l) => l.ownerId === auth().currentUser.uid).length > 0
        ? true
        : false,
    );
  }, []);
  let player;

  return (
    <View style={styles.postContainer}>
      <View style={styles.postInfoContainer}>
        <Image
          style={styles.tinyProfilePicture}
          source={owner.profilePictureURL}
        />
        <Text>{owner.mame}</Text>
        <Text style={styles.textRight}>{content.type}</Text>
      </View>

      <Video
        style={styles.postVideo}
        source={post.content.contentURL}
        ref={(ref) => {
          player = ref;
        }}
        controls={true}
        onError={console.error}
      />

      <View style={styles.postInfoContainer}>
        <Text>{likes.length}</Text>
        <Text>{reactions.length}</Text>
      </View>
    </View>
  );
};

export default VideoPost;

const styles = StyleSheet.create({
  postInfoContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  postContainer: {
    marginBottom: 25,
  },
  tinyProfilePicture: {
    width: 25,
    height: 25,
    borderRadius: 25,
    marginRight: 4,
  },
  numberOfLR: {
    marginTop: 7,
    marginLeft: -10,
  },
  tinyIcon: {
    width: 50,
    height: 50,
    marginTop: -8,
    resizeMode: 'cover',
  },
  postVideo: {
    width: 350,
    height: 350,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: StyleSheet.hairlineWidth,
  },
  textRight: {
    marginLeft: 'auto',
  },
});
