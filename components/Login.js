/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, ImageBackground, Image, TextInput, Pressable, Alert } from 'react-native';

import { Colors, DebugInstructions, Header, LearnMoreLinks, ReloadInstructions, } from 'react-native/Libraries/NewAppScreen';
import { externalStyles } from '../common/styles';
import { LOGIN, COURSE_LIST, UPDATE_EVENTS_BY_APP, PROFILE_IMAGE_URL } from '../common/webUtils';
import { APP_NAME } from '../common/strings';
import { validateEmail, getYYYYMMDD, RequestLogPrint, CustomLoginProgressBar, CustomToastMessage } from '../common/utils';
import { getSession, saveSession, FCM_TOKEN, USER_ID, FIRST_NAME, LAST_NAME, EMAIL, ACCESS_TOKEN, PROFILE_IMG, PHONE, LOGIN_TIME, LOCAL_USER_ID } from '../common/LocalStorage';

var identifier_pass = "";
var enrolments_pass = [];

var fcm_token = "";

function Login({ navigation }) {
  const [isLoading, setLoding] = useState(false);

  const [isLoginWithMail, setLoginWithMail] = useState(true);

  //new changes
  const [isToastModalVisible, setToastModalVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  // const [loginEmail, setLoginEmail] = useState("helensimkins@icloud.com");
  const [loginEmail, setLoginEmail] = useState("");
  // const [loginPassword, setLoginPassword] = useState("test student");
  const [loginPassword, setLoginPassword] = useState("");
  const [isPasswordDisplay, setPasswordDisplay] = useState(true);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getSessionData();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getSessionData = async () => {
    try {
      fcm_token = await getSession(FCM_TOKEN);
    } catch (e) {
      console.log("Error=>" + e);
    }
  };

  //new changes
  const showToastModal = (text) => {
    setToastMessage(text)
    setToastModalVisible(true);
    setTimeout(() => {
      setToastModalVisible(false);
    }, 2000);
  };

  const callLoginApi = async () => {
    try {
      if (loginEmail.trim().length == 0) {
        // Alert.alert(APP_NAME,"Please enter email");
        showToastModal("Please enter email")
        return;
      } else if (!validateEmail(loginEmail.trim())) {
        // Alert.alert(APP_NAME,"Invalide email");
        showToastModal("Invalid email")
        return;
      } else if (loginPassword.trim().length == 0) {
        // Alert.alert(APP_NAME,"Please enter password");
        showToastModal("Please enter password")
        return;
      }

      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");

      var formdata = new FormData();
      formdata.append("email", loginEmail);
      formdata.append("password", loginPassword);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      console.log("Request=>" + formdata);

      setLoding(true);

      fetch(LOGIN, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log("Result=>");
          console.log(json);
          // setLoding(false);
          if (json.access_token) {
            saveSession(ACCESS_TOKEN, json.access_token);
            saveSession(LOGIN_TIME, getYYYYMMDD());
            saveSession(USER_ID, json.student + "");
            saveSession(EMAIL, loginEmail);
            saveSession(FIRST_NAME, "");
            saveSession(LAST_NAME, "");
            saveSession(PHONE, "");
            saveSession(PROFILE_IMG, "");
            callEventsApi(json.access_token, fcm_token, getYYYYMMDD(), loginEmail);

            // navigation.navigate('Dashboard')
            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: 'Dashboard' }],
            // });
          } else {
            setLoding(false);
            // Alert.alert(APP_NAME,json.error);
            // Alert.alert(APP_NAME,"Incorrect Email or Password or If you forgot your password please reset your password using your Evolve College Online Hub");
            showToastModal("Incorrect Email or Password or If you forgot your password please reset your password using your Evolve College Online Hub")
          }
        })
        .catch((error) => {
          console.log("Error=>" + error);
          setLoding(false);
          // Alert.alert(APP_NAME, "Please try again!");
          showToastModal("Please try again!")
        });
    } catch (e) {
      console.log("Exception=>" + e + "");
      setLoding(false);
      // Alert.alert(APP_NAME, "Please try again!");
      showToastModal("Please try again!")
    }
  }

  const callEventsApi = async (access_token, fcm_token, login_time, email) => {
    try {
      console.log("callEventsApi=>" + COURSE_LIST + access_token);
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(COURSE_LIST + access_token, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log("Result=>");
          console.log(json);
          if (json.identifier) {
            identifier_pass = json.identifier;

            saveSession(FIRST_NAME, json.firstName);
            saveSession(LAST_NAME, json.lastName);

            enrolments_pass.length = 0;

            for (let i = 0; i < json.enrolments.length; i++) {

              var timetableList = [];

              for (let j = 0; j < json.enrolments[i].timetable.length; j++) {
                timetableList.push({
                  eventId: json.enrolments[i].timetable[j].eventId,
                  subjectNumber: json.enrolments[i].timetable[j].subjectNumber,
                  className: json.enrolments[i].timetable[j].className,
                  timetableFormat: json.enrolments[i].timetable[j].timetableFormat,
                  dateStart: json.enrolments[i].timetable[j].dateStart,
                  dateEnd: json.enrolments[i].timetable[j].dateEnd,
                  timeStart: json.enrolments[i].timetable[j].timeStart,
                  timeEnd: json.enrolments[i].timetable[j].timeEnd,
                  location: json.enrolments[i].timetable[j].location,
                  creditApplied: json.enrolments[i].timetable[j].creditApplied,
                  attendance: json.enrolments[i].timetable[j].attendance.day1,
                });
              }

              enrolments_pass.push({
                courseCode: json.enrolments[i].courseCode,
                courseName: json.enrolments[i].courseName,
                timetable: timetableList
              });
            }

            callUpdateEventsApi(access_token, fcm_token, login_time, email, json.firstName, json.lastName);
            // navigation.navigate('Dashboard')
            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: 'Dashboard' }],
            // });
          } else {
            saveSession(USER_ID, "");
            setLoding(false);
            // Alert.alert(APP_NAME, "Please try again!");
            showToastModal("Please try again!")
          }
        })
        .catch((error) => {
          setLoding(false);
          saveSession(USER_ID, "");
          // Alert.alert(APP_NAME, "Please try again!");
          showToastModal("Please try again!")
          console.log("Error=>" + error);
        });
    } catch (e) {
      setLoding(false);
      saveSession(USER_ID, "");
      // Alert.alert(APP_NAME, "Please try again!");
      showToastModal("Please try again!")
      console.log("Exception=>" + e + "");
    }
  }

  const callUpdateEventsApi = async (access_token, fcm_token, login_time, email, firstName, lastName) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("enrolments", JSON.stringify(enrolments_pass));
      formdata.append("identifier", identifier_pass);
      formdata.append("email_id", email);
      formdata.append("first_name", firstName);
      formdata.append("last_name", lastName);
      formdata.append("login_date_time", login_time);
      formdata.append("access_token", access_token);
      formdata.append("device_token", fcm_token);
      formdata.append("device_name", Platform.OS);

      RequestLogPrint(UPDATE_EVENTS_BY_APP, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch(UPDATE_EVENTS_BY_APP, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log("Result=>");
          saveSession(LOCAL_USER_ID, json.results.id + "");
          saveSession(PROFILE_IMG, PROFILE_IMAGE_URL + json.results.profile_pic);
          console.log(json);
          setLoding(false);

          if (json.status == 1) {
            navigation.navigate('Dashboard')
            navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            });
          } else {
            saveSession(USER_ID, "");
            // Alert.alert(APP_NAME, "Please try again!");
            showToastModal("Please try again!")
          }
        })
        .catch((error) => {
          saveSession(USER_ID, "");
          setLoding(false);
          // Alert.alert(APP_NAME, "Please try again!");
          showToastModal("Please try again!")
          console.log("Error=>" + error);
        });
    } catch (e) {
      saveSession(USER_ID, "");
      setLoding(false);
      // Alert.alert(APP_NAME, "Please try again!");
      showToastModal("Please try again!")
      console.log("Exception=>" + e + "");
    }
  }

  return (
    <View style={externalStyles.login_background}>
      {isLoading ? CustomLoginProgressBar(isLoading) : null}
      {isToastModalVisible ? CustomToastMessage(isToastModalVisible, toastMessage) : null}
      <StatusBar translucentbarStyle="light-content" backgroundColor='#F5FCFF' />

      <ScrollView style={externalStyles.login_scrollview} keyboardShouldPersistTaps={'handled'}>

        <Text style={externalStyles.login_welcome_text}>Welcome Back!</Text>
        <Text style={externalStyles.login_welcome_text2}>To keep connected with us please login with your personal info</Text>


        <View style={externalStyles.login_email_edittext_parent}>
          <Image source={isLoginWithMail ? require('../assets/email_login_inactive.png') : require('../assets/phone_signin.png')}
            style={isEmailFocused ? externalStyles.edittext_left_icon_active : externalStyles.edittext_left_icon} />
          <TextInput placeholder={isLoginWithMail ? "Email" : "Phone Number"} keyboardType={isLoginWithMail ? "email-address" : "phone-pad"} selectTextOnFocus={false}
            caretHidden={false}
            style={externalStyles.login_email_edittext}
            onFocus={() => setEmailFocused(true)}
            placeholderTextColor="#999999"
            onBlur={() => (loginEmail.length > 0) ? setEmailFocused(true) : setEmailFocused(false)}
            onChangeText={text => setLoginEmail(text)}
            value={loginEmail} />
        </View>


        {
          isLoginWithMail ?
            <View style={externalStyles.login_password_edittext_parent}>
              <Image source={require('../assets/password_login_inactive.png')}
                style={isPasswordFocused ? externalStyles.edittext_left_icon_active : externalStyles.edittext_left_icon} />
              <TextInput placeholder="Password" secureTextEntry={isPasswordDisplay} selectTextOnFocus={false} caretHidden={false}
                style={externalStyles.login_email_edittext}
                onFocus={() => setPasswordFocused(true)}
                placeholderTextColor="#999999"
                onBlur={() => (loginPassword.length > 0) ? setPasswordFocused(true) : setPasswordFocused(false)}
                onChangeText={text => setLoginPassword(text)}
                value={loginPassword} />
              <Pressable
                onPress={() => isPasswordDisplay ? setPasswordDisplay(false) : setPasswordDisplay(true)}>
                <Image source={isPasswordDisplay ? require('../assets/password_hide.png') : require('../assets/password_show.png')} style={externalStyles.edittext_left_icon} />
              </Pressable>
            </View> :
            null
        }


        {/* {
          isLoginWithMail?
          <Text style={externalStyles.login_forgot_password} onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password</Text>:
          null
        } */}


        <Pressable onPress={() => callLoginApi()}>
          <View style={externalStyles.login_btn_background}>
            <Text style={externalStyles.login_btn_text}>SIGN IN</Text>
          </View>
        </Pressable>

        {/* Bottom login action button */}
        {/* <View style={isLoginWithMail ? externalStyles.login_or_text_parent : externalStyles.login_or_text_parent2}>
          <View style={externalStyles.login_or_text_divider}/>
          <Text style={externalStyles.login_or_text}>Or continue with</Text>
          <View style={externalStyles.login_or_text_divider}/>
        </View>

        <Pressable
              onPress={() => setLoginWithMail(!isLoginWithMail)}>
          <View style={externalStyles.login_with_email_parent}>
            <Image source={!isLoginWithMail ? require('../assets/email_login_inactive.png') : require('../assets/phone_signin.png')} style={!isLoginWithMail ? externalStyles.email_login_icon : externalStyles.login_with_google_icon } />
            {
              isLoginWithMail?
              <Text style={externalStyles.login_with_email_text}>Sign In with Phone</Text>:
              <Text style={externalStyles.login_with_email_text}>Sign In with Email
              </Text>
            }
          </View>
        </Pressable>

        <View style={externalStyles.login_with_email_parent}>
          <Image source={require('../assets/google_signin.png')} style={externalStyles.login_with_google_icon} /> 
          <Text style={externalStyles.login_with_email_text}>Sign In with Google</Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

export default Login;
