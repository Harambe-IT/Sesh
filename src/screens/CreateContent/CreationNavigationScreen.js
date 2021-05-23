import React from "react";
import {View, StyleSheet} from "react-native";

import {createStackNavigator} from "@react-navigation/stack";
const Stack = createStackNavigator();

import CreateClipScreen from "./CreateClipScreen";
import CreateEventScreen from "./CreateEventScreen";
import CreatePictureScreen from "./CreatePictureScreen";
import CreateSeshScreen from "./CreateSeshScreen";
import CreateSkateparkScreen from "./CreateSkateparkScreen";
import CreateSpotScreen from "./CreateSpotScreen";

import NavigationalTile from "../../components/createContent/NavigationalTile";

const CreationNavigationScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <NavigationalTile
          image={require("../../assets/images/createContent/icon_sessions.png")}
          title="Create Sesh"
          navigation={navigation}
          routeName="Create A Session"
        />
        <NavigationalTile
          image={require("../../assets/images/createContent/icon_spots.png")}
          title="Create Spot"
          navigation={navigation}
          routeName="Create A Spot"
        />
      </View>
      <View style={styles.row}>
        <NavigationalTile
          image={require("../../assets/images/createContent/icon_events.png")}
          title="Create Event"
          navigation={navigation}
          routeName="Create An Event"
        />
        <NavigationalTile
          image={require("../../assets/images/createContent/icon_skateparks.png")}
          title="Create Skatepark"
          navigation={navigation}
          routeName="Create A Skatepark"
        />
      </View>
      <View style={styles.row}>
        <NavigationalTile
          image={require("../../assets/images/createContent/icon_clips.png")}
          title="Create Clip"
          navigation={navigation}
          routeName="Upload A Clip"
        />
        <NavigationalTile
          image={require("../../assets/images/createContent/icon_pictures.png")}
          title="Create Picture"
          navigation={navigation}
          routeName="Upload A Picture"
        />
      </View>
    </View>
  );
};

const CreationPagesStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Create"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Create"
        children={(props) => <CreationNavigationScreen {...props} />}
      />
      <Stack.Screen
        name="Upload A Clip"
        children={(props) => <CreateClipScreen {...props} />}
      />
      <Stack.Screen
        name="Create An Event"
        children={(props) => <CreateEventScreen {...props} />}
      />
      <Stack.Screen
        name="Upload A Picture"
        children={(props) => <CreatePictureScreen {...props} />}
      />
      <Stack.Screen
        name="Create A Session"
        children={(props) => <CreateSeshScreen {...props} />}
      />
      <Stack.Screen
        name="Create A Skatepark"
        children={(props) => <CreateSkateparkScreen {...props} />}
      />
      <Stack.Screen
        name="Create A Spot"
        children={(props) => <CreateSpotScreen {...props} />}
      />
    </Stack.Navigator>
  );
};

export default CreationPagesStack;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
});
