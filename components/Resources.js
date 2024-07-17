import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, SafeAreaView, FlatList, ScrollView, TextInput, StyleSheet, Text, useColorScheme, View, ImageBackground, Image, Modal, Pressable, Alert, BackHandler, PermissionsAndroid, Platform, RefreshControl, Animated } from 'react-native';
import { externalStyles } from '../common/styles';
import { APP_NAME } from '../common/strings';
import { obj } from '../common/temp';
import { CustomProgressBar, getDisplayTime, validateEmail, RequestLogPrint, CustomLoginProgressBar, CustomToastMessage, getRegularFont, getWidth } from '../common/utils';
import { getSession, USER_ID, FIRST_NAME, LAST_NAME, EMAIL, ACCESS_TOKEN, PROFILE_IMG, PHONE, LOCAL_USER_ID } from '../common/LocalStorage';
import { NOTIFICATION_LIST, NOTIFICATION_READ, RESOURCE_LIST, RESOURCE_URL } from '../common/webUtils';
// npm install react-native-file-viewer --save (https://www.npmjs.com/package/react-native-file-viewer)
import FileViewer from "react-native-file-viewer";
// npm install --save rn-fetch-blob (https://www.npmjs.com/package/rn-fetch-blob)
import RNFetchBlob from 'rn-fetch-blob'

// new change
import ReactNativeAnimatedSearchbox from '../common/ReactNativeAnimatedSearchbox';

var user_id = "", user_id2 = "", dynamicCount = 0, folderPath = "", title = "Resources";
var secondTextInput;
var refSearchBox;//new change

var searchTemp = "";

