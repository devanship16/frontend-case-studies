/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useEffect, useState } from 'react';
 import {SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,useColorScheme,View,ImageBackground,Image,TextInput,Pressable, Alert} from 'react-native';
 
 import {Colors,DebugInstructions,  Header,LearnMoreLinks,ReloadInstructions,} from 'react-native/Libraries/NewAppScreen';
 import {externalStyles} from '../common/styles';
 import { RESET_PASSWORD } from '../common/webUtils';
 import { APP_NAME } from '../common/strings';
 import { CustomProgressBar } from '../common/utils';

 function ResetPassword({navigation, route}) {
  const [isLoading, setLoding] = useState(false);

  const { emailId, otp } = route.params;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordDisplay,setNewPasswordDisplay] = useState(true);
  const [confirmPasswordDisplay,setConfirmPasswordDisplay] = useState(true);

  const callResetPassword = async () => {    
    try{
      if (newPassword.trim().length == 0){
        Alert.alert(APP_NAME,"Enter new password");
        return;
      }else if (newPassword.trim().length < 6){
        Alert.alert(APP_NAME,"Password should have atleast 6 characters");
        return;
      } else if (confirmPassword.trim().length == 0){
        Alert.alert(APP_NAME,"Enter confirm password");
        return;
      } else if (confirmPassword != newPassword){
        Alert.alert(APP_NAME,"Confirm password not match with new password");
        return;
      }

      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");

      var formdata = new FormData();
      formdata.append("email", emailId);
      formdata.append("email_otp", otp);
      formdata.append("new_password", newPassword);
      formdata.append("new_password_confirmation", confirmPassword);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      console.log("Request=>"+emailId+","+otp+","+newPassword+","+confirmPassword);
      setLoding(true);
      fetch(RESET_PASSWORD, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);
          
          setLoding(false);

          if (json.status == 1){
            // navigation.navigate('OTP',{
            //   emailId:loginEmail
            // });
            // Alert.alert(APP_NAME,json.message);
            navigation.navigate('SuccessResetPassword');
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
          <TextInput placeholder="New password" secureTextEntry={newPasswordDisplay} selectTextOnFocus={false} 
            style={externalStyles.login_email_edittext}
            onChangeText={text => setNewPassword(text)} 
            value={newPassword}/>
          <Pressable
              onPress={() => newPasswordDisplay ? setNewPasswordDisplay(false) : setNewPasswordDisplay(true)}>
            <Image source={require('../assets/password_show.png')} style={externalStyles.edittext_left_icon} />
          </Pressable>
        </View>
        <View style={externalStyles.login_email_edittext_parent}>
          <TextInput placeholder="Confirm Password" secureTextEntry={confirmPasswordDisplay} selectTextOnFocus={false} 
            style={externalStyles.login_email_edittext}
            onChangeText={text => setConfirmPassword(text)} 
            value={confirmPassword}/>
            <Pressable
                onPress={() => confirmPasswordDisplay ? setConfirmPasswordDisplay(false) : setConfirmPasswordDisplay(true)}>
                <Image source={require('../assets/password_show.png')} style={externalStyles.edittext_left_icon} />
            </Pressable>            
        </View>

        <Pressable  onPress={() => callResetPassword()}>
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
 
 export default ResetPassword;
 