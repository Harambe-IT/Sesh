import React, {useEffect, useState} from "react";
import {RefreshControl, ScrollView, StyleSheet, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Picture, Video} from "../../components/Explore";
import {
  reactSpot,
  getSpotById,
  updateCommentsSpot,
} from "../../features/posts/postSlice";
import {useRoute} from "@react-navigation/native";
import {Button, TextBox} from "../../components/Common";
import Comment from "../../components/Common/Comment";
import firestore from "@react-native-firebase/firestore";

const SpotDetailsScreen = () => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const route = useRoute();
  const {spotById, isFetching, errors} = useSelector((state) => state.posts);

  const handleSend = () => {
    dispatch(reactSpot({spotId: spotById.docId, reaction: comment}));
    setComment("");
  };

  useEffect(() => {
    dispatch(getSpotById(route.params.spotId));
  }, [route.params.spotId]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("spots")
      .doc(route.params.spotId)
      .collection("reactions")
      .orderBy("createdOn", "desc")
      .onSnapshot((snapshot) => {
        if (snapshot.empty) dispatch(updateCommentsSpot([]));

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
          dispatch(updateCommentsSpot(reactions));
        });
      });

    return unsubscribe;
  }, [dispatch]);

  return (
    <View>
      {spotById && (
        <View style={styles.container}>
          <View style={styles.spotTitleContainer}>
            <Text style={styles.spotTitle}>{spotById.title}</Text>
            <Text style={styles.spotDescription}>{spotById.description}</Text>
          </View>
          <Picture key={spotById.docId} post={spotById} page="Details" />
          <ScrollView style={styles.commentsBox}>
            {spotById.reactions?.length > 0 ? (
              spotById.reactions.map((reaction, index) => {
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

export default SpotDetailsScreen;

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
  spotTitleContainer: {
    marginBottom: 10,
    paddingVertical: 5,
    borderWidth: StyleSheet.hairlineWidth,
    width: "100%",
    backgroundColor: "#fafafa",
  },
  spotTitle: {
    fontFamily: "",
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
  },
  spotDescription: {
    fontFamily: "",
    fontSize: 15,
    textAlign: "center",
  },
});
