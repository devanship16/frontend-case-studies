import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, FlatList, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, ImageBackground, Image, TextInput, Pressable, Alert, BackHandler, Modal, PermissionsAndroid, RefreshControl } from 'react-native';
import { externalStyles } from '../common/styles';
import { LIKE_PIN_LIST, LOGIN, PINBOARD_IMAGE_URL, PINBOARD_LIST, PINBOARD_THUMB_IMAGE_URL, PROFILE_IMAGE_URL, PROFILE_UPDATE, REACT_PIN_LIST } from '../common/webUtils';
import { APP_NAME } from '../common/strings';
import { CustomProgressBar, validateEmail, getDisplayTime, RequestLogPrint, changeDateTimeFormat, convertUTCToLocal, CustomToastMessage } from '../common/utils';
import { getSession, saveSession, USER_ID, FIRST_NAME, LAST_NAME, EMAIL, ACCESS_TOKEN, PROFILE_IMG, PHONE, NOTI_TYPE, NOTI_EVENT_ID, NOTI_USER_ID, LOGIN_TIME, NOTI_GROUP_ID, NOTI_GROUP_TYPE, NOTI_GROUP_NAME, NOTI_GROUP_PIC, LOCAL_USER_ID } from '../common/LocalStorage';
import { NOTIFICATION_LIST } from '../common/webUtils';
import LinearGradient from 'react-native-linear-gradient';
import * as ImagePicker from 'react-native-image-picker';
import { Dimensions } from 'react-native'

// https://www.npmjs.com/package/react-native-image-slider-box
import { SliderBox } from 'react-native-image-slider-box';

// https://github.com/instea/react-native-popup-menu
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import { MenuProvider } from 'react-native-popup-menu';

var loginTime = "";
var firstName = "", lastName = "";
var user_id = "";
var user_id2 = "";
var profile_pic = "";

