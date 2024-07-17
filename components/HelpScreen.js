import React, { useEffect, useState } from 'react';
import {ScrollView,Text,View,Image,Pressable,Linking,Platform} from 'react-native';
import {externalStyles} from '../common/styles';
import { LOGIN } from '../common/webUtils';
import { ADDRESS_GLOBAL, APP_NAME, EMAIL_GLOBAL, EMAIL_TO, LABEL_GLOBAL, LATE_GLOBAL, PHONE_NO_GLOBAL } from '../common/strings';
import { CustomProgressBar,validateEmail } from '../common/utils';
import { saveSession,USER_ID,FIRST_NAME,LAST_NAME,EMAIL,ACCESS_TOKEN,PROFILE_IMG,PHONE } from '../common/LocalStorage';

export function HelpScreen({navigation}) {

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'}>
      <View style={externalStyles.column_parent}>
        <View style={externalStyles.setting_row_parent}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image style={externalStyles.back_button2} source={require('../assets/back.png')}/>
          </Pressable>
          <Text style={externalStyles.setting_title_text1}>Help</Text>
        </View>
        <View style={externalStyles.setting_divider}/>

        <View style={externalStyles.help_row_parent}>
          <Pressable onPress={() => Linking.openURL(`mailto:`+EMAIL_TO)}>
            <View style={externalStyles.help_row_subparent}>
                <Image style={externalStyles.help_menu_icon} source={require('../assets/help_mail.png')}/>
                <Text style={externalStyles.appsetting_text_1}>{EMAIL_GLOBAL}</Text>
            </View>
          </Pressable>
          {/* <View style={externalStyles.setting_divider}/>
          <Pressable onPress={() => Linking.openURL(`tel:`+PHONE_NO_GLOBAL)}>
            <View style={externalStyles.help_row_subparent}>
                <Image style={externalStyles.help_menu_icon} source={require('../assets/help_phone.png')}/>
                <Text style={externalStyles.appsetting_text_1}>{PHONE_NO_GLOBAL}</Text>
            </View>
          </Pressable>
          <View style={externalStyles.setting_divider}/>
          <Pressable onPress={() => {
                const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                // const latLng = `${lat},${lng}`;
                const latLng = LATE_GLOBAL;
                const label = LABEL_GLOBAL;
                const url = Platform.select({
                  ios: `${scheme}${label}@${latLng}`,
                  android: `${scheme}${latLng}(${label})`
                });
                
                Linking.openURL(url);  
            }}>
            <View style={externalStyles.help_row_subparent}>
                <Image style={externalStyles.help_menu_icon} source={require('../assets/help_location.png')}/>
                <Text style={externalStyles.appsetting_text_1}>{ADDRESS_GLOBAL}</Text>
            </View>
          </Pressable> */}
        </View>
        
      </View>
    </ScrollView>
  );
  }
