import React, {useEffect} from 'react';
import {ScrollView, View, Text, StyleSheet, RefreshControl} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {Picture, Spot, Video, Sesh} from '../../components/Explore';
import {getFollowingPosts} from '../../features/posts/postSlice';

const ExploreScreen = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  const {posts, isFetching, errors} = useSelector((state) => state.posts);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = () => {
    dispatch(getFollowingPosts(user));
    setRefreshing(true);
  };

  useEffect(() => {
    dispatch(getFollowingPosts(user));
  }, []);

  useEffect(() => {
    if (refreshing && !isFetching) setRefreshing(false);
    if (isFetching && !refreshing) setRefreshing(true);
  }, [refreshing, isFetching]);

  const postList =
    posts?.length > 0 ? (
      posts.map((post) => {
        switch (post.type) {
          case 'picture':
            return <Picture key={post.docId} post={post} />;
          case 'clip':
            return <Video key={post.docId} post={post} />;
          default:
            return <Picture key={post.docId} post={post} />;
        }
      })
    ) : (
      <Text>No posts were found.</Text>
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
    alignItems: 'center',
    padding: 20,
  },
});
