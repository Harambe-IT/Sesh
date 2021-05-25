import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import {useNavigation, useRoute} from "@react-navigation/native";
import React, {useEffect, useMemo} from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import PostPreviewComponent from "../../components/Profile/PostPreviewComponent";
import {updateFollowing} from "../../features/authentication/authenticationSlice";
import {getPostsByUser, getSpotsByUser} from "../../features/posts/postSlice";
import {
  getUserProfile,
  toggleFollow,
} from "../../features/profile/profileSlice";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const uid = route.params?.uid || auth().currentUser.uid;
  const {user} = useSelector((state) => state.profile);
  const authState = useSelector((state) => state.auth);
  const {postsByUser, spotsByUser} = useSelector((state) => state.posts);
  const isFollowing = useMemo(() => {
    return (
      authState.user.following.filter((follow) => follow.followedId === uid)
        .length >= 1
    );
  }, [authState]);

  const handleFollow = () => {
    const followedById = auth().currentUser.uid;
    const followedId = uid;

    dispatch(toggleFollow({followedById, followedId}));
  };

  const handleNavigateToDetails = (docId) => {
    navigation.navigate("Post Details", {postId: docId});
  };

  useEffect(() => {
    if (user?.uid !== uid) {
      dispatch(getUserProfile(uid));
      dispatch(getPostsByUser(uid));
      dispatch(getSpotsByUser(uid));
    }
  }, [uid]);

  useEffect(() => {
    const followingSubscriber = firestore()
      .collection("followers")
      .onSnapshot((snapshot) => {
        let validDocs = snapshot.docs.filter(
          (doc) => doc.data().followedById === auth().currentUser.uid,
        );
        let following = [];
        validDocs.forEach((doc) => {
          following.push({
            docId: doc.id,
            ...doc.data(),
          });
        });

        dispatch(updateFollowing(following));
      });

    return followingSubscriber;
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {user && postsByUser && spotsByUser ? (
        <>
          <View style={[styles.row, styles.userInfoContainer]}>
            <View>
              <Text style={styles.userName}>{user.username}</Text>
              <Image
                source={{uri: "https://picsum.photos/300/300"}}
                style={styles.profilePicture}
              />
            </View>
            <View style={styles.userInfoTextContainer}>
              <Text style={styles.userInfoText}>{`${spotsByUser.length} ${
                spotsByUser.length == 1 ? "Spot" : "Spots"
              }`}</Text>
              <Text style={styles.userInfoText}>{`${postsByUser.length} ${
                postsByUser.length == 1 ? "Post" : "Posts"
              }`}</Text>
            </View>
            {uid !== auth().currentUser.uid && (
              <TouchableOpacity
                onPress={handleFollow}
                style={
                  isFollowing ? styles.unfollowButton : styles.followButton
                }>
                <Text style={styles.followButtonText}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView style={styles.postContainer}>
            {postsByUser.map((post) => {
              return (
                <TouchableOpacity
                  key={post.docId}
                  onPress={() => handleNavigateToDetails(post.docId)}>
                  <PostPreviewComponent
                    type={post.type}
                    source={{uri: post.contentUrl}}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "2%",
  },
  userName: {
    fontFamily: "",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: "2%",
  },
  profilePicture: {
    width: "60%",
    aspectRatio: 1,
    borderRadius: 75,
  },
  row: {
    flexDirection: "row",
  },
  userInfoContainer: {
    backgroundColor: "#fafafa",
    padding: "2%",
    marginBottom: "2%",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  userInfoTextContainer: {
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    marginLeft: "auto",
  },
  userInfoText: {
    fontFamily: "",
    fontSize: 15,
    fontWeight: "bold",
  },
  followButton: {
    backgroundColor: "red",
    width: "36%",
    borderRadius: 10,
    paddingVertical: "2%",
    paddingHorizontal: "4%",
    position: "absolute",
    bottom: "3%",
    left: "2%",
  },
  unfollowButton: {
    backgroundColor: "grey",
    width: "36%",
    borderRadius: 10,
    paddingVertical: "2%",
    paddingHorizontal: "4%",
    position: "absolute",
    bottom: "3%",
    left: "2%",
  },
  followButtonText: {
    fontFamily: "",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  postContainer: {
    borderRadius: 10,
    padding: "1%",
  },
});
