/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useEffect, useState, useRef } from 'react';
 import {SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,useColorScheme,View,ImageBackground,Image,TextInput,Pressable, Alert} from 'react-native';
 
 import {Colors,DebugInstructions,  Header,LearnMoreLinks,ReloadInstructions,} from 'react-native/Libraries/NewAppScreen';
 import {externalStyles} from '../common/styles';
 import { FORGOT_PASSWORD } from '../common/webUtils';
 import { APP_NAME } from '../common/strings';
 import { CustomProgressBar,validateEmail } from '../common/utils';

 function OTP({navigation,route}) {
    const [isLoading, setLoding] = useState(false);

    const { emailId } = route.params;

    const otp_input_1 = useRef();
    const otp_input_2 = useRef();
    const otp_input_3 = useRef();
    const otp_input_4 = useRef();

    const [otp1, setOtp1] = useState('');
    const [otp2, setOtp2] = useState('');
    const [otp3, setOtp3] = useState('');
    const [otp4, setOtp4] = useState('');

  const [isEmailFocused, setEmailFocused] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");

  const callSendOTP = async () => {
    try{
      var formdata = new FormData();
      formdata.append("email", emailId);

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };
      console.log("Request=>"+formdata);
      
      setLoding(true);

      fetch(FORGOT_PASSWORD, requestOptions)
        .then(response => response.json())
        .then((json) => {
          setLoding(false);
          console.log("Result=>"+json);

          if (json.status == 1){
            Alert.alert(APP_NAME,json.message);
          }else{
            Alert.alert(APP_NAME,json.message);
          }
        } )
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

        <Text style={externalStyles.forgot_header_text}>Enter OTP</Text>
        <Text style={externalStyles.forgot_header_text2}>Please enter the 4 digit verification code sent~{"\n"}to <Text style={{color: '#00ABE9'}}>{emailId}</Text></Text>

        <View style={externalStyles.row_parent}>
            <TextInput keyboardType="number-pad" style={(otp1.length == 1) ? externalStyles.otp_textinput_active : externalStyles.otp_textinput}
                maxLength={1} returnKeyType="next" ref={otp_input_1} value={otp1}
                onChangeText={text => {
                    setOtp1(text);
                    if(text.length == 1){
                        otp_input_2.current.focus();
                    }
                }}/>

            <TextInput keyboardType="number-pad" style={(otp2.length == 1) ? externalStyles.otp_textinput_active : externalStyles.otp_textinput}
                maxLength={1} returnKeyType="next" ref={otp_input_2} value={otp2}
                onChangeText={text => {
                    setOtp2(text);
                    if(text.length == 1){
                        otp_input_3.current.focus();
                    }else if(text.length == 0){
                        otp_input_1.current.focus();
                     }
                }}/>

            <TextInput keyboardType="number-pad" style={(otp3.length == 1) ? externalStyles.otp_textinput_active : externalStyles.otp_textinput}
                maxLength={1} returnKeyType="next" ref={otp_input_3} value={otp3}
                onChangeText={text => {
                    setOtp3(text);
                    if(text.length == 1){
                        otp_input_4.current.focus();
                    }else if(text.length == 0){
                        otp_input_2.current.focus();
                     }
                }}/>

            <TextInput keyboardType="number-pad" style={(otp4.length == 1) ? externalStyles.otp_textinput_active : externalStyles.otp_textinput}
                maxLength={1} returnKeyType="next" ref={otp_input_4} value={otp4}
                onChangeText={text => {
                    setOtp4(text);
                     if(text.length == 0){
                        otp_input_3.current.focus();
                     }
                }}/>
        </View>

        <Text style={externalStyles.forgot_resend_text} onPress={() => callSendOTP()}>
            Did’t receive the OTP? <Text style={{color: '#00ABE9', fontFamily:"roboto_slab_bold",}}>Resend Code </Text>
        </Text>

              
        <Pressable 
              onPress={() => 
                {
                  if ((otp1+otp2+otp3+otp4).length==0){
                    Alert.alert(APP_NAME,"Please enter otp");
                  }else{
                    navigation.navigate('ResetPassword',{emailId:emailId,otp:otp1+otp2+otp3+otp4});                    
                  }
                }
              }>
          <View style={externalStyles.login_btn_background}>
            <Text style={externalStyles.login_btn_text}>
              NEXT
            </Text>
          </View>
        </Pressable>

      </ScrollView>
    </View>
   );
 };
 
 export default OTP;
 