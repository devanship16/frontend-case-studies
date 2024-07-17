/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useEffect, useState } from 'react';
 import {SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,useColorScheme,View,ImageBackground,Image,TextInput,Pressable, Alert, BackHandler} from 'react-native';
 
 import {Colors,DebugInstructions,  Header,LearnMoreLinks,ReloadInstructions,} from 'react-native/Libraries/NewAppScreen';
 import {externalStyles} from '../common/styles';
 import { RESET_PASSWORD } from '../common/webUtils';
 import { APP_NAME } from '../common/strings';
 import { CustomProgressBar } from '../common/utils';

 function SuccessResetPassword({navigation}) {
  BackHandler.addEventListener('hardwareBackPress', function() {
    return false;
  });

  const [isLoading, setLoding] = useState(false);

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


      var formdata = new FormData();
      formdata.append("email", emailId);
      formdata.append("email_otp", otp);
      formdata.append("new_password", newPassword);
      formdata.append("new_password_confirmation", confirmPassword);

      var requestOptions = {
        method: 'POST',
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
            Alert.alert(APP_NAME,json.message);
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

      <ScrollView style={externalStyles.login_scrollview} keyboardShouldPersistTaps={'handled'}>

        <Text style={externalStyles.forgot_header_text}>Reset Password</Text>
        <Text style={externalStyles.forgot_header_text2}>Your password has been reset successfully</Text>
        

        <Pressable  onPress={() => navigation.navigate('Login')}>
          <View style={externalStyles.login_btn_background}>
            <Text style={externalStyles.login_btn_text}>
            GO TO SIGN IN
            </Text>
          </View>
        </Pressable>

      </ScrollView>
    </View>
   );
 };
 
 export default SuccessResetPassword;
 