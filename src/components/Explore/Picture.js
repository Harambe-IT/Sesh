import React, {useState, useEffect} from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';

import {likePost} from '../../features/posts/postSlice';

const Picture = ({post}) => {
  const {
    contentUrl,
    createdOn,
    description,
    owner,
    title,
    type,
    reactions,
    likes,
  } = post;
  const [likedPost, setLikedPost] = useState(false);
  const dispatch = useDispatch();
  const {isFetching, errors} = useSelector((state) => state.posts);

  useEffect(() => {
    setLikedPost(
      likes?.filter((l) => l.owner.uid === auth().currentUser.uid).length > 0
        ? true
        : false,
    );
  }, [likes]);

  const handleLike = () => {
    dispatch(likePost(post.docId));
  };

  const handleReaction = () => {
    console.log('reacting...');
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postInfoContainer}>
        <Image
          style={styles.tinyProfilePicture}
          source={{uri: `https://picsum.photos/200/300?random=${post.docId}`}}
        />
        <Text
          style={
            styles.ownerName
          }>{`${owner.firstName} ${owner.lastName}`}</Text>
        <Text style={styles.textRight}>{type}</Text>
      </View>

      <Image style={styles.postImage} source={{uri: contentUrl}} />

      <View style={styles.postInfoContainer}>
        <TouchableOpacity onPress={handleLike} style={styles.postInfoContainer}>
          <Image
            style={styles.tinyIcon}
            source={
              likedPost
                ? require('../../assets/images/posts/icon_liked.png')
                : require('../../assets/images/posts/icon_like.png')
            }
          />
          <Text style={styles.numberOfLR}>{likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleReaction}
          style={styles.postInfoContainer}>
          <Image
            style={styles.tinyIcon}
            source={require('../../assets/images/posts/icon_comment.png')}
          />
          <Text style={styles.numberOfLR}>{reactions.length}</Text>
        </TouchableOpacity>
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
    fontWeight: 'bold',
    color: 'red',
  },
  ownerName: {
    fontWeight: 'bold',
  },
});
