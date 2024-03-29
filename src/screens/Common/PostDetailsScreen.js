import React, {useEffect, useState} from "react";
import {RefreshControl, ScrollView, StyleSheet, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Picture, Video} from "../../components/Explore";
import {
  reactPost,
  getPostById,
  updateComments,
} from "../../features/posts/postSlice";
import {useRoute} from "@react-navigation/native";
import {Button, TextBox} from "../../components/Common";
import Comment from "../../components/Common/Comment";
import firestore from "@react-native-firebase/firestore";

const PostDetailsScreen = () => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const route = useRoute();
  const {postById, isFetching, errors} = useSelector((state) => state.posts);

  const handleSend = () => {
    dispatch(reactPost({postId: postById.docId, reaction: comment}));
    setComment("");
  };

  useEffect(() => {
    dispatch(getPostById(route.params.postId));
  }, [route.params.postId]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("posts")
      .doc(route.params.postId)
      .collection("reactions")
      .orderBy("createdOn", "desc")
      .onSnapshot((snapshot) => {
        if (snapshot.empty) dispatch(updateComments([]));

        let reactions = [];
        let reactionPromises = [];

        snapshot.forEach((doc) => {
          let tempReaction = {
            docId: doc.id,
            ...doc.data(),
            createdOn: doc.data()?.createdOn?.seconds || null,
          };

          let getReactionOwnerData = doc
            .data()
            .owner.get()
            .then((doc) => {
              tempReaction.owner = {
                uid: doc.id,
                ...doc.data(),
                createdOn: doc.data()?.createdOn?.seconds || null,
              };

              reactions.push(tempReaction);
            });

          reactionPromises.push(getReactionOwnerData);
        });

        Promise.all(reactionPromises).then(() => {
          dispatch(updateComments(reactions));
        });
      });

    return unsubscribe;
  }, [dispatch]);

  return (
    <View>
      {postById && (
        <View style={styles.container}>
          <View style={styles.postTitleContainer}>
            <Text style={styles.postTitle}>{postById.title}</Text>
          </View>
          {postById.type === "picture" ? (
            <Picture key={postById.docId} post={postById} page="Details" />
          ) : (
            <Video key={postById.docId} post={postById} page="Details" />
          )}
          <ScrollView style={styles.commentsBox}>
            {postById.reactions?.length > 0 ? (
              postById.reactions.map((reaction, index) => {
                return <Comment key={index} comment={reaction} />;
              })
            ) : (
              <Text>No comments yet.</Text>
            )}
          </ScrollView>
          <TextBox
            onChangeText={setComment}
            style={styles.textbox}
            value={comment}
            placeholder="Type your comment here..."
            placeholderTextColor="red"
          />
          <Button style={styles.sendButton} onPress={handleSend} text="Send" />
        </View>
      )}
    </View>
  );
};

export default PostDetailsScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    position: "relative",
    height: "100%",
  },
  textbox: {
    position: "absolute",
    left: "5%",
    bottom: "3%",
    width: "80%",
    backgroundColor: "#fafafa",
    fontFamily: "",
    color: "red",
    borderColor: "black",
    borderWidth: 1,
    paddingVertical: 5,
  },
  sendButton: {
    position: "absolute",
    right: "5%",
    bottom: "3%",
    width: "20%",
    paddingVertical: 5,
  },
  commentsBox: {
    width: "100%",
    padding: "2%",
    marginBottom: "11%",
    borderWidth: StyleSheet.hairlineWidth,
  },
  postTitleContainer: {
    marginBottom: 10,
    paddingVertical: 5,
    borderWidth: StyleSheet.hairlineWidth,
    width: "100%",
    backgroundColor: "#fafafa",
  },
  postTitle: {
    fontFamily: "",
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
  },
});
