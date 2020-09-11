import React from 'react';
import {ScrollView, View, Button, Text} from 'react-native';

import auth from '@react-native-firebase/auth';

import Post from '../../components/Explore/Post';

const ExploreScreen = () => {
  // Get the posts from the database, placeholder for now
  const posts = [
    {
      id: 1,
      Owner: {
        Name: 'Test Name 1',
        ProfilePictureURL: {uri: 'https://via.placeholder.com/300.png'},
      },
      Likes: [{Owner: 'TestLikeOwner', Like: true}],
      Reactions: [{Owner: 'TestReactionOwner', Content: 'Nice spot'}],
      Content: {
        Type: 'Picture',
        ContentURL: {uri: 'https://picsum.photos/200/300'},
      },
    },
    {
      id: 2,
      Owner: {
        Name: 'Test Name 1',
        ProfilePictureURL: {uri: 'https://via.placeholder.com/300.png'},
      },
      Likes: [{Owner: 'TestLikeOwner', Like: true}],
      Reactions: [{Owner: 'TestReactionOwner', Content: 'Nice spot'}],
      Content: {
        Type: 'Picture',
        ContentURL: {uri: 'https://picsum.photos/200/300'},
      },
    },
    {
      id: 3,
      Owner: {
        Name: 'Test Name 1',
        ProfilePictureURL: {uri: 'https://via.placeholder.com/300.png'},
      },
      Likes: [{Owner: 'TestLikeOwner', Like: true}],
      Reactions: [{Owner: 'TestReactionOwner', Content: 'Nice spot'}],
      Content: {
        Type: 'Picture',
        ContentURL: {uri: 'https://picsum.photos/200/300'},
      },
    },
    {
      id: 4,
      Owner: {
        Name: 'Test Name 1',
        ProfilePictureURL: {uri: 'https://via.placeholder.com/300.png'},
      },
      Likes: [{Owner: 'TestLikeOwner', Like: true}],
      Reactions: [{Owner: 'TestReactionOwner', Content: 'Nice spot'}],
      Content: {
        Type: 'Picture',
        ContentURL: {uri: 'https://picsum.photos/200/300'},
      },
    },
  ];

  const postList = posts.map((post) => {
    return <Post key={post.id} post={post} />;
  });

  return (
    <ScrollView>
      <View>{postList}</View>
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
