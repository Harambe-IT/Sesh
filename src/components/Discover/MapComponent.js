import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, Image} from "react-native";
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from "react-native-maps";
import {useNavigation} from "@react-navigation/native";

import SpotPin from "../../assets/images/createContent/pin_spot.png";
import VideoPin from "../../assets/images/createContent/pin_video.png";
import PicturePin from "../../assets/images/createContent/pin_picture.png";

const MapComponent = ({
  handleRegionChange,
  postsByLocation,
  spotsByLocation,
  initialPosition,
}) => {
  const [markers, setMarkers] = useState(null);
  const navigation = useNavigation();

  const handleNavigateToDetails = (type, docId) => {
    if (type === "spot") {
      navigation.navigate("Spot Details", {spotId: docId});
    } else {
      navigation.navigate("Post Details", {postId: docId});
    }
  };

  useEffect(() => {
    if (
      (postsByLocation || spotsByLocation) &&
      (postsByLocation?.length || 0) + (spotsByLocation?.length || 0) !=
        markers?.length
    ) {
      setMarkers(
        [...(postsByLocation || []), ...(spotsByLocation || [])].map((post) => {
          const {location, docId, title, type, owner} = post;
          const pinIcon =
            type === "clip" ? VideoPin : type === "spot" ? SpotPin : PicturePin;

          return (
            <Marker
              key={docId}
              icon={pinIcon}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}>
              <Callout
                onPress={() => handleNavigateToDetails(type, docId)}
                tooltip>
                <View>
                  <View style={styles.markerContainer}>
                    <Text style={styles.markerTitle}>{title}</Text>
                    {type === "spot" && post?.description && (
                      <Text style={styles.markerDescription}>
                        {post.description}
                      </Text>
                    )}
                    <Text style={styles.markerCTA}>
                      Press this window to navigate to the {type}
                    </Text>
                    <Text style={styles.markerOwner}>By {owner.username}</Text>
                  </View>
                  <View style={styles.arrowBorder} />
                  <View style={styles.arrow} />
                </View>
              </Callout>
            </Marker>
          );
        }),
      );
    }
  }, [postsByLocation, spotsByLocation]);
  return (
    <View style={styles.mapContainer}>
      {initialPosition ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          onRegionChangeComplete={handleRegionChange}
          initialRegion={initialPosition}>
          {markers}
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 250,
  },
  markerTitle: {
    fontFamily: "",
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 5,
    textAlign: "center",
  },
  markerDescription: {
    fontFamily: "",
    fontSize: 17,
    marginBottom: 5,
    textAlign: "center",
  },
  markerOwner: {
    fontFamily: "",
    fontSize: 10,
    fontWeight: "100",
    fontStyle: "italic",
    textAlign: "center",
  },
  markerCTA: {
    fontFamily: "",
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 10,
    color: "red",
    textAlign: "center",
  },
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
});
