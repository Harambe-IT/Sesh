import React, {useState, useEffect} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';

import auth from '@react-native-firebase/auth';

const Picture = ({post}) => {
  const {owner, content, likes, reactions} = post;
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(
      likes?.filter((l) => l.ownerId === auth().currentUser.uid).length > 0
        ? true
        : false,
    );
  }, []);

  return (
    <View style={styles.postContainer}>
      <View style={styles.postInfoContainer}>
        <Image
          style={styles.tinyProfilePicture}
          source={owner.profilePictureURL}
        />
        <Text>{owner.name}</Text>
        <Text style={styles.textRight}>{content.type}</Text>
      </View>

      <Image style={styles.postImage} source={post.content.contentURL} />

      <View style={styles.postInfoContainer}>
        <Image
          style={styles.tinyIcon}
          source={
            liked
              ? require('../../assets/images/posts/icon_liked.png')
              : require('../../assets/images/posts/icon_like.png')
          }
        />
        <Text style={styles.numberOfLR}>{likes.length}</Text>
        <Image
          style={styles.tinyIcon}
          source={require('../../assets/images/posts/icon_comment.png')}
        />
        <Text style={styles.numberOfLR}>{reactions.length}</Text>
      </View>
    </View>
  );
};

export default Picture;

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
  postImage: {
    width: 350,
    height: 350,
    borderRadius: 5,
  },
  textRight: {
    marginLeft: 'auto',
  },
});
