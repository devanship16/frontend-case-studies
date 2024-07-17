import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, ImageBackground, Image, TextInput, Pressable, Alert, BackHandler, Modal } from 'react-native';
import { externalStyles } from '../common/styles';
import { APP_NAME } from '../common/strings';
import { CustomProgressBar, getDisplayTime, validateEmail, RequestLogPrint, CustomToastMessage } from '../common/utils';
import { getSession, USER_ID, FIRST_NAME, LAST_NAME, EMAIL, ACCESS_TOKEN, PROFILE_IMG, PHONE } from '../common/LocalStorage';
import { IMAGE_THUMB_URL, NOTIFICATION_LIST, NOTIFICATION_READ, PROFILE_IMAGE_URL } from '../common/webUtils';

var user_id = "", group_pic = "";

export function NotificationList({ navigation }) {
  const [isLoading, setLoding] = useState(false);

  const [notificationList, setNotificationList] = useState([]);
  const [networkErrorModal, setNetworkErrorModal] = useState(false);//new change
  const [networkMessage, setNetworkMessage] = useState("");//new change

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getSessionData();
    });

    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  const getSessionData = async () => {
    try {
      user_id = await getSession(USER_ID);
      callNotificationListApi();
    } catch (e) {
      console.log("Error=>" + e);
      showToastModal(e);
    }
  };

  const callNotificationListApi = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("user_id", user_id);

      RequestLogPrint(NOTIFICATION_LIST, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setLoding(true);

      fetch(NOTIFICATION_LIST, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          notificationList.length = 0;

          if (json.results) {
            for (let i = 0; i < json.results.length; i++) {
              var createOn = "", updated_at = "";
              if (json.results[i].pivot.created_at) {
                createOn = getDisplayTime(json.results[i].pivot.created_at)
              }
              if (json.results[i].pivot.updated_at) {
                updated_at = getDisplayTime(json.results[i].pivot.updated_at)
              }

              if (json.results[i].event_id) {
                var pass_event_id = json.results[i].id;

                console.log("json.event_titles.pass_event_id=>" + json.event_titles[pass_event_id]);

                notificationList.push({
                  index: i,
                  id: json.results[i].id,
                  notification_title: json.results[i].notification_title,
                  notification_message: json.results[i].notification_message,
                  event_id: json.results[i].event_id,
                  message_id: json.results[i].message_id,
                  type: json.results[i].type,
                  created_at: createOn,
                  updated_at: updated_at,
                  deleted_at: json.results[i].deleted_at,
                  user_id: json.results[i].pivot.user_id,
                  notification_id: json.results[i].pivot.notification_id,
                  is_read: json.results[i].pivot.is_read,
                  icon: json.results[i].pivot.icon,
                  event_title: json.event_titles[pass_event_id],
                  group_id: "",
                  group_name: "",
                  group_pic: "",
                  group_type: "",
                });
              } else {
                var pass_event_id = json.results[i].id;

                var notification_title = "";

                if (json.results[i].notification_title == "") {
                  notification_title = "New File";
                } else {
                  notification_title = json.results[i].notification_title;
                }

                console.log("pass_event_id=>" + pass_event_id);

                if (json.chat[pass_event_id]) {
                  if (json.chat[pass_event_id].group_type == "1") {
                    notificationList.push({
                      index: i,
                      id: json.results[i].id,
                      notification_title: notification_title,
                      notification_message: json.results[i].notification_message,
                      event_id: json.results[i].event_id,
                      message_id: json.results[i].message_id,
                      type: json.results[i].type,
                      created_at: createOn,
                      updated_at: updated_at,
                      deleted_at: json.results[i].deleted_at,
                      user_id: json.results[i].pivot.user_id,
                      notification_id: json.results[i].pivot.notification_id,
                      is_read: json.results[i].pivot.is_read,
                      icon: json.results[i].pivot.icon,
                      event_title: "",
                      group_id: json.chat[pass_event_id].id,
                      group_name: json.chat[pass_event_id].users.fname + " " + json.chat[pass_event_id].users.lname,
                      group_pic: json.chat[pass_event_id].group_type == "1" ? PROFILE_IMAGE_URL + json.chat[pass_event_id].users.profile_pic : IMAGE_THUMB_URL + json.chat[pass_event_id].group_pic,
                      group_type: json.chat[pass_event_id].group_type,
                    });
                  } else {

                    notificationList.push({
                      index: i,
                      id: json.results[i].id,
                      notification_title: notification_title,
                      notification_message: json.results[i].notification_message,
                      event_id: json.results[i].event_id,
                      message_id: json.results[i].message_id,
                      type: json.results[i].type,
                      created_at: createOn,
                      updated_at: updated_at,
                      deleted_at: json.results[i].deleted_at,
                      user_id: json.results[i].pivot.user_id,
                      notification_id: json.results[i].pivot.notification_id,
                      is_read: json.results[i].pivot.is_read,
                      icon: json.results[i].pivot.icon,
                      event_title: "",
                      group_id: json.chat[pass_event_id].id,
                      group_name: json.chat[pass_event_id].group_name,
                      group_pic: json.chat[pass_event_id].group_type == "1" ? PROFILE_IMAGE_URL + json.chat[pass_event_id].users.profile_pic : IMAGE_THUMB_URL + json.chat[pass_event_id].group_pic,
                      group_type: json.chat[pass_event_id].group_type,
                    });
                  }
                }
              }
              // if (json.results[i].created_at){
              //   json.results[i].created_at = getDisplayTime(json.results[i].created_at);
              // }
            }
            setNotificationList(notificationList);
          } else {
            // Alert.alert(APP_NAME, json.error);
            // setNetworkMessage(json.error);//new change
            // setNetworkErrorModal(true)//new change
            showToastModal(json.error);
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

  const callReadNotificationApi = async (user_id, notification_id, event_title, index) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("notification_id", notification_id);
      formdata.append("is_read", "1");
      formdata.append("user_id", user_id);

      RequestLogPrint(NOTIFICATION_READ, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setLoding(true);

      fetch(NOTIFICATION_READ, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          if (json.status == 1) {
            console.log("event_title=>" + event_title);
            if (notificationList[index].event_id) {
              navigation.navigate('EventDetails', { event_title: event_title, user_id: user_id });
            } else {
              console.log("test=> ", notificationList[index])
              navigation.navigate('ChatingScreen', { group_id: notificationList[index].group_id, group_type: notificationList[index].group_type, name: notificationList[index].group_name, group_pic: notificationList[index].group_pic });
            }
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

  //new changes
  const showToastModal = (text) => {
    setNetworkMessage(text);//new change
    setNetworkErrorModal(true)//new change
    setTimeout(() => {
      setNetworkErrorModal(false);
    }, 2000);
  };

  return (
    <View style={externalStyles.column_parent}>
      {isLoading ? CustomProgressBar(isLoading) : null}
      {networkErrorModal ? CustomToastMessage(networkErrorModal, networkMessage) : null}

      <View style={externalStyles.setting_row_parent}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image style={externalStyles.back_button2} source={require('../assets/back.png')} />
        </Pressable>
        <Text style={externalStyles.setting_title_text1}>Notifications</Text>
      </View>
      <View style={externalStyles.setting_divider} />

      <View style={externalStyles.notification_list_parent}>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={notificationList}
          renderItem={({ item }) =>
            <Pressable onPress={() => callReadNotificationApi(item.user_id, item.id, item.event_title, item.index)}>
              <View style={[externalStyles.column_parent, { backgroundColor: item.is_read == "1" ? "transparent" : "#FCF5F4" }]}>
                <View style={externalStyles.notification_list_raw_parent}>
                  <Image style={externalStyles.notification_list_items_icon}
                    source={item.icon == "upcomming" ? require('../assets/notification_list_icon.png') : require('../assets/notification_alert.png')} />
                  <View style={{ flexDirection: "column", flex: 1 }}>
                    <Text style={externalStyles.home_list_items_text1}>{item.notification_title}</Text>
                    <Text style={externalStyles.notification_list_time}>{item.updated_at}</Text>
                    <Text style={externalStyles.home_list_items_text2}>{item.notification_message}</Text>
                  </View>
                </View>
                <View style={externalStyles.notification_list_divider} />
              </View>
            </Pressable>
          }
        />
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
    </View>
  );
}