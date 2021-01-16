import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';

import PostPreviewComponent from '../../components/Profile/PostPreviewComponent';

const ProfileScreen = () => {
  const {user} = useSelector((state) => state.auth);

  const handleFollow = () => {
    console.log('trying to follow');
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Image
            source={{uri: 'https://picsum.photos/300/300'}}
            style={styles.profilePicture}
          />
          <TouchableOpacity
            style={[styles.followButton, {backgroundColor: 'red'}]}
            onPress={handleFollow}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <Text
            style={
              styles.userName
            }>{`${user.firstName} ${user.lastName}`}</Text>
        </View>
      </View>
      <ScrollView
        style={styles.postsContainer}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        <PostPreviewComponent source={{uri: 'https://picsum.photos/300/300'}} />
        <PostPreviewComponent source={{uri: 'https://picsum.photos/300/300'}} />
        <PostPreviewComponent source={{uri: 'https://picsum.photos/300/300'}} />
        <PostPreviewComponent source={{uri: 'https://picsum.photos/300/300'}} />
      </ScrollView>
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
