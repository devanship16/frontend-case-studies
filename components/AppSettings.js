import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, ImageBackground, Image, TextInput, Pressable, Alert, Switch, Modal } from 'react-native';
import { externalStyles } from '../common/styles';
import { APP_SETTINGS, UPDATE_APP_SETTINGS } from '../common/webUtils';
import { APP_NAME } from '../common/strings';
import { CustomProgressBar, validateEmail, RequestLogPrint, CustomToastMessage } from '../common/utils';
import { getSession, USER_ID, FIRST_NAME, LAST_NAME, EMAIL, ACCESS_TOKEN, PROFILE_IMG, PHONE, LOCAL_USER_ID } from '../common/LocalStorage';

var user_id = "";
var local_user_id = "";

export function AppSettings({ navigation }) {
  const [isLoading, setLoding] = useState(false);
  const [networkErrorModal, setNetworkErrorModal] = useState(false);//new change
  const [networkMessage, setNetworkMessage] = useState("");//new change
  const [responseUserId, setResponseUserId] = useState(false);

  const [isMessage, setIsMessage] = useState(false);
  const toggleSwitchMessage = (value) => {
    console.log("Value=>" + value);
    setIsMessage(value);
    callUpdateAppSettingsApi(value, isEvents, isProduct, isRecommendation);
  };

  const [isEvents, setIsEvents] = useState(false);
  const toggleSwitchEvents = (value) => {
    setIsEvents(value);
    callUpdateAppSettingsApi(isMessage, value, isProduct, isRecommendation);
  };

  const [isProduct, setIsProduct] = useState(false);
  const toggleSwitchProduct = (value) => {
    setIsProduct(value);
    callUpdateAppSettingsApi(isMessage, isEvents, value, isRecommendation);
  };

  const [isRecommendation, setIsRecommendation] = useState(false);
  const toggleSwitchRecommendation = (value) => {
    setIsRecommendation(value);
    callUpdateAppSettingsApi(isMessage, isEvents, isProduct, value);
  };

  const [isRecommendationText, setIsRecommendationText] = useState(false);
  const toggleSwitchRecommendationText = () => setIsRecommendationText(previousState => !previousState);

  const [isAccount, setIsAccount] = useState(false);
  const toggleSwitchAccount = () => setIsAccount(previousState => !previousState);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

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
      user_id = await getSession(USER_ID);
      local_user_id = await getSession(LOCAL_USER_ID);
      callAppSettingsApi();
    } catch (e) {
      console.log("Error=>" + e);
      showToastModal(e);
    }
  };

  const callAppSettingsApi = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("user_id", user_id);

      RequestLogPrint(APP_SETTINGS, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setLoding(true);

      fetch(APP_SETTINGS, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          if (json.status == 1) {
            setResponseUserId(json.results.user_id);

            setIsMessage(json.results.new_noti == "On");
            setIsEvents(json.results.upcomming_noti == "On");
            setIsProduct(json.results.product_noti == "On");
            setIsRecommendation(json.results.recommandation_noti == "On");
          } else {
            // Alert.alert(APP_NAME, json.message);
            // setNetworkMessage(json.message);//new change
            // setNetworkErrorModal(true)//new change
            showToastModal(json.message);
          }
          setLoding(false);
        })
        .catch((error) => {
          setLoding(false);
          console.log("Error=>" + error);
          // Alert.alert(APP_NAME, error + "");
          // setNetworkMessage(error.message);//new change
          // setNetworkErrorModal(true)//new change
          showToastModal(error.message);
        });
    } catch (e) {
      setLoding(false);
      console.log("Exception=>" + e + "");
      // Alert.alert(APP_NAME, e);
      // setNetworkMessage(e);//new change
      // setNetworkErrorModal(true)//new change
      showToastModal(e);
    }
  }

  const callUpdateAppSettingsApi = async (isMessage, isEvents, isProduct, isRecommendation) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("user_id", local_user_id);
      formdata.append("new_noti", isMessage ? "On" : "Off");
      formdata.append("upcomming_noti", isEvents ? "On" : "Off");
      formdata.append("product_noti", isProduct ? "On" : "Off");
      formdata.append("recommandation_noti", isRecommendation ? "On" : "Off");

      RequestLogPrint(UPDATE_APP_SETTINGS, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setLoding(true);

      fetch(UPDATE_APP_SETTINGS, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          if (json.status == 1) {
            // setIsMessage(json.results.msg_noti == "On");
            // setIsEvents(json.results.upcomming_noti == "On");
            // setIsProduct(json.results.product_noti == "On");
            // setIsRecommendation(json.results.recommandation_noti == "On");
            // Alert.alert(APP_NAME,json.message);
          } else {
            // Alert.alert(APP_NAME, json.message);
            // setNetworkMessage(json.message);//new change
            // setNetworkErrorModal(true)//new change
            showToastModal(json.message);
          }
          setLoding(false);
        })
        .catch((error) => {
          setLoding(false);
          // console.log("Error=>" + error);
          // setNetworkMessage(error.message);//new change
          // setNetworkErrorModal(true)//new change
          // Alert.alert(APP_NAME, error + "");
          showToastModal(error.message);
        });
    } catch (e) {
      setLoding(false);
      console.log("Exception=>" + e + "");
      // Alert.alert(APP_NAME, e);
      // setNetworkMessage(e);//new change
      // setNetworkErrorModal(true)//new change
      showToastModal(e);
    }
  }

  //new changes
  const showToastModal = (text) => {
    setNetworkMessage(text);//new change
    setNetworkErrorModal(true)//new change
    setTimeout(() => {
      setNetworkErrorModal(false);
    }, 2000);
  };

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'}>
      <StatusBar backgroundColor={'transparent'} translucent={true} />
      {networkErrorModal ? CustomToastMessage(networkErrorModal, networkMessage) : null}

      <View style={externalStyles.column_parent}>
        <View style={externalStyles.setting_row_parent}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image style={externalStyles.back_button2} source={require('../assets/back.png')} />
          </Pressable>
          <Text style={externalStyles.setting_title_text1}>App Settings</Text>
        </View>
        <View style={externalStyles.setting_divider} />
        <Text style={externalStyles.appsetting_title_text}>Push Notifications</Text>

        <View style={externalStyles.appsetting_row_parent}>
          <View style={externalStyles.appsetting_row_subparent}>
            <Text style={externalStyles.appsetting_text_1}>Messages</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#4CD964" }}
              thumbColor={isMessage ? "#ffffff" : "#ffffff"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) => toggleSwitchMessage(value)}
              value={isMessage}
              style={externalStyles.appsetting_list_switch}
            />
          </View>
          <View style={externalStyles.setting_divider} />
          <View style={externalStyles.appsetting_row_subparent}>
            <Text style={externalStyles.appsetting_text_1}>Upcoming Events</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#4CD964" }}
              thumbColor={isEvents ? "#ffffff" : "#ffffff"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) => toggleSwitchEvents(value)}
              value={isEvents}
              style={externalStyles.appsetting_list_switch}
            />
          </View>
          {/* <View style={externalStyles.setting_divider}/>
          <View style={externalStyles.appsetting_row_subparent}>
            <View style={externalStyles.column_parent}>
              <Text style={externalStyles.appsetting_text_1}>Product Announcement</Text>
              <Text style={externalStyles.appsetting_text_2}>Features updates and more</Text>
            </View>
            <Switch
                trackColor={{ false: "#767577", true: "#4CD964" }}
                thumbColor={isProduct ? "#ffffff" : "#ffffff"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value)=>toggleSwitchProduct(value)}
                value={isProduct}
                style={externalStyles.appsetting_list_switch}
              />
          </View>
          <View style={externalStyles.setting_divider}/>
          <View style={externalStyles.appsetting_row_subparent}>
            <View style={externalStyles.column_parent}>
              <Text style={externalStyles.appsetting_text_1}>Recommendations</Text>
              <Text style={externalStyles.appsetting_text_2}>Ideas and price alerts</Text>
            </View>
            <Switch
                trackColor={{ false: "#767577", true: "#4CD964" }}
                thumbColor={isRecommendation ? "#ffffff" : "#ffffff"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value)=>toggleSwitchRecommendation(value)}
                value={isRecommendation}
                style={externalStyles.appsetting_list_switch}
              />
          </View> */}
        </View>

        {/* <Text style={externalStyles.appsetting_title_text}>Text Message Notifications</Text>

        <View style={externalStyles.appsetting_row_parent}>
          <View style={externalStyles.appsetting_row_subparent}>
            <View style={externalStyles.column_parent}>
              <Text style={externalStyles.appsetting_text_1}>Recommendations</Text>
              <Text style={externalStyles.appsetting_text_2}>Ideas and price alerts</Text>
            </View>
            <Switch
                trackColor={{ false: "#767577", true: "#4CD964" }}
                thumbColor={isRecommendationText ? "#ffffff" : "#ffffff"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchRecommendationText}
                value={isRecommendationText}
                style={externalStyles.appsetting_list_switch}
              />
          </View>
          <View style={externalStyles.setting_divider}/>
          <View style={externalStyles.appsetting_row_subparent}>
            <View style={externalStyles.column_parent}>
              <Text style={externalStyles.appsetting_text_1}>Account Activity</Text>
              <Text style={externalStyles.appsetting_text_2}>Changes mode to your account</Text>
            </View>
            <Switch
                trackColor={{ false: "#767577", true: "#4CD964" }}
                thumbColor={isAccount ? "#ffffff" : "#ffffff"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchAccount}
                value={isAccount}
                style={externalStyles.appsetting_list_switch}
              />
          </View>
        </View>         */}



      </View>
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
    </ScrollView>
  );
}
