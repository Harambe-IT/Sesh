import React from 'react';
import {ScrollView, View, Button, StyleSheet} from 'react-native';

import auth from '@react-native-firebase/auth';

import {Picture, Spot, Video, Sesh} from '../../components/Explore';

const ExploreScreen = () => {
  // Get the posts from the database, placeholder for now
  const posts = [
    {
      id: 1,
      owner: {
        name: 'Test name 1',
        profilePictureURL: {uri: 'https://via.placeholder.com/300.png'},
      },
      likes: [{ownerId: '5FxQShUQfOY13w6aSAXsmSkm5uJ3'}],
      reactions: [{owner: 'TestReactionOwner', content: 'Nice spot'}],
      content: {
        type: 'Picture',
        contentURL: {uri: 'https://picsum.photos/200/300'},
      },
    },
    {
      id: 2,
      owner: {
        name: 'Test name 1',
        profilePictureURL: {uri: 'https://via.placeholder.com/300.png'},
      },
      likes: [{owner: 'TestLikeOwner'}],
      reactions: [{owner: 'TestReactionOwner', content: 'Nice spot'}],
      content: {
        type: 'Video',
        contentURL: {
          uri:
            'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
      },
    },
    {
      id: 3,
      owner: {
        name: 'Test name 1',
        profilePictureURL: {uri: 'https://via.placeholder.com/300.png'},
      },
      likes: [{owner: 'TestLikeOwner'}],
      reactions: [{owner: 'TestReactionOwner', content: 'Nice spot'}],
      content: {
        type: 'Picture',
        contentURL: {uri: 'https://picsum.photos/200/300'},
      },
    },
    {
      id: 4,
      owner: {
        name: 'Test name 1',
        profilePictureURL: {uri: 'https://via.placeholder.com/300.png'},
      },
      likes: [{owner: 'TestLikeOwner'}],
      reactions: [{owner: 'TestReactionOwner', content: 'Nice spot'}],
      content: {
        type: 'Picture',
        contentURL: {uri: 'https://picsum.photos/200/300'},
      },
    },
  ];

  const postList = posts.map((post) => {
    switch (post.content.type) {
      case 'Picture':
        return <Picture key={post.id} post={post} />;
      case 'Video':
        return <Video key={post.id} post={post} />;
      default:
        return <Picture key={post.id} post={post} />;
    }
  });

  return (
    <ScrollView>
      <View style={styles.container}>{postList}</View>
      <Button
        onPress={() => {
          auth().signOut();
        }}
        title="Logout"
        color="#841584"
        accessibilityLabel="Logout using this button"
      />
    </ScrollView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 20,
  },
});
