/*npm install --save react-native-swipe-list-view 
For chat swipe listview (SwipeListView)

example : https://snack.expo.dev/@jemise111/react-native-swipe-list-view*/

import React, { useEffect, useState } from 'react';
import { RefreshControl,Animated, Dimensions, Text, View, Image, TextInput, Pressable, TouchableHighlight, TouchableOpacity, Alert, ScrollView, Modal } from 'react-native';
import { externalStyles } from '../common/styles';
import { CustomToastMessage, CustomProgressBar, getDisplayTime, validateEmail, RequestLogPrint, changeDateTimeFormat, itsToday, convertUTCToLocal } from '../common/utils';
import { SwipeListView } from 'react-native-swipe-list-view';
import { getSession, USER_ID, FIRST_NAME, LAST_NAME, EMAIL, ACCESS_TOKEN, PROFILE_IMG, PHONE, LOCAL_USER_ID } from '../common/LocalStorage';
import { APP_NAME } from '../common/strings';
import { DELETE_GROUP, GROUP_LIST, IMAGE_THUMB_URL, PROFILE_IMAGE_URL } from '../common/webUtils';
import messaging from '@react-native-firebase/messaging';
import { currentRouteName } from '../App';
// new change
import ReactNativeAnimatedSearchbox from '../common/ReactNativeAnimatedSearchbox';

var user_id = "";
export var test = "";
var tempChatUserList = [];

var refSearchBox;//new change
var searchTemp = "";
var headerHeight = 55;

