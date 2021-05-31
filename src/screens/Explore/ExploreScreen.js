import {useNavigation} from "@react-navigation/core";
import React, {useEffect} from "react";
import {RefreshControl, ScrollView, StyleSheet, Text, View} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import {useDispatch, useSelector} from "react-redux";
import {Picture, Video} from "../../components/Explore";
import {getFollowingPosts} from "../../features/posts/postSlice";

const ExploreScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {user} = useSelector((state) => state.auth);
  const {postsFollowing, isFetching, errors} = useSelector(
    (state) => state.posts,
  );

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = () => {
    dispatch(getFollowingPosts(user));
    setRefreshing(true);
  };

  const handleNavigateToDiscover = () => {
    navigation.navigate("Discover");
  };

  const handleNavigateToDetails = (docId) => {
    navigation.navigate("Post Details", {postId: docId});
  };

  useEffect(() => {
    dispatch(getFollowingPosts(user));
  }, []);

  useEffect(() => {
    if (refreshing && !isFetching) setRefreshing(false);
    if (isFetching && !refreshing) setRefreshing(true);
  }, [refreshing, isFetching]);

  const postList =
    postsFollowing?.length > 0 ? (
      postsFollowing.map((post) => {
        switch (post.type) {
          case "picture":
            return <Picture key={post.docId} post={post} page="Explore" />;
          case "clip":
            return <Video key={post.docId} post={post} page="Explore" />;
        }
      })
    ) : (
      <>
        <Text style={styles.text}>No posts were found.</Text>
        <Text style={styles.text}>
          Try following someone or posting something yourself.
        </Text>
        <TouchableOpacity onPress={handleNavigateToDiscover}>
          <Text style={styles.link}>Start by discovering new things</Text>
        </TouchableOpacity>
      </>
    );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <View style={styles.container}>{postList}</View>
    </ScrollView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontFamily: "",
    textAlign: "center",
  },
  link: {
    fontFamily: "",
    color: "red",
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: "50%",
    fontSize: 25,
  },
});
