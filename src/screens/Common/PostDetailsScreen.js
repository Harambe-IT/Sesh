import React, {useEffect, useState} from "react";
import {RefreshControl, ScrollView, StyleSheet, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Picture, Video} from "../../components/Explore";
import {reactPost, getPostById} from "../../features/posts/postSlice";
import {useRoute} from "@react-navigation/native";
import {Button, TextBox} from "../../components/Common";
import Comment from "../../components/Common/Comment";

const PostDetailsScreen = () => {
  const dispatch = useDispatch();
  const {postById, commented, isFetching, errors} = useSelector(
    (state) => state.posts,
  );
  const [comment, setComment] = useState("");

  const route = useRoute();
  useEffect(() => {
    dispatch(getPostById(route.params.postId));
  }, [route.params.postId]);

  const handleSend = () => {
    dispatch(reactPost({postId: postById.docId, reaction: comment}));
  };

  useEffect(() => {
    setComment("");
    dispatch(getPostById(route.params.postId));
  }, [commented]);

  return (
    <View>
      {postById && (
        <View style={styles.container}>
          {postById.type === "picture" ? (
            <Picture key={postById.docId} post={postById} page="Explore" />
          ) : (
            <Video key={postById.docId} post={postById} page="Explore" />
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
    marginBottom: "11%",
  },
});
