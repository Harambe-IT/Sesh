import React, {useState, useEffect} from "react";
import {View, Button, Text, TouchableOpacity, StyleSheet} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {request, PERMISSIONS} from "react-native-permissions";
import GeoLocation from "@react-native-community/geolocation";

import {getAllPostsByRegion} from "../../features/posts/postSlice";
import MapComponent from "../../components/Discover/MapComponent";
import ListComponent from "../../components/Discover/ListComponent";

const DiscoverScreen = () => {
  const dispatch = useDispatch();
  const {isFetching, errors, postsByLocation} = useSelector(
    (state) => state.posts,
  );
  const [viewMap, setViewMap] = useState(true);
  const [initialPosition, setInitialPosition] = useState(null);
  const [region, setRegion] = useState(null);
  const latitudeDelta = 1 / 110.4; // Around 1km viewdistance
  const longitudeDelta = 0;

  const locateCurrentPosition = () => {
    GeoLocation.getCurrentPosition(
      (position) => {
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta,
          longitudeDelta,
        };
        setInitialPosition(region);
      },
      (error) => console.log(error.message),
      {enableHighAccuracy: true, timeout: 10000},
    );
  };

  const handleRegionChange = (region) => {
    setRegion(region);
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      let response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (response === "granted") {
        locateCurrentPosition();
      } else {
        requestLocationPermission();
      }
    };

    if (!initialPosition) requestLocationPermission();
  }, [initialPosition]);

  const handleGetNewPosts = () => {
    dispatch(getAllPostsByRegion(region));
  };

  useEffect(() => {
    if (region) {
      handleGetNewPosts();
    }
  }, [region]);

  const handlePageChange = () => {
    setViewMap((vm) => !vm);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigationalHeader}>
        <TouchableOpacity
          onPress={handlePageChange}
          style={[
            viewMap ? styles.navButtonFocused : styles.navButton,
            {marginLeft: "auto", marginRight: 5},
          ]}>
          <Text>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePageChange}
          style={[
            viewMap ? styles.navButton : styles.navButtonFocused,
            {marginLeft: 5, marginRight: 10},
          ]}>
          <Text>List</Text>
        </TouchableOpacity>
      </View>
      {viewMap ? (
        <MapComponent
          handleRegionChange={handleRegionChange}
          postsByLocation={postsByLocation}
          initialPosition={initialPosition}
        />
      ) : (
        <ListComponent
          postsByLocation={postsByLocation}
          isFetching={isFetching}
          handleGetNewPosts={handleGetNewPosts}
        />
      )}
    </View>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationalHeader: {
    position: "absolute",
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
    width: "100%",
    zIndex: 100,
  },
  navButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#ffd9d6",
    borderRadius: 5,
    borderColor: "#000",
    borderWidth: 0.5,
  },
  navButtonFocused: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
});
