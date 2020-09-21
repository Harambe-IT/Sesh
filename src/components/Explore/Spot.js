import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';

const Spot = ({post}) => {
  const {Owner, Content, Likes, Reactions} = post;
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

      <Image style={styles.postImage} source={post.Content.ContentURL} />

      <View style={styles.container}>
        <Text>{Likes.length}</Text>
        <Text>{Reactions.length}</Text>
      </View>
    </View>
  );
};

export default Spot;

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
