import React, {useState, useEffect} from "react";
import {Text, View, Image, StyleSheet, TouchableOpacity} from "react-native";
import auth from "@react-native-firebase/auth";
import {useSelector, useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";

import {likePost} from "../../features/posts/postSlice";

const PostComponent = ({post, display, page, handleRefresh}) => {
  const Display = display;

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
  const navigation = useNavigation();

  useEffect(() => {
    setLikedPost(
      likes?.filter((l) => l.owner.uid === auth().currentUser.uid).length > 0
        ? true
        : false,
    );
  }, [likes]);

  const handleLike = () => {
    dispatch(likePost({postId: post.docId, page}));
    handleRefresh();
  };

  const handleReaction = () => {
    navigation.navigate("Post Details", {postId: post.docId});
  };

  const handleGoToProfile = () => {
    navigation.navigate("Profile", {uid: owner.uid});
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postInfoContainer}>
        <Image
          style={styles.tinyProfilePicture}
          source={{uri: `https://picsum.photos/200/300?random=${post.docId}`}}
        />
        <TouchableOpacity onPress={handleGoToProfile}>
          <Text
            style={
              owner.uid === auth().currentUser.uid
                ? styles.ownerNameSelf
                : styles.ownerName
            }>{`${
            owner.uid === auth().currentUser.uid ? "You" : owner.userName
          }`}</Text>
        </TouchableOpacity>
        <Text style={styles.textRight}>{type}</Text>
      </View>

      <Display style={styles.postContent} source={{uri: contentUrl}} />

      <View style={styles.postInfoContainer}>
        <TouchableOpacity onPress={handleLike} style={styles.postInfoContainer}>
          <Image
            style={styles.tinyIcon}
            source={
              likedPost
                ? require("../../assets/images/posts/icon_liked.png")
                : require("../../assets/images/posts/icon_like.png")
            }
          />
          <Text style={styles.numberOfLR}>{likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleReaction}
          style={styles.postInfoContainer}>
          <Image
            style={styles.tinyIcon}
            source={require("../../assets/images/posts/icon_comment.png")}
          />
          <Text style={styles.numberOfLR}>{reactions.length}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostComponent;

const styles = StyleSheet.create({
  postInfoContainer: {
    flexDirection: "row",
  },
  postContainer: {
    marginBottom: 5,
  },
  tinyProfilePicture: {
    width: 25,
    height: 25,
    borderRadius: 25,
    marginRight: 4,
    marginBottom: 5,
  },
  numberOfLR: {
    marginTop: 7,
    marginLeft: -10,
  },
  tinyIcon: {
    width: 50,
    height: 50,
    marginTop: -8,
    resizeMode: "cover",
  },
  postContent: {
    width: 350,
    height: 350,
    borderRadius: 5,
  },
  textRight: {
    marginLeft: "auto",
    fontWeight: "bold",
    color: "red",
    fontFamily: "",
  },
  ownerName: {
    fontWeight: "bold",
    fontFamily: "",
  },
  ownerNameSelf: {
    fontWeight: "bold",
    color: "red",
    fontFamily: "",
  },
});
