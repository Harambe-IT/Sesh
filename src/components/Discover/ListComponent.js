import React, {useEffect} from "react";
import {Text, View, StyleSheet, ScrollView, RefreshControl} from "react-native";
import {Picture, Spot, Video, Sesh} from "../Explore";

const ListComponent = ({
  postsByLocation,
  spotsByLocation,
  isFetching,
  handleGetNewPosts,
}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const postList =
    (postsByLocation || spotsByLocation) &&
    (postsByLocation?.length || 0) + (spotsByLocation?.length || 0) != 0 ? (
      [...(postsByLocation || []), ...(spotsByLocation || [])].map((post) => {
        switch (post.type) {
          case "picture":
            return <Picture key={post.docId} post={post} page="Discover" />;
          case "clip":
            return <Video key={post.docId} post={post} page="Discover" />;
          default:
            return <Picture key={post.docId} post={post} page="Discover" />;
        }
      })
    ) : (
      <Text>No posts were found.{"\n"}Try posting something yourself.</Text>
    );
  const handleRefresh = () => {
    handleGetNewPosts();
    setRefreshing(true);
  };

  useEffect(() => {
    if (refreshing && !isFetching) setRefreshing(false);
    if (isFetching && !refreshing) setRefreshing(true);
  }, [refreshing, isFetching]);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <View style={styles.container}>{postList}</View>
    </ScrollView>
  );
};

export default ListComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    alignItems: "center",
  },
});