export function ChatScreen({ navigation }) {
  const [isLoading, setLoding] = useState(false);

  const [isSearchShow, setSearchShow] = useState(false);

  const [networkErrorModal, setNetworkErrorModal] = useState(false);//new change
  const [networkMessage, setNetworkMessage] = useState("");//new change

  const [search, setSearch] = useState("");
  const [serachOpen, setSerachOpen] = useState(false); //new change

  const [chatUserList, setChatUserList] = useState([]);

  const [offset, setOffset] = useState(0);

  React.useEffect(() => {
    console.log("Test Update=>" + test);
    messaging().onMessage(async remoteMessage => {
      console.log("remoteMessage789=>" + JSON.stringify(remoteMessage));

      if (remoteMessage.data.type == "message") {
        type = remoteMessage.data.type;
        id = remoteMessage.data.id;
        user_id = remoteMessage.data.user_id;

        group_type = remoteMessage.data.group_type;
        group_name = remoteMessage.data.event_title;
        group_pic = IMAGE_THUMB_URL + remoteMessage.data.group_pic;

        if (currentRouteName) {
          console.log('current screen', currentRouteName);
          if (currentRouteName == "Chats") {
            // navigation.goBack();
            // navigation.push('Chats');
            // ChatScreen.callUpdateChatListApi();
            callChatListApi();
          }
        }
      }
    });
  }, [test])

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
      setSearchShow(false);
      if (isSearchShow) {
        setSearch("")//new change
        searchTemp = "";
        refSearchBox.close()//new change
        setSerachOpen(false)//new change
      }

      user_id = await getSession(LOCAL_USER_ID);
      callChatListApi();
    } catch (e) {
      console.log("Error=>" + e);
      showToastModal(e);
    }
  };

  const callChatListApi = async () => {
    try {
      setSearch("");

      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("user_id", user_id);

      RequestLogPrint(GROUP_LIST, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setLoding(true);

      chatUserList.length = 0;

      fetch(GROUP_LIST, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          // chatUserList.length = 0;

          if (json.RESULT) {
            // for (let k = 0 ; k < 3 ; k++){ 
            for (let i = 0; i < json.RESULT.length; i++) {
              if (json.RESULT[i].letest_messages) {
                if (json.RESULT[i].letest_messages.message_body == "") {
                  var message = "New File";
                } else {
                  var message = json.RESULT[i].letest_messages.message_body;
                }
                // 2021-12-13T06:51:14.000000Z
                // console.log(""+json.RESULT[i].letest_messages.created_at.split(".")[0]);
                var time = json.RESULT[i].letest_messages.created_at.split(".")[0];
                time = time.replace("T", " ");
                time = convertUTCToLocal(time, "YYYY-MM-DD HH:mm:ss");
                // time = "2021-12-17 13:30:00";

                if (itsToday(time.split(" ")[0])) {
                  time = changeDateTimeFormat(time, "YYYY-MM-DD HH:mm:ss", "hh:mm a");
                } else {
                  time = changeDateTimeFormat(time, "YYYY-MM-DD HH:mm:ss", "DD MMM");
                }

                if (json.RESULT[i].group_type == "1") {
                  chatUserList.push({
                    group_id: json.RESULT[i].id,
                    name: json.RESULT[i].users.fname + " " + json.RESULT[i].users.lname,
                    // group_pic:"http://157.230.203.199/storage/group_profile_image/thumb/"+json.RESULT[i].group_pic,
                    group_pic: PROFILE_IMAGE_URL + json.RESULT[i].users.profile_pic,
                    group_type: json.RESULT[i].group_type,
                    message: message,
                    map_message_count: json.RESULT[i].map_message_count,
                    time: time,
                    last_message: json.RESULT[i].last_messages //new change
                  });
                } else {
                  chatUserList.push({
                    group_id: json.RESULT[i].id,
                    name: json.RESULT[i].group_name,
                    // group_pic:"http://157.230.203.199/storage/group_profile_image/thumb/"+json.RESULT[i].group_pic,
                    group_pic: IMAGE_THUMB_URL + json.RESULT[i].group_pic,
                    group_type: json.RESULT[i].group_type,
                    message: message,
                    map_message_count: json.RESULT[i].map_message_count,
                    time: time,
                    last_message: json.RESULT[i].last_messages //new change
                  });
                }
              } else {
                console.log("" + json.RESULT[i].created_at.split(".")[0]);
                var time = json.RESULT[i].created_at.split(".")[0];
                time = time.replace("T", " ");
                time = convertUTCToLocal(time, "YYYY-MM-DD HH:mm:ss");

                if (itsToday(time.split(" ")[0])) {
                  time = changeDateTimeFormat(time, "YYYY-MM-DD HH:mm:ss", "hh:mm a");
                } else {
                  time = changeDateTimeFormat(time, "YYYY-MM-DD HH:mm:ss", "DD MMM");
                }
                if (json.RESULT[i].group_type == "1") {
                  chatUserList.push({
                    group_id: json.RESULT[i].id,
                    name: json.RESULT[i].users.fname + " " + json.RESULT[i].users.lname,
                    // group_pic:"http://157.230.203.199/storage/group_profile_image/thumb/"+json.RESULT[i].group_pic,
                    group_pic: IMAGE_THUMB_URL + json.RESULT[i].group_pic,
                    group_type: json.RESULT[i].group_type,
                    message: "",
                    map_message_count: json.RESULT[i].map_message_count,
                    time: time,
                    last_message: json.RESULT[i].last_messages //new change
                  });
                } else {
                  chatUserList.push({
                    group_id: json.RESULT[i].id,
                    name: json.RESULT[i].group_name,
                    // group_pic:"http://157.230.203.199/storage/group_profile_image/thumb/"+json.RESULT[i].group_pic,
                    group_pic: IMAGE_THUMB_URL + json.RESULT[i].group_pic,
                    group_type: json.RESULT[i].group_type,
                    message: "",
                    map_message_count: json.RESULT[i].map_message_count,
                    time: time,
                    last_message: json.RESULT[i].last_messages //new change
                  });
                }
              }
            }
            // }
            setChatUserList(chatUserList);
            tempChatUserList = chatUserList;
            console.log("setChatUserList=>" + chatUserList.length);
          } else {
            // Alert.alert(APP_NAME, json.MESSAGE);
            // setNetworkMessage(son.MESSAGE);//new change
            // setNetworkErrorModal(true)//new change
            showToastModal(json.MESSAGE);
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
      // setNetworkMessage(e);//new change
      // setNetworkErrorModal(true)//new change
      showToastModal(e);
    }
  }

  const callDeleteGroupApi = async (group_id) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("user_id", user_id);
      formdata.append("group_id", group_id);

      RequestLogPrint(DELETE_GROUP, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setLoding(true);

      fetch(DELETE_GROUP, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          if (json.STATUS == 200) {
            // callChatListApi();
            setChatUserList(chatUserList.filter(item => item.group_id !== group_id));
          } else {
            // // Alert.alert(APP_NAME, json.MESSAGE);
            // setNetworkMessage(json.MESSAGE);//new change
            // setNetworkErrorModal(true)//new change
            showToastModal(json.MESSAGE);
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

  const renderItem = data => (
    <TouchableHighlight
      onPress={() => {
        // console.log('last messages', data.item);
        navigation.navigate('ChatingScreen', data.item);
      }}
      style={externalStyles.rowFront}
      underlayColor={'#AAA'}>
      <View style={externalStyles.chat_list_item}>
        <Image style={externalStyles.chat_profile_image1}
          source={{ uri: data.item.group_pic }} />
        <View style={externalStyles.chat_list_item2}>
          <View style={externalStyles.chat_list_item3}>
            <Text style={externalStyles.chat_profile_name1}>{data.item.name}</Text>
            <Text style={externalStyles.chat_profile_time1}>{data.item.time}</Text>
            <Image style={externalStyles.chat_list_arrow}
              source={require('../assets/notification_list_arrow.png')} />
          </View>
          <View style={externalStyles.chat_list_item3}>
            {/* new change */}
            {data.item.last_message != null ? <Text style={externalStyles.chat_profile_msg1_deactive} numberOfLines={1}>{data.item.message}</Text>
              : <Text style={externalStyles.chat_profile_msg1_deactive} numberOfLines={1}>{""}</Text>}
            {
              data.item.map_message_count == 0 ? null
                : <Text style={externalStyles.chat_profile_count1}>{data.item.map_message_count}</Text>
            }

          </View>
        </View>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={externalStyles.rowBack}>
      {/* <Text>Left</Text>
          <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnLeft]}
              onPress={() => closeRow(rowMap, data.item.key)}
          >
              <Text style={styles.backTextWhite}>Close</Text>
          </TouchableOpacity> */}
      <TouchableOpacity
        style={[externalStyles.backRightBtn, externalStyles.backRightBtnRight]}
        onPress={() => {
          closeRow(rowMap, data.item.key);
          Alert.alert(
            APP_NAME,
            "Are you sure you want to leave this group?",
            [
              {
                text: "No",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "Yes", onPress: () => {
                  console.log("OK Pressed")
                  callDeleteGroupApi(data.item.group_id);
                  // const newList = chatUserList.splice(0,1);
                  // chatUserList.length = 0;
                  // setChatUserList(newList);
                  // setChatUserList(chatUserList.filter(item => item.group_id !== data.item.group_id));
                }
              }
            ]
          );
        }}>
        <Text style={externalStyles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };

  const filterSearch = (search) => {
    // if (search == ""){
    //   var demo = chatUserList;
    //   setChatUserList(demo);
    // }else{
    //   var demo = chatUserList;
    //   setChatUserList(demo.filter(item => item.name.toLowerCase().includes(search.toLowerCase())));
    // }
    console.log("chatUserList=>" + tempChatUserList.length);

    if (search == "") {
      setChatUserList(tempChatUserList);
    } else {
      var demo = tempChatUserList;
      setChatUserList(demo.filter(item => item.name.toLowerCase().includes(search.toLowerCase())));
    }

  }

  const headerPart = () => {
    return <View style={externalStyles.chat_search_parent}>
      <Image source={require('../assets/search.png')}
        style={externalStyles.chat_search_icon} />
      <TextInput placeholder="Search"
        style={externalStyles.chat_search_edittext}
        placeholderTextColor="#999999"
        onChangeText={text => {
          setSearch(text);
          filterSearch(text);
        }}
        value={search} />
      {/* <Image source={require('../assets/mic.png')} 
              style={externalStyles.chat_mic_icon} /> */}
    </View>
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

      {/* new change */}
      {/* <View style={{ marginTop: 40, paddingTop: 10, paddingBottom: 5,backgroundColor:"white" }}>
        <View style={{ flexDirection: "row", alignItems: "center", position: "absolute", top: 20, zIndex: 1, marginRight: 40, marginLeft: 5 }}>
          {!serachOpen ? <Text style={[externalStyles.chat_title_text, {  marginLeft: 20 }]}>Chats</Text>
            : null}
        </View>
        <ReactNativeAnimatedSearchbox
          ref={(ref) => refSearchBox = ref}
          placeholder={'Search...'}
          searchIconColor={"#999999"}
          backgroundColor="white"
          onClosed={() => {
          }}
          onOpening={() => {
            setTimeout(() => {
              setSerachOpen(true)
            }, 400);
          }}
          onOpened={() => {
          }}
          onChangeText={text => {
            console.log(text)
            setSearch(text);
            searchTemp = text;
            filterSearch(text);
          }}
          onSubmitEditing={() => {
            setLoding(true);
            filterSearch(searchTemp);
          }}
          returnKeyType="search"
          value={search}
        />
        {serachOpen ? <Pressable onPress={() => {
          refSearchBox.close();//new change
          setSerachOpen(false);//new change
          setLoding(true);
          setSearch("");//new change
          searchTemp = "";
          filterSearch("");
        }}
          style={{ marginRight: 10, marginLeft: 10, position: "absolute", top: 25, zIndex: 1, right: 5 }}>
          <Text style={[{ marginLeft: 20, color: "#000000", }]}>Close</Text>
        </Pressable> : null}
      </View> */}
      {/* //end of new change */}

      {/* <View style={externalStyles.setting_divider} /> */}

      <View style={externalStyles.chat_row_parent}>
        {/* <Pressable onPress={() => navigation.goBack()}>
            <Image style={externalStyles.chat_back_button} source={require('../assets/back.png')}/>
          </Pressable> */}
        <Text style={externalStyles.chat_title_text}>Chats</Text>
      </View>
      <View style={externalStyles.setting_divider} />

      <View style={externalStyles.chat_list_parent_background}>
        <Animated.ScrollView refreshControl={
          <RefreshControl  refreshing={isLoading} onRefresh={()=>{setSearchShow(true)}} />
        }
          onScroll={(event) => {

            var currentOffset = event.nativeEvent.contentOffset.y;
            var direction = currentOffset > offset ? 'down' : 'up';
            setOffset(offset);
            if (direction == "up") {
              // console.log("up")
              setSearchShow(true);
            } else {
              // console.log("down")
              setSearchShow(false);
              setSerachOpen(false);//new change
            }

          }}>
          {/* {isSearchShow ? <>
            <View style={{
              // marginLeft: 17,
              // marginRight: 17,
              marginVertical: 10,
            }}>
              <ReactNativeAnimatedSearchbox
                ref={(ref) => refSearchBox = ref}
                placeholder={'Search'}
                searchIconColor={"#999999"}
                placeholderTextColor={"#999999"}
                backgroundColor="rgba(35,31,32,0.06)"
                height={36}
                fontSize={14}
                searchIconSize={14}
                onClosed={() => {
                }}
                borderRadius={10}
                onOpening={() => {
                  setTimeout(() => {
                    setSerachOpen(true)
                  }, 400);
                }}
                onOpened={() => {
                }}
                onChangeText={text => {
                  console.log(text)
                  setSearch(text);
                  searchTemp = text;
                  filterSearch(text);
                }}
                onSubmitEditing={() => {
                  setLoding(true);
                  filterSearch(searchTemp);
                }}
                returnKeyType="search"
                value={search}
              />

              {serachOpen ? <Pressable onPress={() => {
                refSearchBox.close();//new change
                setSerachOpen(false);//new change
                setLoding(true);
                setSearch("");//new change
                searchTemp = "";
                // callChatListApi();
                filterSearch("");
              }}
                style={{ marginRight: 10, marginLeft: 10, position: "absolute", top: 2, zIndex: 1, right: 4, padding: 10 }}>
                <Image source={require('../assets/close.png')}
                  style={externalStyles.chat_close_icon} />
              </Pressable> : null}
            </View>
            <View style={externalStyles.setting_divider} />
          </>
            : null} */}

          {isSearchShow ? <>
            <View style={externalStyles.chat_search_parent}>
              <Image source={require('../assets/search.png')}
                style={externalStyles.chat_search_icon} />
              <TextInput placeholder="Search"
                style={externalStyles.chat_search_edittext}
                placeholderTextColor="#999999"
                onChangeText={text => {
                  setSearch(text);
                  filterSearch(text);
                }}
                value={search} />
              <Pressable style={externalStyles.chat_close_button}
                onPress={() => {
                  setSearch("");
                  searchTemp = "";
                  filterSearch("");
                }}>
                <Image source={require('../assets/close.png')}
                  style={externalStyles.chat_close_icon} />
              </Pressable>
            </View>
            <View style={externalStyles.setting_divider} />
          </>
            : null}
          <View style={externalStyles.chat_list_container}>
            <SwipeListView
              nestedScrollEnabled
              style={externalStyles.chat_list_parent}
              disableRightSwipe
              data={chatUserList}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              leftOpenValue={75}
              rightOpenValue={-75}
              previewRowKey={'0'}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              onRowDidOpen={onRowDidOpen}
              // ListHeaderComponent={headerPart}

              contentContainerStyle={{ minHeight: Dimensions.get("window").height }}
              contentOffset={{ y: headerHeight }}
            />
          </View>
        </Animated.ScrollView>

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