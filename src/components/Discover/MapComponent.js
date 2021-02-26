import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {WebView} from 'react-native-webview';

const MapComponent = ({
  handleRegionChange,
  postsByLocation,
  initialPosition,
}) => {
  const [markers, setMarkers] = useState(null);

  useEffect(() => {
    if (postsByLocation && postsByLocation?.length != markers?.length) {
      setMarkers(
        postsByLocation.map((post) => {
          const {contentUrl, location, docId, title, type, owner} = post;
          return (
            <Marker
              key={docId}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}>
              <Callout>
                <View>
                  <View style={styles.markerContainer}>
                    <Text style={styles.markerTitle}>{title}</Text>
                    <Text
                      style={styles.markerOwner}>{`By ${owner.username}`}</Text>
                    {type === 'clip' ? (
                      <Text>The video is available in the list view</Text>
                    ) : (
                      <WebView
                        style={styles.markerImage}
                        source={{uri: contentUrl}}
                      />
                    )}
                  </View>
                </View>
              </Callout>
            </Marker>
          );
        }),
      );
    }
  }, [postsByLocation]);
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
    padding: 5,
  },
  markerImage: {
    width: 175,
    height: 175,
  },
  markerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  markerOwner: {
    fontSize: 10,
    fontWeight: '100',
    fontStyle: 'italic',
  },
});
