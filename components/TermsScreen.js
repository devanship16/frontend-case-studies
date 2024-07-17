import React, { useEffect, useState } from 'react';
import {ScrollView,Text,View,Image,Pressable,Linking,Platform} from 'react-native';
import {externalStyles} from '../common/styles';
import { LOGIN } from '../common/webUtils';
import { APP_NAME, TERMS_OF_SERVICE } from '../common/strings';
import { CustomProgressBar,validateEmail } from '../common/utils';
import { saveSession,USER_ID,FIRST_NAME,LAST_NAME,EMAIL,ACCESS_TOKEN,PROFILE_IMG,PHONE } from '../common/LocalStorage';

export function TermsScreen({navigation}) {

    return (
        <View style={externalStyles.column_parent}>
          <View style={externalStyles.column_parent}>
            <View style={externalStyles.setting_row_parent}>
              <Pressable onPress={() => navigation.goBack()}>
                <Image style={externalStyles.back_button2} source={require('../assets/back.png')}/>
              </Pressable>
              <Text style={externalStyles.setting_title_text}>Terms of Service</Text>
            </View>
            <View style={externalStyles.setting_divider}/>
    
            <ScrollView keyboardShouldPersistTaps={'handled'} style={{backgroundColor:"white"}}>
                <View style={externalStyles.privacy_row_parent}>
                    <Text style={externalStyles.privacy_text}>
                    {/* Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    
                    Why do we use it?
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    
                    Why do we use it?
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). */}
                     {/* new change */}
                    {TERMS_OF_SERVICE}
                    </Text>
                </View>
            </ScrollView>
            
          </View>
        </View>
      );
      }
    