export function Resources({ navigation }) {
  const [toggleSearchBar, setToggleSearchBar] = useState(true);
  const [offset, setOffset] = useState(0);

  const [isLoading, setLoding] = useState(false);

  const [fileOpenDisabled, setFileOpenDisabled] = useState(false);//new change
  const [networkErrorModal, setNetworkErrorModal] = useState(false);//new change
  const [networkMessage, setNetworkMessage] = useState("");//new change

  const [isSubFolder, setSubFolder] = useState(false);

  const [resourceList, setResourceList] = useState([]);
  const [tempList, setTempList] = useState([]);
  const [subResourceList, setSubResourceList] = useState([]);

  const [search, setSearch] = useState("");

  const [serachOpen, setSerachOpen] = useState(false); //new change

  // const serachRef=useRef();
  // const [refreshing, setRefreshing] = React.useState(false);
  // const onRefresh = React.useCallback(() => {
  //   setSearch("");
  //   setRefreshing(true);
  //   wait(2000).then(() => setRefreshing(false));
  //   callResourcesListApi();
  // }, []);
  // const wait = (timeout) => {
  //   return new Promise(resolve => setTimeout(resolve, timeout));
  // }
  const searchBarAnim = useRef(new Animated.Value(-75)).current

  React.useEffect(() => {
    if (toggleSearchBar) {
      Animated.timing(searchBarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(searchBarAnim, {
        // toValue: -75,
        toValue: 0, //new change
        duration: 300,
        useNativeDriver: true,
      }).start()
    }

    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getSessionData();
    });

    const backAction = () => {
      console.log("Click back button!" + isSubFolder);

      if (isSubFolder) {
        // navigation.goBack();
        var temp = [];

        subResourceList.length = 0;
        setSubResourceList(subResourceList);
        setSubResourceList(subResourceList => []);

        tempList.length = 0;
        setTempList(tempList);
        setTempList(tempList => []);

        console.log("folderPath=>" + folderPath.split("-").length);
        console.log("folderPath=>" + folderPath);

        temp = resourceList[folderPath.split("-")[0]];

        for (let k = 0; k < folderPath.split("-").length - 1; k++) {
          if (k != 0) {
            console.log("temp111=>" + folderPath.split("-")[k]);
            console.log("temp222=>" + temp.all_children.length);
            temp = temp.all_children[folderPath.split("-")[k]];
            console.log("temp333=>" + temp.all_children.length);
          }
          // temp = temp.all_children[folderPath.split("-")[k]];
          // console.log("temp123=>"+temp.length);
        }

        newFilePath = "";
        for (let k = 0; k < folderPath.split("-").length - 1; k++) {
          if (newFilePath == "") {
            newFilePath += folderPath.split("-")[k] + "";
          } else {
            newFilePath += "-" + folderPath.split("-")[k];
          }
        }

        folderPath = newFilePath;
        console.log("folderPath=>" + folderPath);

        title = temp.title;
        // setSearch("");

        if (folderPath.trim() != "") {
          for (let k = 0; k < temp.all_children.length; k++) {
            var createOn = "";
            if (temp.all_children[k].created_at) {
              createOn = getDisplayTime(temp.all_children[k].created_at)
            }

            setSubResourceList(subResourceList => [...subResourceList, {
              id: temp.all_children[k].id,
              position: k,
              title: temp.all_children[k].title,
              description: temp.all_children[k].description,
              resource_type: temp.all_children[k].resource_type,
              file_name: temp.all_children[k].file_name,
              parent_id: temp.all_children[k].parent_id,
              user_id: temp.all_children[k].user_id,
              status: temp.all_children[k].status,
              created_at: createOn,
              all_children: temp.all_children[k].all_children,
            }]);

            setTempList(subResourceList => [...subResourceList, {
              id: temp.all_children[k].id,
              position: k,
              title: temp.all_children[k].title,
              description: temp.all_children[k].description,
              resource_type: temp.all_children[k].resource_type,
              file_name: temp.all_children[k].file_name,
              parent_id: temp.all_children[k].parent_id,
              user_id: temp.all_children[k].user_id,
              status: temp.all_children[k].status,
              created_at: createOn,
              all_children: temp.all_children[k].all_children,
            }]);
          }
        } else {
          setSubFolder(false);
          title = "Resources";
          // setSearch("");

          for (let k = 0; k < resourceList.length; k++) {
            // var createOn = "";
            // console.log("BackDate2=>"+resourceList[k].created_at)
            // if (resourceList[k].created_at){
            //   createOn = getDisplayTime(resourceList[k].created_at)
            // }

            setSubResourceList(subResourceList => [...subResourceList, {
              id: resourceList[k].id,
              position: k,
              title: resourceList[k].title,
              description: resourceList[k].description,
              resource_type: resourceList[k].resource_type,
              file_name: resourceList[k].file_name,
              parent_id: resourceList[k].parent_id,
              user_id: resourceList[k].user_id,
              status: resourceList[k].status,
              created_at: resourceList[k].created_at,
              all_children: resourceList[k].all_children,
            }]);

            setTempList(subResourceList => [...subResourceList, {
              id: resourceList[k].id,
              position: k,
              title: resourceList[k].title,
              description: resourceList[k].description,
              resource_type: resourceList[k].resource_type,
              file_name: resourceList[k].file_name,
              parent_id: resourceList[k].parent_id,
              user_id: resourceList[k].user_id,
              status: resourceList[k].status,
              created_at: resourceList[k].created_at,
              all_children: resourceList[k].all_children,
            }]);
          }
        }
      } else {
        BackHandler.exitApp();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, isSubFolder, toggleSearchBar, search]);

  const getSessionData = async () => {

    try {
      setSearch("");//new change
      searchTemp = "";
      refSearchBox.close();//new change
      setSerachOpen(false);//new change


      user_id = await getSession(USER_ID);
      user_id2 = await getSession(LOCAL_USER_ID);
      setLoding(true);
      // setSearch("");
      callResourcesListApi();
    } catch (e) {
      console.log("Error=>" + e);
      // showToastModal(e.message);
    }
  };

  const callResourcesListApi = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      // formdata.append("title", search);
      formdata.append("title", searchTemp);
      formdata.append("user_id", user_id2);

      RequestLogPrint(RESOURCE_LIST, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch(RESOURCE_LIST, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          resourceList.length = 0;
          subResourceList.length = 0;
          tempList.length = 0;
          folderPath = "";
          title = "Resources";
          setSubFolder(false);
          // setSearch("");

          if (json.results) {
            for (let i = 0; i < json.results.length; i++) {
              var createOn = "";
              if (json.results[i].created_at) {
                createOn = getDisplayTime(json.results[i].created_at)
              }
              resourceList.push({
                id: json.results[i].id,
                position: i,
                title: json.results[i].title,
                description: json.results[i].description,
                resource_type: json.results[i].resource_type,
                file_name: RESOURCE_URL + json.results[i].file_name,
                parent_id: json.results[i].parent_id,
                user_id: json.results[i].user_id,
                status: json.results[i].status,
                created_at: createOn,
                all_children: json.results[i].all_children,
              });

              subResourceList.push({
                id: json.results[i].id,
                position: i,
                title: json.results[i].title,
                description: json.results[i].description,
                resource_type: json.results[i].resource_type,
                file_name: RESOURCE_URL + json.results[i].file_name,
                parent_id: json.results[i].parent_id,
                user_id: json.results[i].user_id,
                status: json.results[i].status,
                created_at: createOn,
                all_children: json.results[i].all_children,
              });

              tempList.push({
                id: json.results[i].id,
                position: i,
                title: json.results[i].title,
                description: json.results[i].description,
                resource_type: json.results[i].resource_type,
                file_name: RESOURCE_URL + json.results[i].file_name,
                parent_id: json.results[i].parent_id,
                user_id: json.results[i].user_id,
                status: json.results[i].status,
                created_at: createOn,
                all_children: json.results[i].all_children,
              });
            }

            setResourceList(resourceList);
            setSubResourceList(subResourceList);
            setTempList(tempList);
          }
          setLoding(false);
        })
        .catch((error) => {
          resourceList.length = 0;
          subResourceList.length = 0;
          tempList.length = 0;
          folderPath = "";
          title = "Resources";
          setSubFolder(false);

          setResourceList(resourceList);
          setSubResourceList(subResourceList);
          setTempList(tempList);

          setLoding(false);
          console.log("Error=>" + error);
          // Alert.alert(APP_NAME, error + "");
          // setNetworkMessage(error.message);//new change
          // setNetworkErrorModal(true)//new change
          showToastModal(error.message);
        });
    } catch (e) {
      resourceList.length = 0;
      subResourceList.length = 0;
      tempList.length = 0;
      folderPath = "";
      title = "Resources";
      setSubFolder(false);

      setResourceList(resourceList);
      setSubResourceList(subResourceList);
      setTempList(tempList);

      setLoding(false);
      console.log("Exception=>" + e + "");
      // Alert.alert(APP_NAME, e);
      // setNetworkMessage(e);//new change
      // setNetworkErrorModal(true)//new change
      showToastModal(e);
    }
  }

  /*Run time Permission*/
  const requestPermission = async (file_name) => {
    try {
      PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
      ).then((result) => {
        if (result['android.permission.READ_EXTERNAL_STORAGE']
          && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
          console.log("Granted");
          downloadFileFunction(file_name);
        } else if (result['android.permission.READ_EXTERNAL_STORAGE']
          || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
          console.log("Denied");
        }
      });
    } catch (err) {
      setFileOpenDisabled(false);//new change
      console.warn(err);
      showToastModal(err.message);
    }
  };

  const downloadFileFunction = async (url) => {
    setLoding(true);

    let dirs = RNFetchBlob.fs.dirs;

    RNFetchBlob
      .config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        path: dirs.DocumentDir + '/' + url.split('/').pop()
      })
      .fetch('GET', url, {
        //some headers ..
      })
      .then((res) => {
        // the temp file path
        setLoding(false);
        console.log('The file saved to ', res.path())
        const path = FileViewer.open(res.path()) // absolute-path-to-my-local-file.
          .then(() => {
            // success
            setFileOpenDisabled(false);//new change
          })
          .catch((error) => {
            // error
            setFileOpenDisabled(false);//new change
            console.log('The file saved error ', error);
            // Alert.alert(APP_NAME, "No app associated with this file type");
            // setNetworkMessage("No app associated with this file type");//new change
            // showToastModal("No app associated with this file type");//new change
            showToastModal(error.message);//new change
            // setNetworkErrorModal(true)//new change
          });
      })
      .catch((e) => {
        setFileOpenDisabled(false);//new change
        showToastModal(e.message);
      })
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
    <SafeAreaView style={{ flex: 1,backgroundColor:"white" }}>
      {/* new change */}
      <View style={{ marginTop: 40, paddingTop: 0, paddingBottom: title.length > 42 ? 15 : 5, }}>
        {/* search icon */}
        <ReactNativeAnimatedSearchbox
          ref={(ref) => refSearchBox = ref}
          placeholder={'Search'}
          searchIconColor={"#999999"}
          backgroundColor="rgba(35,31,32,0.06)"
          fontSize={14}
          searchIconSize={18}
          onClosed={() => {
          }}
          onOpening={() => {
            // console.log("opening")
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
            // filterSearch(text);
          }}
          onSubmitEditing={() => {
            setLoding(true);
            callResourcesListApi();
            // alert('on submit') // called only when multiline is false
          }}
          returnKeyType="search"
          value={search}
        />
        {/* close button */}
        {serachOpen ? <Pressable onPress={() => {
          // refSearchBox.close()
          // setSerachOpen(false)
          refSearchBox.close();//new change
          setSerachOpen(false);//new change
          // const { name, value } = "";
          // setState(prevState => ({ ...prevState, [name]: value }));
          // console.log("UserName=>", username);
          setLoding(true);
          setSearch("");//new change
          searchTemp = "";
          // console.log("serach123=> ", search);
          // console.log("serach123=> ", serachOpen);
          callResourcesListApi();
          // setSearch("")

        }}
          style={{ marginRight: 10, marginLeft: 10, position: "absolute", top: 15, zIndex: 1, right: 10 }}>
          {/* <Image style={{
                            width: 25,
                            height: 25,
                            resizeMode: 'contain',
                        }} source={require('../../assets/back.png')} /> */}
          <Text style={[{ marginLeft: 20, color: "#000000", fontFamily: getRegularFont() }]}>Close</Text>
        </Pressable> : null}
        {/* back icon */}
        <View style={{ flexDirection: "row", alignItems: "center", position: "absolute", top: 15, zIndex: 0, marginRight: 10, marginLeft: 10 }}>
          {!serachOpen ?
            isSubFolder ?
              <Pressable onPress={() => {
                // console.log("Clicked");
                // backAction();
                if (isSubFolder) {
                  // navigation.goBack();
                  var temp = [];

                  subResourceList.length = 0;
                  setSubResourceList(subResourceList);
                  setSubResourceList(subResourceList => []);

                  tempList.length = 0;
                  setTempList(tempList);
                  setTempList(tempList => []);

                  // console.log("folderPath=>"+folderPath.split("-").length);
                  // console.log("folderPath=>"+folderPath);

                  temp = resourceList[folderPath.split("-")[0]];

                  for (let k = 0; k < folderPath.split("-").length - 1; k++) {
                    if (k != 0) {
                      // console.log("temp111=>"+folderPath.split("-")[k]);
                      // console.log("temp222=>"+temp.all_children.length); 
                      temp = temp.all_children[folderPath.split("-")[k]];
                      // console.log("temp333=>"+temp.all_children.length);  
                    }
                    // temp = temp.all_children[folderPath.split("-")[k]];
                    // console.log("temp123=>"+temp.length);
                  }

                  newFilePath = "";
                  for (let k = 0; k < folderPath.split("-").length - 1; k++) {
                    if (newFilePath == "") {
                      newFilePath += folderPath.split("-")[k] + "";
                    } else {
                      newFilePath += "-" + folderPath.split("-")[k];
                    }
                  }

                  folderPath = newFilePath;
                  console.log("folderPath=>" + folderPath);

                  title = temp.title;
                  // setSearch("");

                  if (folderPath.trim() != "") {
                    for (let k = 0; k < temp.all_children.length; k++) {
                      var createOn = "";
                      if (temp.all_children[k].created_at) {
                        createOn = getDisplayTime(temp.all_children[k].created_at)
                      }

                      setSubResourceList(subResourceList => [...subResourceList, {
                        id: temp.all_children[k].id,
                        position: k,
                        title: temp.all_children[k].title,
                        description: temp.all_children[k].description,
                        resource_type: temp.all_children[k].resource_type,
                        file_name: temp.all_children[k].file_name,
                        parent_id: temp.all_children[k].parent_id,
                        user_id: temp.all_children[k].user_id,
                        status: temp.all_children[k].status,
                        created_at: createOn,
                        all_children: temp.all_children[k].all_children,
                      }]);

                      setTempList(subResourceList => [...subResourceList, {
                        id: temp.all_children[k].id,
                        position: k,
                        title: temp.all_children[k].title,
                        description: temp.all_children[k].description,
                        resource_type: temp.all_children[k].resource_type,
                        file_name: temp.all_children[k].file_name,
                        parent_id: temp.all_children[k].parent_id,
                        user_id: temp.all_children[k].user_id,
                        status: temp.all_children[k].status,
                        created_at: createOn,
                        all_children: temp.all_children[k].all_children,
                      }]);
                    }
                  } else {
                    setSubFolder(false);
                    title = "Resources";
                    // setSearch("");

                    for (let k = 0; k < resourceList.length; k++) {
                      // var createOn = "";
                      // if (resourceList[k].created_at){
                      //   createOn = getDisplayTime(resourceList[k].created_at)
                      // }

                      setSubResourceList(subResourceList => [...subResourceList, {
                        id: resourceList[k].id,
                        position: k,
                        title: resourceList[k].title,
                        description: resourceList[k].description,
                        resource_type: resourceList[k].resource_type,
                        file_name: resourceList[k].file_name,
                        parent_id: resourceList[k].parent_id,
                        user_id: resourceList[k].user_id,
                        status: resourceList[k].status,
                        created_at: resourceList[k].created_at,
                        all_children: resourceList[k].all_children,
                      }]);

                      setTempList(subResourceList => [...subResourceList, {
                        id: resourceList[k].id,
                        position: k,
                        title: resourceList[k].title,
                        description: resourceList[k].description,
                        resource_type: resourceList[k].resource_type,
                        file_name: resourceList[k].file_name,
                        parent_id: resourceList[k].parent_id,
                        user_id: resourceList[k].user_id,
                        status: resourceList[k].status,
                        created_at: resourceList[k].created_at,
                        all_children: resourceList[k].all_children,
                      }]);
                    }
                  }
                }
              }}>
                <Image style={externalStyles.back_button2} source={require('../assets/back.png')} />
              </Pressable>
              : null
            : null
          }
        </View>
        {/* title view */}
        <View style={{ flexDirection: "row", alignItems: "center", position: "absolute", top: 15, zIndex: 0, marginRight: 10, marginLeft: 40, width: getWidth() - 80 }}>
          {!serachOpen ? <Text style={externalStyles.resource_title_text} numberOfLines={2}>{title}</Text>
            : null}
        </View>
        {/* <View style={{ flexDirection: "row", alignItems: "center", position: "absolute", top: 20, zIndex: 1, marginRight: 40, marginLeft: 5 }}>
          {!serachOpen ?
            isSubFolder ?
              <Pressable onPress={() => {
                // console.log("Clicked");r
                // backAction();
                if (isSubFolder) {
                  // navigation.goBack();
                  var temp = [];

                  subResourceList.length = 0;
                  setSubResourceList(subResourceList);
                  setSubResourceList(subResourceList => []);

                  tempList.length = 0;
                  setTempList(tempList);
                  setTempList(tempList => []);

                  // console.log("folderPath=>"+folderPath.split("-").length);
                  // console.log("folderPath=>"+folderPath);

                  temp = resourceList[folderPath.split("-")[0]];

                  for (let k = 0; k < folderPath.split("-").length - 1; k++) {
                    if (k != 0) {
                      // console.log("temp111=>"+folderPath.split("-")[k]);
                      // console.log("temp222=>"+temp.all_children.length); 
                      temp = temp.all_children[folderPath.split("-")[k]];
                      // console.log("temp333=>"+temp.all_children.length);  
                    }
                    // temp = temp.all_children[folderPath.split("-")[k]];
                    // console.log("temp123=>"+temp.length);
                  }

                  newFilePath = "";
                  for (let k = 0; k < folderPath.split("-").length - 1; k++) {
                    if (newFilePath == "") {
                      newFilePath += folderPath.split("-")[k] + "";
                    } else {
                      newFilePath += "-" + folderPath.split("-")[k];
                    }
                  }

                  folderPath = newFilePath;
                  console.log("folderPath=>" + folderPath);

                  title = temp.title;
                  // setSearch("");

                  if (folderPath.trim() != "") {
                    for (let k = 0; k < temp.all_children.length; k++) {
                      var createOn = "";
                      if (temp.all_children[k].created_at) {
                        createOn = getDisplayTime(temp.all_children[k].created_at)
                      }

                      setSubResourceList(subResourceList => [...subResourceList, {
                        id: temp.all_children[k].id,
                        position: k,
                        title: temp.all_children[k].title,
                        description: temp.all_children[k].description,
                        resource_type: temp.all_children[k].resource_type,
                        file_name: temp.all_children[k].file_name,
                        parent_id: temp.all_children[k].parent_id,
                        user_id: temp.all_children[k].user_id,
                        status: temp.all_children[k].status,
                        created_at: createOn,
                        all_children: temp.all_children[k].all_children,
                      }]);

                      setTempList(subResourceList => [...subResourceList, {
                        id: temp.all_children[k].id,
                        position: k,
                        title: temp.all_children[k].title,
                        description: temp.all_children[k].description,
                        resource_type: temp.all_children[k].resource_type,
                        file_name: temp.all_children[k].file_name,
                        parent_id: temp.all_children[k].parent_id,
                        user_id: temp.all_children[k].user_id,
                        status: temp.all_children[k].status,
                        created_at: createOn,
                        all_children: temp.all_children[k].all_children,
                      }]);
                    }
                  } else {
                    setSubFolder(false);
                    title = "Resources";
                    // setSearch("");

                    for (let k = 0; k < resourceList.length; k++) {
                      // var createOn = "";
                      // if (resourceList[k].created_at){
                      //   createOn = getDisplayTime(resourceList[k].created_at)
                      // }

                      setSubResourceList(subResourceList => [...subResourceList, {
                        id: resourceList[k].id,
                        position: k,
                        title: resourceList[k].title,
                        description: resourceList[k].description,
                        resource_type: resourceList[k].resource_type,
                        file_name: resourceList[k].file_name,
                        parent_id: resourceList[k].parent_id,
                        user_id: resourceList[k].user_id,
                        status: resourceList[k].status,
                        created_at: resourceList[k].created_at,
                        all_children: resourceList[k].all_children,
                      }]);

                      setTempList(subResourceList => [...subResourceList, {
                        id: resourceList[k].id,
                        position: k,
                        title: resourceList[k].title,
                        description: resourceList[k].description,
                        resource_type: resourceList[k].resource_type,
                        file_name: resourceList[k].file_name,
                        parent_id: resourceList[k].parent_id,
                        user_id: resourceList[k].user_id,
                        status: resourceList[k].status,
                        created_at: resourceList[k].created_at,
                        all_children: resourceList[k].all_children,
                      }]);
                    }
                  }
                }
              }}>
                <Image style={externalStyles.back_button2} source={require('../assets/back.png')} />
              </Pressable>
              : null
            : null
          }
          {!serachOpen ? <Text style={[externalStyles.resource_title_text, { flexWrap: "wrap", marginLeft: 20 }]} numberOfLines={2}>{title}</Text>
            : null}
        </View> */}


      </View>
      {/* //end of new change */}

      <View style={externalStyles.column_parent}>
        {isLoading ? CustomProgressBar(isLoading) : null}
        {fileOpenDisabled ? CustomLoginProgressBar(fileOpenDisabled) : null}
        {networkErrorModal ? CustomToastMessage(networkErrorModal, networkMessage) : null}


        {/* //new change */}
        {/* <View style={externalStyles.resource_row_parent}>
          {!serachOpen ?
            isSubFolder ?
              <Pressable onPress={() => {
                console.log("Clicked");
                // backAction();
                if (isSubFolder) {
                  // navigation.goBack();
                  var temp = [];

                  subResourceList.length = 0;
                  setSubResourceList(subResourceList);
                  setSubResourceList(subResourceList => []);

                  tempList.length = 0;
                  setTempList(tempList);
                  setTempList(tempList => []);

                  // console.log("folderPath=>"+folderPath.split("-").length);
                  // console.log("folderPath=>"+folderPath);

                  temp = resourceList[folderPath.split("-")[0]];

                  for (let k = 0; k < folderPath.split("-").length - 1; k++) {
                    if (k != 0) {
                      // console.log("temp111=>"+folderPath.split("-")[k]);
                      // console.log("temp222=>"+temp.all_children.length); 
                      temp = temp.all_children[folderPath.split("-")[k]];
                      // console.log("temp333=>"+temp.all_children.length);  
                    }
                    // temp = temp.all_children[folderPath.split("-")[k]];
                    // console.log("temp123=>"+temp.length);
                  }

                  newFilePath = "";
                  for (let k = 0; k < folderPath.split("-").length - 1; k++) {
                    if (newFilePath == "") {
                      newFilePath += folderPath.split("-")[k] + "";
                    } else {
                      newFilePath += "-" + folderPath.split("-")[k];
                    }
                  }

                  folderPath = newFilePath;
                  console.log("folderPath=>" + folderPath);

                  title = temp.title;
                  // setSearch("");

                  if (folderPath.trim() != "") {
                    for (let k = 0; k < temp.all_children.length; k++) {
                      var createOn = "";
                      if (temp.all_children[k].created_at) {
                        createOn = getDisplayTime(temp.all_children[k].created_at)
                      }

                      setSubResourceList(subResourceList => [...subResourceList, {
                        id: temp.all_children[k].id,
                        position: k,
                        title: temp.all_children[k].title,
                        description: temp.all_children[k].description,
                        resource_type: temp.all_children[k].resource_type,
                        file_name: temp.all_children[k].file_name,
                        parent_id: temp.all_children[k].parent_id,
                        user_id: temp.all_children[k].user_id,
                        status: temp.all_children[k].status,
                        created_at: createOn,
                        all_children: temp.all_children[k].all_children,
                      }]);

                      setTempList(subResourceList => [...subResourceList, {
                        id: temp.all_children[k].id,
                        position: k,
                        title: temp.all_children[k].title,
                        description: temp.all_children[k].description,
                        resource_type: temp.all_children[k].resource_type,
                        file_name: temp.all_children[k].file_name,
                        parent_id: temp.all_children[k].parent_id,
                        user_id: temp.all_children[k].user_id,
                        status: temp.all_children[k].status,
                        created_at: createOn,
                        all_children: temp.all_children[k].all_children,
                      }]);
                    }
                  } else {
                    setSubFolder(false);
                    title = "Resources";
                    // setSearch("");

                    for (let k = 0; k < resourceList.length; k++) {
                      // var createOn = "";
                      // if (resourceList[k].created_at){
                      //   createOn = getDisplayTime(resourceList[k].created_at)
                      // }

                      setSubResourceList(subResourceList => [...subResourceList, {
                        id: resourceList[k].id,
                        position: k,
                        title: resourceList[k].title,
                        description: resourceList[k].description,
                        resource_type: resourceList[k].resource_type,
                        file_name: resourceList[k].file_name,
                        parent_id: resourceList[k].parent_id,
                        user_id: resourceList[k].user_id,
                        status: resourceList[k].status,
                        created_at: resourceList[k].created_at,
                        all_children: resourceList[k].all_children,
                      }]);

                      setTempList(subResourceList => [...subResourceList, {
                        id: resourceList[k].id,
                        position: k,
                        title: resourceList[k].title,
                        description: resourceList[k].description,
                        resource_type: resourceList[k].resource_type,
                        file_name: resourceList[k].file_name,
                        parent_id: resourceList[k].parent_id,
                        user_id: resourceList[k].user_id,
                        status: resourceList[k].status,
                        created_at: resourceList[k].created_at,
                        all_children: resourceList[k].all_children,
                      }]);
                    }
                  }
                }
              }}>
                <Image style={externalStyles.back_button2} source={require('../assets/back.png')} />
              </Pressable>
              : null
            : null
          }
          {!serachOpen ? <Text style={[externalStyles.resource_title_text,]}>{title}</Text>
            : null}
        </View> */}



        {/* {serachOpen ?
          <ReactNativeAnimatedSearchbox
            ref={(ref) => refSearchBox = ref}
            placeholder={'Search...'}
            searchIconColor={"#999999"}
            backgroundColor="red"
            onClosed={() => {
              // this.setState({ searchIconColor: '#fff' });
            }}
            onOpening={() => {
              console.log("opening")
              setSerachOpen(true)
              // this.setState({ searchIconColor: '#555' });
            }}
            onOpened={() => {
              // this.setState({ searchIconColor: '#555' });
            }}

            onChangeText={text => {
              // console.log(text)
              setSearch(text);
              // filterSearch(text);
            }}
            onSubmitEditing={() => {
              setLoding(true);
              callResourcesListApi();
              // alert('on submit') // called only when multiline is false
            }}
            returnKeyType="search"
            value={search}
          />
          : null} */}


        <View style={externalStyles.setting_divider} />
        <View style={externalStyles.notification_list_parent}>
          {/* //new change */}
          {/* <Animated.View style={{ transform: [{ translateY: searchBarAnim }] }}>
            <View style={externalStyles.resource_search_parent}>
              <Image source={require('../assets/search.png')}
                style={externalStyles.resource_search_icon} />
              <TextInput placeholder="Search"
                style={externalStyles.resource_search_edittext}
                placeholderTextColor="#999999"
                onChangeText={text => {
                  setSearch(text);
                  // filterSearch(text);
                }}
                onSubmitEditing={() => {
                  setLoding(true);
                  callResourcesListApi();
                  // alert('on submit') // called only when multiline is false
                }}
                returnKeyType="search"
                value={search} />
            </View>
          </Animated.View> */}
          {
            subResourceList.length == 0 ? <Text style={externalStyles.home_empty_text}>Folder is empty!</Text> :
              <Animated.FlatList
                style={{ transform: [{ translateY: searchBarAnim }] }}
                contentContainerStyle={{ paddingBottom: 200, paddingTop: 0 }}
                // ListHeaderComponent={
                //   <View style={externalStyles.resource_search_parent}>
                //     <Image source={require('../assets/search.png')} 
                //       style={externalStyles.resource_search_icon} />
                //     <TextInput placeholder="Search"
                //       ref={(input) => { secondTextInput = input; }}
                //       style={externalStyles.resource_search_edittext}
                //       placeholderTextColor="#999999"
                //       onChangeText={text => {
                //         setSearch(text);
                //       }} 
                //       clearButtonMode='while-editing'
                //       onSubmitEditing={()=>{
                //         setLoding(true);
                //         secondTextInput.focus();
                //         callResourcesListApi();
                //         // alert('on submit') // called only when multiline is false
                //       }}
                //       returnKeyType="search"
                //       value={search}/>
                // </View>
                // }
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={subResourceList}
                extraData={subResourceList}
                // new change
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={getSessionData}
                  />
                }
                // onScrollBeginDrag={() => {console.log("OnSCrollBegin"); setToggleSearchBar(true);}}
                onScroll={(event) => {
                  var currentOffset = event.nativeEvent.contentOffset.y;
                  var direction = currentOffset > offset ? 'down' : 'up';
                  setOffset(offset);

                  if (direction == "up") {
                    setToggleSearchBar(true);
                  } else {
                    setToggleSearchBar(false);
                  }
                  console.log("direction=>" + direction);
                }}
                renderItem={({ item }) =>
                  <Pressable onPress={() => {
                    //new change
                    refSearchBox.close();
                    setSerachOpen(false);
                    setSearch("");
                    searchTemp = "";

                    if (item.resource_type === "Folder") {
                      setSubFolder(true);
                      setToggleSearchBar(true);
                      title = item.title;
                      // setSearch("");

                      if (folderPath == "") {
                        folderPath += item.position + "";
                      } else {
                        folderPath += "-" + item.position;
                      }

                      subResourceList.length = 0;
                      setSubResourceList(subResourceList);
                      setSubResourceList(subResourceList => []);

                      tempList.length = 0;
                      setTempList(tempList);
                      setTempList(tempList => []);

                      for (let k = 0; k < item.all_children.length; k++) {
                        var createOn = "";
                        if (item.all_children[k].created_at) {
                          createOn = getDisplayTime(item.all_children[k].created_at)
                        }

                        setSubResourceList(subResourceList => [...subResourceList, {
                          id: item.all_children[k].id,
                          position: k,
                          title: item.all_children[k].title,
                          description: item.all_children[k].description,
                          resource_type: item.all_children[k].resource_type,
                          file_name: RESOURCE_URL + item.all_children[k].file_name,
                          parent_id: item.all_children[k].parent_id,
                          user_id: item.all_children[k].user_id,
                          status: item.all_children[k].status,
                          created_at: createOn,
                          all_children: item.all_children[k].all_children,
                        }]);

                        setTempList(subResourceList => [...subResourceList, {
                          id: item.all_children[k].id,
                          position: k,
                          title: item.all_children[k].title,
                          description: item.all_children[k].description,
                          resource_type: item.all_children[k].resource_type,
                          file_name: RESOURCE_URL + item.all_children[k].file_name,
                          parent_id: item.all_children[k].parent_id,
                          user_id: item.all_children[k].user_id,
                          status: item.all_children[k].status,
                          created_at: createOn,
                          all_children: item.all_children[k].all_children,
                        }]);
                      }
                    } else {
                      console.log("file_name=>" + item.file_name);
                      if (Platform.OS === 'ios') {
                        setFileOpenDisabled(true)//new change
                        downloadFileFunction(item.file_name);
                      } else {
                        setFileOpenDisabled(true)//new change
                        requestPermission(item.file_name);
                      }
                    }
                  }}
                    disabled={fileOpenDisabled}>
                    <View style={externalStyles.column_parent}>
                      <View style={externalStyles.notification_list_raw_parent}>
                        {
                          item.resource_type == "Folder" ?
                            <Image style={externalStyles.notification_list_items_icon}
                              source={require('../assets/folder_list.png')} />
                            :
                            // <Image style={externalStyles.notification_list_items_icon} />
                            // new change
                            <Image style={externalStyles.notification_list_items_icon}
                              source={require('../assets/file.png')} />
                        }

                        <View style={{ flexDirection: "column", flex: 1 }}>
                          <Text style={externalStyles.home_list_items_text1}>{item.title}</Text>
                          <Text style={externalStyles.resource_time}>{item.description}</Text>
                          {/* <Text  style={externalStyles.home_list_items_text2}>{item.notification_message}</Text> */}
                        </View>

                        {/* {
                          item.resource_type != "Folder" ?
                            <Image style={externalStyles.notification_list_items_icon}
                              source={require('../assets/file.png')} />
                            :
                            <Image style={externalStyles.notification_list_items_icon} />
                        } new chnage*/}
                      </View>
                      <View style={externalStyles.notification_list_divider} />
                    </View>
                  </Pressable>
                }
              />
          }
        </View>
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
    </SafeAreaView>
  );
}