export function PinBoard({ navigation, route }) {
  const [isLoading, setLoding] = useState(false);
  const [isNewNotification, setNewNotification] = useState(false);

  const [notificationList, setNotificationList] = useState([]);
  const [bottomOptionVisible, setBottomOptionVisible] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [pinList, setPinList] = useState([]);

  const [networkErrorModal, setNetworkErrorModal] = useState(false);//new change
  const [networkMessage, setNetworkMessage] = useState();//new change

  const [visibleMenu, setVisibleMenu] = useState(false);

  const openMenu = () => setVisibleMenu(true);

  const closeMenu = () => setVisibleMenu(false);

  let deviceWidth = Dimensions.get('window').width
  // console.log("deviceWidth11=>"+deviceWidth);
  deviceWidth = deviceWidth - 45;
  // console.log("deviceWidth11=>"+deviceWidth);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    callGetPins(user_id);
  }, []);
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

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
      loginTime = await getSession(LOGIN_TIME);
      firstName = await getSession(FIRST_NAME);
      lastName = await getSession(LAST_NAME);
      // profile_pic = await getSession(PROFILE_IMG);

      setProfilePic({ uri: await getSession(PROFILE_IMG) });
      profile_pic = { uri: await getSession(PROFILE_IMG) };

      console.log("setProfilePic=>" + profilePic);

      if (await getSession(NOTI_TYPE) == "event") {
        saveSession(NOTI_TYPE, "");
        var event_id = await getSession(NOTI_EVENT_ID);
        var user_id = await getSession(NOTI_USER_ID);
        navigation.navigate('EventDetails', { event_title: event_id, user_id: user_id });
      } else if (await getSession(NOTI_TYPE) == "message") {
        saveSession(NOTI_TYPE, "");
        var group_id = await getSession(NOTI_GROUP_ID);
        var group_type = await getSession(NOTI_GROUP_TYPE);
        var group_name = await getSession(NOTI_GROUP_NAME);
        var group_pic = await getSession(NOTI_GROUP_PIC);

        navigation.navigate('ChatingScreen', { group_id: group_id, group_type: group_type, name: group_name, group_pic: group_pic });
      }

      // if (await getSession(NOTI_TYPE)=="event"){
      //   saveSession(NOTI_TYPE,"");
      //   var event_id = await getSession(NOTI_EVENT_ID);
      //   var user_id = await getSession(NOTI_USER_ID);
      //   navigation.navigate('EventDetails',{event_title:event_id,user_id:user_id});
      // }else if(await getSession(NOTI_TYPE)=="message"){
      //   saveSession(NOTI_TYPE,"");
      //   var group_id = await getSession(NOTI_GROUP_ID);
      //   var group_type = await getSession(NOTI_GROUP_TYPE);
      //   var group_name = await getSession(NOTI_GROUP_NAME);
      //   var group_pic = await getSession(NOTI_GROUP_PIC);

      //   navigation.navigate('ChatingScreen',{group_id:group_id,group_type:group_type,name:group_name,group_pic:group_pic});
      // }

      countNotificationApi(user_id);
      setLoding(true);
      callGetPins(user_id);
    } catch (e) {
      console.log("Error=>" + e);
      showToastModal(e);
    }
  };

  const countNotificationApi = async (user_id) => {
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


      fetch(NOTIFICATION_LIST, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          setNewNotification(false);

          notificationList.length = 0;


          if (json.results) {
            for (let i = 0; i < json.results.length; i++) {
              if (json.results[i].pivot.is_read == "0") {
                // console.log("NotificationRead => "+json.results[i].pivot.is_read);
                setNewNotification(true);
              }
            }
          }
        })
        .catch((error) => {
          console.log("Error=>" + error);
          showToastModal(error.message);
          // Alert.alert(APP_NAME,error+"");
        });
    } catch (e) {
      console.log("Exception=>" + e + "");
      showToastModal(e);
      // Alert.alert(APP_NAME,e);
    }
  }

  /*Run time Permission*/
  const requestCameraPermission = async (index) => {
    try {
      PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
      ).then((result) => {
        if (result['android.permission.CAMERA']
          && result['android.permission.READ_EXTERNAL_STORAGE']
          && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
          console.log("Granted");
          if (index == 0) {
            launchCamera();
          } else if (index == 1) {
            launchImage();
          } else if (index == 2) {
            launchVideo();
          }
        } else if (result['android.permission.CAMERA']
          || result['android.permission.READ_EXTERNAL_STORAGE']
          || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
          console.log("Denied");
        }
      });
    } catch (err) {
      console.warn(err);
      showToastModal(err);
    }
  };

  // Launch Gallery
  const launchImage = () => {
    let options = {
      // maxHeight: 500,
      // maxWidth: 500,
      // selectionLimit: 0,
      // quality:1,
      mediaType: 'photo',
      includeBase64: false,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log(response, "image picker response");
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        // Alert.alert("Please try again");
        // setNetworkMessage("Please try again!");//new change
        // setNetworkErrorModal(true)//new change
        showToastModal("Please try again");
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setProfilePic({ uri: response.assets[0].uri });
        callProfileFileApi(response.assets[0].uri, response.assets[0].fileName, response.assets[0].type);

        console.log("image Picker worked!")
      }
    });
  }

  // Launch Camera
  const launchCamera = () => {
    let options = {
      // maxHeight: 500,
      // maxWidth: 500,
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log(response, "image picker response");
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        // Alert.alert("Please try again");
        // setNetworkMessage("Please try again!");//new change
        // setNetworkErrorModal(true)//new change
        showToastModal("Please try again");
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setProfilePic({ uri: response.assets[0].uri });
        callProfileFileApi(response.assets[0].uri, response.assets[0].fileName, response.assets[0].type);
        console.log("image Picker worked!")
      }
    });
  }

  const callProfileFileApi = async (uri, fileName, fileType) => {
    console.log("old image url=> ", profilePic)
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("user_id", "");
      formdata.append("profile_pic", { uri: uri, name: fileName, filename: fileName, type: fileType });
      formdata.append('user_id', user_id2);
      //   formdata.append('Content-Type', fileType);

      RequestLogPrint(PROFILE_UPDATE, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch(PROFILE_UPDATE, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          if (json.status == "1") {
            saveSession(PROFILE_IMG, PROFILE_IMAGE_URL + json.results.profile_pic);
          } else {
            // Alert.alert(APP_NAME, "Please try again!");
            // setNetworkMessage("Please try again!");//new change
            // setNetworkErrorModal(true)//new change
            showToastModal("Please try again");
          }
        })
        .catch((error) => {
          console.log("Error=>" + error);
          // Alert.alert(APP_NAME, "Please try again!");
          // setNetworkMessage("Please try again!");//new change
          // setNetworkErrorModal(true)//new change
          showToastModal(error.message);
        });
    } catch (e) {
      console.log("Exception=>" + e + "");
      // Alert.alert(APP_NAME, "Please try again!");
      // setNetworkMessage("Please try again!");//new change
      // setNetworkErrorModal(true)//new change
      showToastModal(e);
    }
  }

  const callGetPins = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("user_id", user_id2);

      RequestLogPrint(PINBOARD_LIST, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch(PINBOARD_LIST, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          //new change
          // console.log("Users=> ", json.users.profile_pic)
          setProfilePic({ uri: PROFILE_IMAGE_URL + json.users.profile_pic });//new change
          loginTime = json.users.login_date_time;//new change
          firstName = json.users.fname;//new change
          lastName = json.users.lname;//new change

          pinList.length = 0;

          if (json.results) {
            for (let i = 0; i < json.results.length; i++) {
              var images = [];
              var thumb_images = [];

              if (json.results[i].image != "") {
                if (json.results[i].image.includes(",")) {
                  for (let j = 0; j < json.results[i].image.split(",").length; j++) {
                    images.push(PINBOARD_IMAGE_URL + json.results[i].image.split(",")[j]);
                    thumb_images.push(PINBOARD_THUMB_IMAGE_URL + json.results[i].image.split(",")[j]);
                    console.log("PINBOARD_IMAGE_URL2=>" + PINBOARD_THUMB_IMAGE_URL + json.results[i].image.split(",")[j]);
                  }
                } else {
                  images.push(PINBOARD_IMAGE_URL + json.results[i].image);
                  thumb_images.push(PINBOARD_THUMB_IMAGE_URL + json.results[i].image);
                  console.log("PINBOARD_IMAGE_URL1=>" + PINBOARD_THUMB_IMAGE_URL + json.results[i].image);
                }
              }

              var created_at = json.results[i].created_at.split(".")[0];
              created_at = created_at.replace("T", " ");
              // created_at = changeDateTimeFormat(created_at,"YYYY-MM-DD HH:mm:ss","hh:mm DD/MM/YYYY");
              created_at = convertUTCToLocal(created_at, "YYYY-MM-DD HH:mm:ss");
              created_at = changeDateTimeFormat(created_at, "YYYY-MM-DD HH:mm:ss", "hh:mma DD/MM/YYYY");

              var reactions_own = "0";

              if (json.results[i].reactions_own.length > 0) {
                reactions_own = json.results[i].reactions_own[0].reaction_type;
              }

              pinList.push({
                id: json.results[i].id,
                content: json.results[i].content,
                image: images,
                thumb: thumb_images,
                user_id: json.results[i].user_id,
                status: json.results[i].status,
                created_at: created_at,
                comments_count: json.results[i].comments_count,
                likes_count: json.results[i].likes_count,
                reactions_count: json.results[i].reactions.length,
                reactions_own: reactions_own,
                fname: json.results[i].users.fname,
                lname: json.results[i].users.lname,
                email: json.results[i].users.email,
                user_type: json.results[i].users.user_type,
                profile_pic: PROFILE_IMAGE_URL + json.results[i].users.profile_pic,
                likes: json.results[i].likes.length,
                reactions: json.results[i].reactions.length,
              });
            }
            setPinList(pinList);
          }
          setLoding(false);
        })
        .catch((error) => {
          setLoding(false);
          console.log("Error=>" + error);
          // Alert.alert(APP_NAME,error+"");
          // setNetworkMessage(error.message);//new change
          // setNetworkErrorModal(true)//new change
          showToastModal(error.message);
        });
    } catch (e) {
      setLoding(false);
      console.log("Exception=>" + e + "");
      // Alert.alert(APP_NAME,e);
      // setNetworkMessage(e);//new change
      // setNetworkErrorModal(true)//new change
      showToastModal(e);
    }
  }

  const callTickApi = async (pin_id) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("user_id", user_id2);
      formdata.append("pin_id", pin_id);

      RequestLogPrint(LIKE_PIN_LIST, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch(LIKE_PIN_LIST, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);
          console.log((json.status == 1));
          if (json.status == 1) {
            let temp = pinList.map((product) => {
              if (pin_id === product.id) {
                return { ...product, likes_count: product.likes_count == 0 ? 1 : 0, likes: product.likes_count == 0 ? product.likes + 1 : product.likes - 1 };
              }
              return product;
            });
            setPinList(temp);
          }
        })
        .catch((error) => {
          console.log("Error=>" + error);
          showToastModal(error.message);
          // Alert.alert(APP_NAME,error+"");
        });
    } catch (e) {
      console.log("Exception=>" + e + "");
      // Alert.alert(APP_NAME,e);
      showToastModal(e);
    }
  }

  const callReactionApi = async (pin_id, reaction_type) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("user_id", user_id2);
      formdata.append("pin_id", pin_id);
      formdata.append("reaction_type", reaction_type);

      RequestLogPrint(REACT_PIN_LIST, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch(REACT_PIN_LIST, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);
          console.log((json.status == 1));
          if (json.status == 1) {
            if (json.message === "Reacted") {
              let temp = pinList.map((product) => {
                if (pin_id === product.id) {
                  if (product.reactions_count == 0) {
                    return { ...product, reactions_count: 1, reactions: product.reactions + 1, reactions_own: reaction_type };
                  } else {
                    return { ...product, reactions_count: 1, reactions_own: reaction_type };
                  }
                }
                return product;
              });
              setPinList(temp);
            } else {
              let temp = pinList.map((product) => {
                if (pin_id === product.id) {
                  if (product.reactions_count == 0) {
                    return { ...product, reactions_count: 0, reactions_own: "0" };
                  } else {
                    return { ...product, reactions_count: 0, reactions: product.reactions - 1, reactions_own: "0" };
                  }
                }
                return product;
              });
              setPinList(temp);
            }
            // let temp = pinList.map((product) => {
            //   if (pin_id === product.id) {
            //     return { ...product, likes_count: product.likes_count == 0 ? 1 : 0, likes :  product.likes_count == 0 ? product.likes+1 : product.likes-1};
            //   }
            //   return product;
            // });
            // setPinList(temp);
          }
        })
        .catch((error) => {
          console.log("Error=>" + error);
          // Alert.alert(APP_NAME,error+"");
          // setNetworkMessage(error);//new change
          // setNetworkErrorModal(true)//new change
          showToastModal(error.message);
        });
    } catch (e) {
      console.log("Exception=>" + e + "");
      // Alert.alert(APP_NAME,e);
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
    <MenuProvider>
      <View>
        {isLoading ? CustomProgressBar(isLoading) : null}
        {networkErrorModal ? CustomToastMessage(networkErrorModal, networkMessage) : null}

        <StatusBar backgroundColor={'transparent'} translucent={true} />
        <ScrollView>
          <LinearGradient
            style={styles.linearGradient}
            colors={['rgba(255,145,66,0.05)', 'rgba(0,171,233,0.25)']}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 1 }}>
            <ImageBackground style={externalStyles.top_header_parent_card}>
              <View style={externalStyles.top_header_notification_1}>
                <Pressable onPress={() => navigation.navigate('NotificationList')}>
                  <Image style={externalStyles.top_header_notification} source={require('../assets/home_notification.png')} />
                  {
                    isNewNotification ? <Image style={externalStyles.red_dot} /> : null
                  }
                </Pressable>
              </View>
              <View style={externalStyles.top_header_data_parent}>
                <Pressable onPress={() => {
                  setBottomOptionVisible(true);
                }}>
                  <View>
                    <Image source={profilePic} style={externalStyles.top_header_data_profile_image} />
                    {/* <Image style={externalStyles.edit_profile_pic} source={require('../assets/edit.png')}/> */}
                  </View>
                </Pressable>
                <View style={externalStyles.top_header_data_parent2}>
                  <Text style={externalStyles.top_header_data_user_name}>{firstName} {lastName}</Text>
                  {/* <Text style={externalStyles.top_header_data_user_joined}>Member since 14 Jun 2018</Text> */}
                  <Text style={externalStyles.top_header_data_user_joined}>Member since {changeDateTimeFormat(loginTime, "YYYY-MM-DD", "DD MMM YYYY")}</Text>
                </View>
              </View>
            </ImageBackground>
          </LinearGradient>
          {
            pinList.length == 0 ?
              <View style={externalStyles.home_list_container}>
                <Text style={externalStyles.home_empty_text}>No any pin available!</Text>
              </View>
              :
              // <View style={externalStyles.home_list_container}>
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                // style={{height:485}}
                // style={{flex:1}}
                // contentContainerStyle={{ paddingBottom: 300 }}
                contentContainerStyle={{ paddingBottom: 10 }}
                style={externalStyles.home_list_container}
                data={pinList}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                renderItem={({ item }) =>
                  <Pressable onPress={() => console.log("Pressed")}>
                    <View style={externalStyles.column_parent}>
                      <View style={externalStyles.pin_board_item}>
                        <View style={externalStyles.row_parent}>
                          <Image style={externalStyles.pin_user_profile} source={{ uri: item.profile_pic }} />
                          <View>
                            <Text style={externalStyles.pin_user_name}>{item.fname + " " + item.lname}</Text>
                            <Text style={externalStyles.pin_created_date}>{item.created_at}</Text>
                          </View>
                        </View>
                        {
                          item.image.length == 0 ? null :
                            <SliderBox
                              style={externalStyles.pins_images}
                              images={item.thumb}
                              parentWidth={deviceWidth}
                              paginationBoxVerticalPadding={0}
                              dotColor="#00ABE9"
                              inactiveDotColor="#8098B6"
                              dotStyle={{ width: 5, height: 5, borderRadius: 5, marginHorizontal: -20, padding: 0, margin: 0 }}
                              resizeMode="contain"
                              onCurrentImagePressed={index => navigation.navigate('FullScreenImg', { isImage: 1, isVideo: 0, url: item.image[index] })} />
                        }
                        {
                          item.content == null ? null :
                            <Text style={externalStyles.pin_content}>{item.content}</Text>
                        }
                        <View style={externalStyles.pin_Action_parent}>
                          <Pressable onPress={() => {
                            callTickApi(item.id);
                          }}>
                            <View style={externalStyles.row_parent}>
                              <Image style={externalStyles.pin_action_icon} tintColor={item.likes_count == 0 ? "#bdbdbd" : "#00c853"} source={require('../assets/pin_check.png')} />
                              <Text style={externalStyles.pin_action_count}>{item.likes}</Text>
                            </View>
                          </Pressable>

                          {/* <Pressable>
                          <View style={externalStyles.row_parent}>
                            <Image style={externalStyles.pin_action_image} tintColor={item.reactions_count==0?"#bdbdbd":"#00ABE9"} source={require('../assets/pin_smile.png')}/>
                            <Text style={externalStyles.pin_action_count}>{item.reactions}</Text>
                          </View>
                        </Pressable> */}
                          <Menu>
                            <MenuTrigger>
                              <View style={externalStyles.row_parent}>
                                <Image style={externalStyles.pin_action_icon}
                                  source={item.reactions_own == "0" ? require('../assets/pin_smile.png') :
                                    item.reactions_own == "1" ? require('../assets/pin_cry_laughing.png') :
                                      item.reactions_own == "2" ? require('../assets/pin_heart_eyes.png') :
                                        item.reactions_own == "3" ? require('../assets/pin_horror_face.png') :
                                          item.reactions_own == "4" ? require('../assets/pin_smiley_face.png') :
                                            item.reactions_own == "5" ? require('../assets/pin_thank_you.png') : require('../assets/pin_smile.png')} />
                                <Text style={externalStyles.pin_action_count}>{item.reactions}</Text>
                              </View>
                            </MenuTrigger>
                            <MenuOptions style={externalStyles.pin_reaction_parent}>
                              {/* <View style={{ flex:1, backgroundColor:"#ffffff", borderColor:"#bdbdbd", borderWidth:10, flexDirection:"row",justifyContent: 'center', alignItems: 'center',margin:10}}> */}
                              <MenuOption onSelect={() => callReactionApi(item.id, "1")} >
                                <Image style={externalStyles.pin_action_image1} source={require('../assets/pin_cry_laughing.png')} />
                              </MenuOption>
                              <MenuOption onSelect={() => callReactionApi(item.id, "2")} >
                                <Image style={externalStyles.pin_action_image2} source={require('../assets/pin_heart_eyes.png')} />
                              </MenuOption>
                              <MenuOption onSelect={() => callReactionApi(item.id, "3")} >
                                <Image style={externalStyles.pin_action_image3} source={require('../assets/pin_horror_face.png')} />
                              </MenuOption>
                              <MenuOption onSelect={() => callReactionApi(item.id, "4")} >
                                <Image style={externalStyles.pin_action_image4} source={require('../assets/pin_smiley_face.png')} />
                              </MenuOption>
                              <MenuOption onSelect={() => callReactionApi(item.id, "5")} >
                                <Image style={externalStyles.pin_action_image5} source={require('../assets/pin_thank_you.png')} />
                              </MenuOption>
                              {/* </View> */}
                            </MenuOptions>
                          </Menu>

                          <Pressable onPress={() => navigation.navigate('CommentScreen', { "pin_id": item.id })}>
                            <View style={externalStyles.row_parent}>
                              <Image style={externalStyles.pin_action_icon} tintColor="#bdbdbd" source={require('../assets/pin_comment.png')} />
                              <Text style={externalStyles.pin_action_count}>{item.comments_count}</Text>
                            </View>
                          </Pressable>
                        </View>
                      </View>

                      {/* <View style={externalStyles.home_list_items}>
                      <Image style={externalStyles.home_list_items_icon} 
                          source={item.icon=="upcomming" ? require('../assets/notification_list_icon.png') : require('../assets/notification_alert.png')}/>
                      <View style={{flexDirection:"column",flex:1}}>
                        <Text style={externalStyles.home_list_items_text1}>{item.notification_title}</Text>
                        <Text  style={externalStyles.home_list_items_text2}>{item.notification_message}</Text>
                      </View>
                      <Image style={externalStyles.home_list_arrow}
                          source={require('../assets/notification_list_arrow.png')}/>
                    </View> */}
                      <View style={externalStyles.home_list_divider} />
                    </View>
                  </Pressable>
                }
              />
            //  </View>
          }
        </ScrollView>




        <Modal
          animationType="slide"
          transparent={true}
          visible={bottomOptionVisible}
          onRequestClose={() => {
            setBottomOptionVisible(!bottomOptionVisible);
          }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(4,4,15,0.4)' }}>
            <View style={externalStyles.bottomMenuView}>
              <View style={externalStyles.bottomMenuParent}>
                <View style={externalStyles.bottomMenuChild}>
                  <Pressable onPress={() => {
                    setBottomOptionVisible(!bottomOptionVisible);
                    if (Platform.OS === 'ios') {
                      launchCamera();
                    } else {
                      requestCameraPermission(0);
                    }
                  }}>
                    <View style={{ flexDirection: "row" }}>
                      <Image style={externalStyles.bottomMenuIcon} source={require('../assets/camera_menu.png')} />
                      <Text style={externalStyles.bottomMenuText}>Camera</Text>
                    </View>
                  </Pressable>
                </View>

                <View style={externalStyles.chat_bottom_divider} />

                <View style={externalStyles.bottomMenuChild}>
                  <Pressable onPress={() => {
                    setBottomOptionVisible(!bottomOptionVisible);
                    if (Platform.OS === 'ios') {
                      launchImage();
                    } else {
                      requestCameraPermission(1);
                    }
                  }}>
                    <View style={{ flexDirection: "row" }}>
                      <Image style={externalStyles.bottomMenuIcon} source={require('../assets/gallery_menu.png')} />
                      <Text style={externalStyles.bottomMenuText}>Photo</Text>
                    </View>
                  </Pressable>
                </View>
              </View>

              <View style={externalStyles.bottomMenuParent2}>
                <Pressable onPress={() => { setBottomOptionVisible(!bottomOptionVisible); }}>
                  <View style={externalStyles.bottomMenuChild}>
                    <Text style={externalStyles.bottomMenuCancelText}>Cancel</Text>
                  </View>
                </Pressable>
              </View>
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
    </MenuProvider>
  );
}
const styles = StyleSheet.create({
  linearGradient: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
})