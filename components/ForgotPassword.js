/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useEffect, useState } from 'react';
 import {Modal, ScrollView,StatusBar,TouchableHighlight,Text,ActivityIndicator,View,Image,TextInput,Pressable, Alert} from 'react-native';
 
 import {externalStyles} from '../common/styles';
 import { FORGOT_PASSWORD } from '../common/webUtils';
 import { APP_NAME } from '../common/strings';
 import { CustomProgressBar,validateEmail } from '../common/utils';

 function ForgotPassword({navigation}) {
  const [isLoading, setLoding] = useState(false);
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");

  const callForgotApi = async () => {
    try{
      console.log("Request=>"+loginEmail.trim().length);
      console.log("Request=>"+loginEmail);
      console.log("Request=>"+(loginEmail.trim.length == 0));
      if (loginEmail.trim().length == 0){
        Alert.alert(APP_NAME,"Please enter email");
        return;
      }else if (!validateEmail(loginEmail.trim())){
        Alert.alert(APP_NAME,"Invalide email");
        return;
      }
      
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");

      var formdata = new FormData();
      formdata.append("email", loginEmail);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      console.log("Request=>"+formdata);
      
      setLoding(true);

      fetch(FORGOT_PASSWORD, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log("Result=>"+json);
          setLoding(false);
          if (json.status == 1){
            navigation.navigate('OTP',{
              emailId:loginEmail
            });
          }else{
            Alert.alert(APP_NAME,json.message);
          }
        })
        .catch((error) => {
          setLoding(false);
          console.log("Error=>"+error);
          Alert.alert(APP_NAME,error+"");
        });
    }catch(e){
      setLoding(false);
      console.log("Exception=>"+error+"");
      Alert.alert(APP_NAME,error);
    }
  }

   return (
    <View style={ externalStyles.login_background }>
      {isLoading ? CustomProgressBar(isLoading) : null}
      <StatusBar translucentbarStyle="light-content" backgroundColor='#F5FCFF'/>

        <Pressable onPress={() => navigation.goBack()}>
            <Image source={require('../assets/back.png')} 
                    style={externalStyles.back_button} 
                    />
        </Pressable>

      <ScrollView style={externalStyles.login_scrollview} keyboardShouldPersistTaps={'handled'}>

        <Text style={externalStyles.forgot_header_text}>Forgot Password</Text>
        <Text style={externalStyles.forgot_header_text2}>Please enter your registered email address to recieve a password reset Otp</Text>
        
        <View style={externalStyles.login_email_edittext_parent}>
          <Image source={require('../assets/email_login_inactive.png')} 
              style={isEmailFocused ? externalStyles.edittext_left_icon_active : externalStyles.edittext_left_icon} />
          <TextInput caretHidden={false} placeholder="Email" keyboardType="email-address" selectTextOnFocus={false} 
            style={externalStyles.login_email_edittext}
            onFocus={() =>setEmailFocused(true) }
            onBlur={() => (loginEmail.length>0) ? setEmailFocused(true) : setEmailFocused(false) }
            onChangeText={text => setLoginEmail(text)} 
            value={loginEmail}/>
        </View>

        <Pressable  onPress={() => callForgotApi()}>
          <View style={externalStyles.login_btn_background}>
            <Text style={externalStyles.login_btn_text}>
              RESET PASSWORD
            </Text>
          </View>
        </Pressable>

      </ScrollView>
    </View>
   );
 };
 
 export default ForgotPassword;
 