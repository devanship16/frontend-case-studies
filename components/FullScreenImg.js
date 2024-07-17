import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, Pressable, Linking, StyleSheet, BackHandler } from 'react-native';
import { externalStyles } from '../common/styles';
import { LOGIN } from '../common/webUtils';
import { APP_NAME } from '../common/strings';
import { CustomProgressBar, validateEmail } from '../common/utils';
import { saveSession, USER_ID, FIRST_NAME, LAST_NAME, EMAIL, ACCESS_TOKEN, PROFILE_IMG, PHONE } from '../common/LocalStorage';
/*
For video

https://github.com/react-native-video/react-native-video
npm install --save react-native-video
*/
import Video from 'react-native-video';

export function FullScreenImg({ navigation, route }) {
  const isImage = route.params.isImage;
  const isVideo = route.params.isVideo;
  const url = route.params.url;

  const [isLoading, setLoding] = useState(true);


  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };

    // Return the function to unsubscribe from the event so it gets removed on unmount
  }, []);

  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  return (
    <View style={externalStyles.column_parent}>
      {isLoading ? CustomProgressBar(isLoading) : null}
      {
        isVideo == 1 ?
          <Video source={{ uri: url }}   // Can be a URL or a local file.
            controls={true}
            hideShutterView={true}
            resizeMode="contain"
            onLoad={() => { console.log('onLoad'); setLoding(false); }}
            // onLoadStart={src => { console.log('onLoadStart', src);  setLoding(true);}}
            onEnd={() => console.log('onEnd')}
            onError={err => console.error(err)}
            // poster="https://baconmockup.com/300/200/"
            style={styles.backgroundVideo} />
          /* <Pressable onPress={() => navigation.goBack()}>
              <Image style={externalStyles.fullscreen_back_button} source={require('../assets/back.png')}/>
          </Pressable> */
          :
          <View>
            <Pressable onPress={() => navigation.goBack()}>
              <Image style={externalStyles.fullscreen_back_button} source={require('../assets/back.png')}
                onLoadEnd={e => {
                  setLoding(false);
                }} />
            </Pressable>
            <Image style={externalStyles.fullscreen_chat_image_back} source={{ uri: url, }} />
          </View>
      }

      {
        isVideo == 1 ?
          <Pressable onPress={() => navigation.goBack()}>
            <Image style={externalStyles.fullscreen_back_button} source={require('../assets/back.png')} />
          </Pressable> : null
      }
    </View>
  );
}

var styles = StyleSheet.create({
  backgroundVideo: {
    height: "100%",
    width: "100%",
    position: 'absolute', top: '0%',
  },
});
