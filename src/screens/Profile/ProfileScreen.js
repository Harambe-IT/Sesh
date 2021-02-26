import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';

import {getUserProfile} from '../../features/profile/profileSlice';
import {getPostsByUser, getSpotsByUser} from '../../features/posts/postSlice';
import PostPreviewComponent from '../../components/Profile/PostPreviewComponent';

const ProfileScreen = ({route}) => {
  const dispatch = useDispatch();
  const {uid} = route.params;
  const {user} = useSelector((state) => state.profile);
  const {postsByUser, spotsByUser} = useSelector((state) => state.posts);

  const handleFollow = () => {
    console.log('trying to follow');
  };

  useEffect(() => {
    if (user?.uid !== uid) {
      dispatch(getUserProfile(uid));
      dispatch(getPostsByUser(uid));
      dispatch(getSpotsByUser(uid));
    }
  }, [uid]);

  return (
    <View style={styles.container}>
      {user && postsByUser && spotsByUser ? (
        <>
          <View style={styles.row}>
            <View style={styles.column}>
              <Image
                source={{uri: 'https://picsum.photos/300/300'}}
                style={styles.profilePicture}
              />
              {uid !== auth().currentUser.uid && (
                <TouchableOpacity
                  style={[styles.followButton, {backgroundColor: 'red'}]}
                  onPress={handleFollow}>
                  <Text style={styles.followText}>Follow</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.column}>
              <Text style={styles.userName}>{user.username}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text>{`${spotsByUser.length}`}</Text>
              <Text>{'Spots'}</Text>
            </View>
            <View style={styles.column}>
              <Text>{`${postsByUser.length}`}</Text>
              <Text>{'Posts'}</Text>
            </View>
          </View>
          <ScrollView
            style={styles.postsContainer}
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {postsByUser.map((post) => {
              return (
                <PostPreviewComponent
                  key={post.docId}
                  source={{uri: post.contentUrl}}
                />
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 25,
  },
  column: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  postsContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 25,
  },
  followButton: {
    width: 100,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: -20,
  },
  followText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
