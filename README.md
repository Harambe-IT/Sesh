# Sesh

## Setup

### Node environment

Make sure you have NodeJS installed.([NodeJS Website](https://nodejs.org/en/))

After that, navigate with a terminal to the main folder: `../Sesh`.  
Install all the required dependencies with `npm install`.

### Firebase environment

Make sure you have access to the cloud console of the project. ([Firebase Project](https://console.firebase.google.com/u/2/project/social-app-24a9a/overview))

Navigate to the settings of the android project and download the google-services.json file. ([Android Firebase Settings](https://console.firebase.google.com/u/2/project/social-app-24a9a/settings/general/android:com.socialapp))

Once downloaded, place the file in the correct folder: `../Sesh/android/app/google-services.json`.

Add a dev.js file in `../Sesh/src/config/` directory.  
This file should contain your google access keys, the file will look like this:  
(keys found at [Authentication methods](https://console.firebase.google.com/u/2/project/social-app-24a9a/authentication/providers) by opening the Google Signin tab)

```js
export const googleClientID = 'YOUR_GOOGLECLIENTID_HERE';
export const googleClientSecret = 'YOUR_GOOGLECLIENTSECRET_HERE';
```

If you still have issues with the firebase configuration, follow the steps on the [package's official page](https://rnfirebase.io/).  
Normally these steps should already be completed, but you can try this if nothing else works.

### Running the project

Firstly make sure you have an Android Virtual Device (= AVD) or an actual device connected to your pc.

For an AVD you'll need to configure the android environement.  
Follow the steps on this page for this: [React Native Develop Environement](https://reactnative.dev/docs/environment-setup)

Select `React Native CLI Quickstart`, after that make sure to select `Windows` and `Android`.

For a physical device you'll need to enable usb-debugging on your phone (developer settings -> USB Debugging).  
After that you can get a program to emulate your screen on your pc (NOT NEEDED; the app will also build on your phone).  
[Tutorial to mirror screen to your pc](https://www.phonearena.com/news/How-to-mirror-your-Android-phone-to-PC-for-free-with-full-keyboard-and-mouse-support_id124118)
If you've mirrored your phone's screen you should also be able to connect with a react app.

After having an emulator, navigate in a terminal to `../Sesh` and execute `npx react-native run-android`. This will build all the files and link the libraries.
The first time, this will take a while. After first build, consequent builds get faster.

The app should be automatically installed on your phone.
