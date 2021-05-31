import React, {useState, useEffect} from "react";
import {Text, View, StyleSheet, Image, TouchableOpacity} from "react-native";
import {launchCamera} from "react-native-image-picker";
import {useDispatch, useSelector} from "react-redux";
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import {request, PERMISSIONS} from "react-native-permissions";
import GeoLocation from "@react-native-community/geolocation";
import {createNewPost, resetCreateErrors} from "../../features/posts/postSlice";
import TextBox from "../Common/TextBox";
import Button from "../Common/Button";
import BackArrow from "../navigation/BackArrow";
import {useNavigation} from "@react-navigation/core";

const latitudeDelta = 1 / (69 * 4);
const longitudeDelta = 0;

const CreatePageComponent = ({contentFileType, preview}) => {
  const [title, setTitle] = useState("");
  const [fileSource, setFileSource] = useState(null);
  const [initialPosition, setInitialPosition] = useState(null);
  const [region, setRegion] = useState(null);
  const Preview = preview;
  const dispatch = useDispatch();
  const navigation = useNavigation();
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

  const extraOnClickHandler = () => {
    dispatch(resetCreateErrors());
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

  useEffect(() => {
    setTitle("");
    setFileSource(null);
    setInitialPosition(null);
    setRegion(null);
    uploaded && navigation.navigate("Explore");
  }, [uploaded]);

  if (initialPosition) {
    return (
      <View style={styles.container}>
        <BackArrow
          navigation={navigation}
          to="Create"
          style={styles.backArrow}
          extraOnClickHandler={extraOnClickHandler}
        />
        {/* <View>
          <Text>{isUploading && uploadPercentage}</Text>
        </View> */}
        <TouchableOpacity
          style={styles.previewClickableContainer}
          onPress={() =>
            launchCamera({mediaType: contentFileType}, cameraCallback)
          }>
          <Preview style={styles.postFile} fileSource={fileSource} />
        </TouchableOpacity>
        {errors && <Text style={styles.errorText}>{errors}</Text>}
        <TextBox
          placeholder="Title"
          onChangeText={setTitle}
          placeholderTextColor="grey"
          textColor="black"
          style={styles.textBox}
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
              source={require("../../assets/images/createContent/icon_marker.png")}
            />
          </View>
        </View>
        <Button
          onPress={handleUpload}
          disabled={isUploading}
          text="Post"
          style={styles.uploadButton(isUploading)}
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
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  postFile: {
    width: 250,
    height: 250,
    borderRadius: 5,
    marginTop: "10%",
  },
  previewClickableContainer: {
    height: "50%",
  },
  uploadButton: (disabled) => ({
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    position: "absolute",
    top: "90%",
    left: disabled ? "70%" : "80%",
  }),
  mapContainer: {
    flex: 1,
  },
  map: {
    height: "100%",
    width: 400,
  },
  markerImage: {
    height: 48,
    width: 48,
  },
  markerContainer: {
    top: "50%",
    left: "50%",
    marginLeft: -24,
    marginTop: -48,
    position: "absolute",
  },
  backArrow: {
    position: "absolute",
    top: "2%",
    left: "2%",
  },
  textBox: {
    width: "100%",
    textAlign: "center",
    backgroundColor: "rgb(250, 250, 250)",
    borderWidth: StyleSheet.hairlineWidth,
  },
  errorText: {
    color: "red",
  },
});
