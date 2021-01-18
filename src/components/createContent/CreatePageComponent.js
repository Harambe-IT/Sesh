import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {request, PERMISSIONS} from 'react-native-permissions';
import GeoLocation from '@react-native-community/geolocation';

import {createNewPost} from '../../features/posts/postSlice';
import TextBox from '../Design/TextBox';
import PrimaryButton from '../Design/CupertinoButtonDanger';
import BackArrow from '../navigation/BackArrow';

const CreatePageComponent = ({contentFileType, preview, navigation}) => {
  const [title, setTitle] = useState('');
  const [fileSource, setFileSource] = useState(null);
  const [initialPosition, setInitialPosition] = useState(null);
  const [region, setRegion] = useState(null);
  const Preview = preview;
  const latitudeDelta = 1 / (69 * 4);
  const longitudeDelta = 0;

  const dispatch = useDispatch();
  const {isUploading, errors, uploadPercentage, uploaded} = useSelector(
    (state) => state.posts,
  );

  const cameraCallback = (response) => {
    if (!response.didCancel && !response.error) {
      const uri = response.uri;
      const type = response.type;
      const name = response.fileName;
      const source = {
        uri,
        type,
        name,
      };
      setFileSource(source);
    }
  };

  const handleUpload = () => {
    if (!isUploading) {
      dispatch(createNewPost({fileSource: fileSource, title, region}));
    }
  };

  const requestLocationPermission = async () => {
    let response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    if (response === 'granted') {
      locateCurrentPosition();
    }
  };

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
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000},
    );
  };

  const handleRegionChange = (region) => {
    setRegion(region);
  };

  useEffect(() => {
    setTitle('');
    setFileSource(null);
    setInitialPosition(null);
    setRegion(null);
    uploaded && navigation.navigate('Explore');
  }, [uploaded]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  if (initialPosition) {
    return (
      <View style={styles.container}>
        <View>
          <BackArrow
            navigation={navigation}
            to="Create"
            style={styles.backArrow}
          />
        </View>
        {/* <View>
          <Text>{isUploading && uploadPercentage}</Text>
        </View> */}
        <View>
          <TouchableOpacity
            onPress={() =>
              launchCamera({mediaType: contentFileType}, cameraCallback)
            }>
            <Preview style={styles.postFile} fileSource={fileSource} />
          </TouchableOpacity>
        </View>
        <TextBox
          placeholder="Title"
          onChangeText={setTitle}
          placeholderTextColor="grey"
          textColor="black"
          errors={errors?.title || errors?.generic}
        />
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            onRegionChangeComplete={handleRegionChange}
            initialRegion={initialPosition}
          />
          <View style={styles.markerContainer}>
            <Image
              style={styles.markerImage}
              source={require('../../assets/images/createContent/icon_marker.png')}
            />
          </View>
        </View>

        <PrimaryButton
          onPress={handleUpload}
          disabled={isUploading}
          text="Post"
          style={styles.uploadButton}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>Please enable location to use this feature</Text>
      </View>
    );
  }
};

export default CreatePageComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  postFile: {
    width: 250,
    height: 250,
    borderRadius: 5,
  },
  uploadButton: {
    paddingVertical: 10,
    borderRadius: 25,
    position: 'absolute',
    top: '100%',
    left: '100%',
    marginLeft: -50,
    marginTop: -30,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    height: 220,
    width: 400,
  },
  markerImage: {
    height: 48,
    width: 48,
  },
  markerContainer: {
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
  },
  backArrow: {
    position: 'absolute',
    left: -200,
  },
});
