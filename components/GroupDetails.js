/*npm install --save react-native-swipe-list-view 
For chat swipe listview (SwipeListView)

example : https://snack.expo.dev/@jemise111/react-native-swipe-list-view*/

import React, { useEffect, useState } from 'react';
import { Text, View, Image, Pressable, FlatList, Alert, Modal } from 'react-native';
import { externalStyles } from '../common/styles';
import { CustomProgressBar, getDisplayTime, validateEmail, RequestLogPrint, CustomToastMessage } from '../common/utils';
import { SwipeListView } from 'react-native-swipe-list-view';
import { getSession, USER_ID, FIRST_NAME, LAST_NAME, EMAIL, ACCESS_TOKEN, PROFILE_IMG, PHONE } from '../common/LocalStorage';
import { APP_NAME } from '../common/strings';
import { GROUP_INFO, IMAGE_THUMB_URL, NOTIFICATION_LIST, NOTIFICATION_READ } from '../common/webUtils';

var user_id = "", group_id = "", group_name = "", group_pic = "";

export function GroupDetails({ navigation, route }) {
  group_id = route.params.group_id;

  const [isLoading, setLoding] = useState(false);
  const [groupDetailList, setGroupDetailList] = useState([]);
  const [networkErrorModal, setNetworkErrorModal] = useState(false);//new change
  const [networkMessage, setNetworkMessage] = useState("");//new change

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
      formdata.append("group_id", group_id);

      RequestLogPrint(GROUP_INFO, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setLoding(true);

      fetch(GROUP_INFO, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          if (json.RESULT) {

            groupDetailList.length = 0;

            var role = json.RESULT.chat_group.users.user_type;
            if (role == "1") {
              role = "Admin";
            } else if (role == "2") {
              role = "Sub Admin";
            } else {
              role = "";
            }

            // group_pic = "http://157.230.203.199/storage/group_profile_image/thumb/"+json.RESULT.chat_group.group_pic;
            group_pic = IMAGE_THUMB_URL + json.RESULT.chat_group.group_pic;
            // http://157.230.203.199/storage/group_message_file/
            group_name = json.RESULT.chat_group.group_name;

            groupDetailList.push({
              id: 0,
              name: json.RESULT.chat_group.users.fname + " " + json.RESULT.chat_group.users.lname,
              profile: "",
              role: role
            });

            for (let i = 0; i < json.RESULT.members.length; i++) {
              var role = json.RESULT.members[i].user_type;
              if (role == "1") {
                role = "Admin";
              } else if (role == "2") {
                role = "Sub Admin";
              } else {
                role = "";
              }

              groupDetailList.push({
                id: i + 1,
                name: json.RESULT.members[i].fname + " " + json.RESULT.members[i].lname,
                profile: "",
                role: role
              });
            }
            setGroupDetailList(groupDetailList);
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

      <View style={externalStyles.group_row_parent}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image style={externalStyles.group_back_button} source={require('../assets/back.png')} />
        </Pressable>
        <View style={externalStyles.chating_row_parent_title}>
          {/* <Pressable onPress={() => navigation.navigate('GroupDetails')}> */}
          <View>
            <Image style={externalStyles.group_profile_image}
              source={{ uri: group_pic }} />
            <Text style={externalStyles.group_profile_name}>{group_name}</Text>
          </View>
          {/* </Pressable> */}
        </View>

      </View>
      <View style={externalStyles.setting_divider} />
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={groupDetailList}
        renderItem={({ item }) =>
          <View style={externalStyles.column_parent}>
            <View style={externalStyles.group_user_list_raw_parent}>
              <Image style={externalStyles.group_list_image_icon} />
              <View style={{ flexDirection: "row", flex: 1 }}>
                <Text style={externalStyles.group_list_name_text}>{item.name}</Text>
                {
                  item.role == "" ? null :
                    <Text style={externalStyles.group_list_role_text}>{item.role}</Text>
                }
              </View>
            </View>
            <View style={externalStyles.notification_list_divider} />
          </View>
        }
      />     
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