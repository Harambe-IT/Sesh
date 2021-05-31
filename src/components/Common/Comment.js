import React from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import {useSelector} from "react-redux";

const Comment = ({comment}) => {
  const {createdOn, docId, owner, text} = comment;
  const {user} = useSelector((state) => state.auth);

  return (
    <View style={styles.commentContainer}>
      <Image
        style={styles.tinyProfilePicture}
        source={{uri: `https://picsum.photos/200/300?random=${docId}`}}
      />
      <Text
        style={user.uid === owner.uid ? styles.ownUserName : styles.ownerName}>
        {user.uid === owner.uid ? "You" : owner.username}:
      </Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row",
  },
  tinyProfilePicture: {
    width: 25,
    height: 25,
    borderRadius: 25,
    marginRight: 4,
    marginBottom: 5,
  },
  ownerName: {
    fontWeight: "bold",
    fontFamily: "",
    marginRight: 2,
  },
  ownUserName: {
    fontWeight: "bold",
    color: "red",
    fontFamily: "",
    marginRight: 2,
  },
  text: {
    flexWrap: "wrap",
    maxWidth: "90%",
  },
});
