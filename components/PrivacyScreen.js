import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, Pressable, Linking, Platform } from 'react-native';
import { externalStyles } from '../common/styles';
import { LOGIN } from '../common/webUtils';
import { APP_NAME, PRIVACY_POLICY } from '../common/strings';
import { CustomLoginProgressBar, validateEmail } from '../common/utils';
import { saveSession, USER_ID, FIRST_NAME, LAST_NAME, EMAIL, ACCESS_TOKEN, PROFILE_IMG, PHONE } from '../common/LocalStorage';
import { WebView } from 'react-native-webview';

export function PrivacyScreen({ navigation, route }) {

  const [isLoading, setIsLoding] = useState(false);//new change

  const hideSpinner = () => {
    CustomLoginProgressBar(true)
  };

  return (
    <View style={externalStyles.column_parent}>
      <View style={externalStyles.column_parent}>
        <View style={externalStyles.setting_row_parent}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image style={externalStyles.back_button2} source={require('../assets/back.png')} />
          </Pressable>
          <Text style={externalStyles.setting_title_text1}>{route.params.title}</Text>
        </View>
        <View style={externalStyles.setting_divider} />
        <WebView source={{ uri: route.params.link }}
          onLoad={() => hideSpinner()}
          onLoadStart={() => {
            setIsLoding(true)
            hideSpinner()
          }}
          onLoadEnd={() => {
            setIsLoding(false)
            hideSpinner()
          }}
          scalesPageToFit={false}
          setDisplayZoomControls={false}
          setBuiltInZoomControls={false}
        />
      </View>
    </View>
  );
}
