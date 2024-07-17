import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, ImageBackground, Image, TextInput, Pressable, Modal, BackHandler, Switch } from 'react-native';
import { externalStyles } from '../common/styles';
import { LOGIN, LOGOUT_API } from '../common/webUtils';
import { APP_NAME } from '../common/strings';
import { CustomLoginProgressBar, CustomProgressBar, CustomToastMessage, RequestLogPrint, validateEmail } from '../common/utils';
import { getSession, clearAsyncStorage, saveSession, USER_ID, FIRST_NAME, LAST_NAME, EMAIL, ACCESS_TOKEN, PROFILE_IMG, PHONE, LOCAL_USER_ID } from '../common/LocalStorage';

//new change
var user_id = "";
var user_id2 = "";

export function SettingsScreen({ navigation }) {
  const [isLogout, setLogout] = useState(false);

  const [isLoading, setIsLoding] = useState(false);//new change
  const [networkErrorModal, setNetworkErrorModal] = useState(false);//new change
  const [networkMessage, setNetworkMessage] = useState();//new change

  //new change
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
    // var user_id = "";
    try {
      user_id = await getSession(USER_ID);
      user_id2 = await getSession(LOCAL_USER_ID);
      // loginTime = await getSession(LOGIN_TIME);
      // firstName = await getSession(FIRST_NAME);
      // lastName = await getSession(LAST_NAME);

      console.log("User id=> ", user_id2);
    } catch (e) {
      console.log("Error=>" + e);
      showToastModal(e);
    }
  };

  const logoutApi = async (user_id) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("user_id", user_id);

      RequestLogPrint(LOGOUT_API, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setIsLoding(true)
      fetch(LOGOUT_API, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);
          setIsLoding(false)
          if (json.status == "1") {
            clearAsyncStorage();
            navigation.navigate('Login')
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } else {
            // Alert.alert(APP_NAME, "Please try again!");
            // setNetworkMessage("Please try again!");//new change
            // setNetworkErrorModal(true)//new change
            showToastModal("Please try again");
          }

        })
        .catch((error) => {
          setIsLoding(false)
          console.log("Error=>" + error);
          // Alert.alert(APP_NAME,error+"");
          // setNetworkMessage(error.message);//new change
          // setNetworkErrorModal(true)//new change
          showToastModal(error.message);
        });
    } catch (e) {
      setIsLoding(false)
      console.log("Exception=>" + e + "");
      // Alert.alert(APP_NAME,e);
      // setNetworkMessage(e);//new change
      // setNetworkErrorModal(true)//new change
      showToastModal(e);
    }
  }
  //end of new change

  //new changes
  const showToastModal = (text) => {
    setNetworkMessage(text);//new change
    setNetworkErrorModal(true)//new change
    setTimeout(() => {
      setNetworkErrorModal(false);
    }, 2000);
  };

  return (
    <View style={{ height: "100%", width: "100%" }}>
      {isLoading ? CustomLoginProgressBar(isLoading) : null}
      {networkErrorModal ? CustomToastMessage(networkErrorModal, networkMessage) : null}

      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <StatusBar backgroundColor={'transparent'} translucent={true} />
        <View style={externalStyles.column_parent}>
          <View style={externalStyles.setting_row_parent}>
            {/* <Pressable onPress={() => navigation.goBack()}>
                <Image style={externalStyles.back_button2} source={require('../assets/back.png')}/>
              </Pressable> */}
            <Text style={externalStyles.setting_title_text}>Settings</Text>
          </View>
          <View style={externalStyles.setting_divider} />
          {/* <Pressable onPress={() => navigation.navigate('ProfileScreen')}>
              <View style={externalStyles.setting_row_parent1}>
                <Image style={externalStyles.setting_menu_icon} source={require('../assets/setting_profile.png')}/>
                <Text style={externalStyles.setting_menu_title}>Profile</Text>
                <Image style={externalStyles.setting_list_arrow} source={require('../assets/setting_menu_arrow.png')}/>
              </View>
            </Pressable>
            <View style={externalStyles.setting_divider}/> */}
          <Pressable onPress={() => navigation.navigate('AppSettings')}>
            <View style={externalStyles.setting_row_parent1}>
              <Image style={externalStyles.setting_menu_icon} source={require('../assets/setting_app_setting.png')} />
              <Text style={externalStyles.setting_menu_title}>App Settings</Text>
              <Image style={externalStyles.setting_list_arrow} source={require('../assets/setting_menu_arrow.png')} />
            </View>
          </Pressable>
          <View style={externalStyles.setting_row_parent1}>
            <Text style={externalStyles.setting_company_title}>Company</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('HelpScreen')}>
            <View style={externalStyles.setting_row_parent1}>
              <Image style={externalStyles.setting_menu_icon} source={require('../assets/setting_help.png')} />
              <Text style={externalStyles.setting_menu_title}>Help</Text>
              <Image style={externalStyles.setting_list_arrow} source={require('../assets/setting_menu_arrow.png')} />
            </View>
          </Pressable>
          <View style={externalStyles.setting_divider} />
          <Pressable onPress={() => navigation.navigate('PrivacyScreen', { link: "http://157.230.203.199/privacy_legal", title: "Privacy & Legal" })}>
            <View style={externalStyles.setting_row_parent1}>
              <Image style={externalStyles.setting_menu_icon} source={require('../assets/setting_privacy_term.png')} />
              <Text style={externalStyles.setting_menu_title}>Privacy &amp; Legal</Text>
              <Image style={externalStyles.setting_list_arrow} source={require('../assets/setting_menu_arrow.png')} />
            </View>
          </Pressable>
          <View style={externalStyles.setting_divider} />
          <Pressable onPress={() => navigation.navigate('PrivacyScreen', { link: "http://157.230.203.199/terms_of_service", title: "Terms of Service" })}>
            <View style={externalStyles.setting_row_parent1}>
              <Image style={externalStyles.setting_menu_icon} source={require('../assets/setting_privacy_term.png')} />
              <Text style={externalStyles.setting_menu_title}>Terms of Service</Text>
              <Image style={externalStyles.setting_list_arrow} source={require('../assets/setting_menu_arrow.png')} />
            </View>
          </Pressable>
          <View style={externalStyles.setting_divider} />
          <Pressable onPress={() => {
            setLogout(!isLogout);
            // Alert.alert(
            //   "Logout",
            //   "Are you sure you want to logout?",
            //   [
            //     {
            //       text: "No",
            //       onPress: () => console.log("Cancel Pressed"),
            //       style: "cancel"
            //     },
            //     { text: "Yes", onPress: () => {
            //         console.log("OK Pressed") 
            //         clearAsyncStorage();
            //         navigation.navigate('Login')
            //         navigation.reset({
            //           index: 0,
            //           routes: [{ name: 'Login' }],
            //         });
            //       }
            //     }
            //   ]
            // );

          }}>
            <Text style={externalStyles.setting_logout}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isLogout}
        onRequestClose={() => {
          setLogout(!isLogout);
        }}
      >
        <View style={externalStyles.logoutCenteredView}>
          <View style={externalStyles.logoutModalView}>
            <Text style={externalStyles.logout_title_text}>Logout</Text>
            <Text style={externalStyles.logout_subtitle_text}>Are you sure you want to logout?</Text>
            <View style={externalStyles.logout_bottom_view}>
              <Pressable style={externalStyles.logout_yes_view}
                onPress={() => {
                  setLogout(false);
                  console.log("OK Pressed")
                  logoutApi(user_id)
                }}>
                <Text style={externalStyles.logout_yes_text}>Yes</Text>
              </Pressable>
              <Pressable style={externalStyles.logout_no_view}
                onPress={() => setLogout(!isLogout)}>
                <Text style={externalStyles.logout_no_text}>No</Text>
              </Pressable>
            </View>
            {/* <View style={{ flexDirection: "row", alignItems: "center", flex: 1, borderTopWidth: 1 }}>
              <Pressable style={externalStyles.logout_yes_text}
                onPress={() => {
                  setLogout(false);
                  console.log("OK Pressed")
                  logoutApi(user_id)
                }}>
                <Text style={externalStyles.logout_yes_text}>Yes</Text>
              </Pressable>
              <Pressable style={externalStyles.logout_no_text}
                onPress={() => setLogout(!isLogout)}>
                <Text style={externalStyles.logout_no_text}>No</Text>
              </Pressable>
            </View> */}

            {/* <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setLogout(!isLogout)}>
                  <Text style={externalStyles.setting_title_text}>Hide Modal</Text>
              </Pressable> */}
          </View>
        </View>
      </Modal>
      {/* new change */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={networkErrorModal}
        onRequestClose={() => setNetworkErrorModal(!networkErrorModal)}
      >
        <View style={externalStyles.logoutCenteredView}>
          <View style={[externalStyles.logoutModalView, { height: "15%" }]}>
            <Text style={externalStyles.logout_title_text}>{APP_NAME}</Text>
            <Text style={externalStyles.logout_subtitle_text}>{networkMessage}</Text>
            <Pressable style={externalStyles.logout_yes_text}
              onPress={() => {
                setNetworkErrorModal(!networkErrorModal)
              }}>
              <Text style={externalStyles.logout_yes_text}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}
    </View>
  );
}