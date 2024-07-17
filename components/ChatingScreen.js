/*npm install --save react-native-swipe-list-view 
For chat swipe listview (SwipeListView)

example : https://snack.expo.dev/@jemise111/react-native-swipe-list-view*/

/*
Bubble icon for chat
https://www.freecodecamp.org/news/design-imessage-like-chat-bubble-react-native/
*/

/*
For image / video picker and camera capture

npm install react-native-image-picker --save

https://github.com/react-native-image-picker/react-native-image-picker //Primary

https://effectussoftware.com/blog/react-native-image-picker/
*/

// https://snack.expo.dev/@xeteke8423/frisky-truffle

import React, { useEffect, useState } from 'react';
import { Dimensions, Text, View, Image, FlatList, Pressable, TextInput, Alert, StyleSheet, Modal, PermissionsAndroid, BackHandler } from 'react-native';
import { externalStyles } from '../common/styles';
import { CustomProgressBar, getDisplayTime, validateEmail, RequestLogPrint, itsToday, changeDateTimeFormat, convertUTCToLocal, getCurrentDateTime, getCurrentTime, CustomToastMessage } from '../common/utils';
import { SwipeListView } from 'react-native-swipe-list-view';
import { getSession, USER_ID, FIRST_NAME, LAST_NAME, EMAIL, ACCESS_TOKEN, PROFILE_IMG, PHONE, LOCAL_USER_ID } from '../common/LocalStorage';
import { APP_NAME } from '../common/strings';
import { CHAT_FILE_URL, CLEAR_CHAT, DELETE_CHAT, FILE_SEND, GET_GROUP_MESSAGES, IMAGE_THUMB_URL, NOTIFICATION_LIST, NOTIFICATION_READ } from '../common/webUtils';
import LinearGradient from 'react-native-linear-gradient';
//  npm install --save react-native-paper
import { Button, Menu, Divider, Provider } from 'react-native-paper';
// npm install react-native-image-picker --save
import * as ImagePicker from 'react-native-image-picker';
// npm i socket.io-client --save
import { io } from "socket.io-client";
import { Manager } from "socket.io-client";
// import SocketIOClient from 'socket.io-client';
// Video convert to Base64
import RNFS from 'react-native-fs';
import { Video } from 'react-native-compressor';

var user_id = "", group_id = "", group_type = "", message_ids = "", group_name = "", group_picture = "", isScoketConnect = false, user_name;
let socket, flatList;
var last_date_receive = "";
var media_response = "";

export function ChatingScreen({ navigation, route }) {
  const [response, setResponse] = useState(null);

  // if (route.params !== undefined){

  group_id = route.params.group_id;
  group_type = route.params.group_type;
  group_name = route.params.name;
  group_picture = route.params.group_pic;

  // console.log("group_picture=>"+group_picture);
  // }

  const [isLoading, setLoding] = useState(false);
  const [sendMessageDisabled, setSendMessageDisabled] = useState(false);

  const [isSelectMore, setSelectMore] = useState(false);
  const [isCheckBox, setIsCheckBox] = useState(false);
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [bottomOptionVisible, setBottomOptionVisible] = useState(false);
  const [bottomDeleteOptionVisible, setBottomDeleteOptionVisible] = useState(false);

  //new change
  const [sendButtonDisable, setSendButtonDisable] = useState(false);
  const [networkErrorModal, setNetworkErrorModal] = useState(false);//new change
  const [networkMessage, setNetworkMessage] = useState("");//new change

  const openMenu = () => setVisibleMenu(true);

  const closeMenu = () => setVisibleMenu(false);

  const [messageType, setMessageType] = useState("");
  const [deleteMessageCount, setDeleteMessageCount] = useState(0);
  const [deleteMessageList, setDeleteMessageList] = useState([]);

  const [chatUserList, setChatUserList] = useState([]);
  const [deleteList, setDeleteList] = useState([]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      // This must be below your `window.navigator` hack above
      // const io = require('socket.io-client/socket.io');
      message_ids = "";
      connectSocket();
      getSessionData();
    });

    const backAction = () => {
      console.log("Click back button!");
      if (socket) {
        socket.disconnect();
      }
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getSessionData = async () => {
    try {
      user_id = await getSession(LOCAL_USER_ID);
      user_name = await getSession(FIRST_NAME) + " " + await getSession(LAST_NAME);
      callChatListApi();
    } catch (e) {
      console.log("Error=>" + e);
      showToastModal(e);
    }
  };

  /* Socket connection */
  const connectSocket = async () => {
    //put your backend serve url here  
    // http://157.230.203.199:8890
    const manager = new Manager("http://157.230.203.199:8890", {
      autoConnect: false,
      transports: ['websocket'],
      rejectUnauthorized: false,
    });

    // const adminSocket = manager.socket("/admin");
    console.log("Connecting...");
    manager.open((err) => {
      if (err) {
        isScoketConnect = false;
        // an error has occurred
        console.log("an error has occurred=>" + err);
      } else {
        // the connection was successfully established
        console.log("the connection was successfully established");

        // socket = io("http://157.230.203.199:8890/");

        // console.log(socket.id);
        socket = manager.socket("/");

        socket.connect();

        socket.on("connect", () => {
          isScoketConnect = true;

          const engine = socket.io.engine;
          console.log("engine.transport.name=>" + engine.transport.name); // in most cases, prints "polling"

          engine.once("upgrade", () => {
            // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
            console.log(engine.transport.name); // in most cases, prints "websocket"
          });

          engine.on("packet", ({ type, data }) => {
            // called for each packet received
            // console.log("packet type=>"+type);
            // console.log("packet data=>"+JSON.stringify(data));
          });

          engine.on("packetCreate", ({ type, data }) => {
            // called for each packet sent
            // console.log("packetCreate type=>"+type);
            // console.log("packetCreate data=>"+JSON.stringify(data));
          });

          engine.on("drain", () => {
            // called when the write buffer is drained
            // console.log("drain");
          });

          engine.on("close", (reason) => {
            isScoketConnect = false;
            // called when the underlying connection is closed
            console.log("close");
          });

          // console.log("add user=>"+{'client':user_id,'conversation':group_id});

          // var addUser = [];
          // addUser.push({client:user_id,conversation:group_id});

          // console.log("addUser[0]"+addUser[0].client);
          // console.log("addUser[0]"+addUser[0].conversation);

          // engine.emit("add user",addUser[0]);

          // engine.on('message_front', (data)=> {
          //   console.log("data=>"+JSON.stringify(data));
          //   if(data.is_read=="1"){

          //   }
          // });
        });

        // socket.listen('data',(res)=>{
        //     console.warn(res);
        // });

        socket.on('connect_error', (err) => {
          console.log("connect_error=>" + err)
          isScoketConnect = false;
        });

        socket.on("disconnect", (reason) => {
          console.log("disconnect=>" + reason)
          if (reason === "io server disconnect") {
            // the disconnection was initiated by the server, you need to reconnect manually
            // socket.connect();
          }
          // else the socket will automatically try to reconnect
        });

        var addUser = [];
        addUser.push({ client: user_id, conversation: group_id });
        console.log("addUser[0]" + addUser[0].client);
        console.log("addUser[0]" + addUser[0].conversation);

        socket.emit("add user", addUser[0]);

        socket.on('message_front', (data) => {
          console.log("data123=>" + JSON.stringify(data));
          if (data.group_id == group_id) {

            var isSend = data.owner == "owner" ? 1 : 0;
            var msg_time = getCurrentTime("HH:mm:ss");
            var msg_date = "Today";

            // msg_date = msg_date.replace("T"," ");
            //   // msg_date = "2021-12-17 13:30:00";
            // msg_date = convertUTCToLocal(msg_date,"YYYY-MM-DD HH:mm:ss");

            // msg_time = msg_date;

            // if (itsToday(msg_date.split(" ")[0])){
            //   msg_date = "Today";
            //   msg_time = changeDateTimeFormat(msg_time,"YYYY-MM-DD HH:mm:ss","HH:mm");
            // }else{
            //   msg_date = changeDateTimeFormat(msg_date,"YYYY-MM-DD HH:mm:ss","dddd");
            //   msg_time = changeDateTimeFormat(msg_time,"YYYY-MM-DD HH:mm:ss","HH:mm");
            // }


            if (last_date_receive == "Today") {
              msg_date = "";
              msg_time = "";
            }
            // last_date = (json.RESULT.map_message[i].created_at.split(".")[0]).replace("T"," ").split(" ")[0];

            last_date_receive = "Today";

            if (data.file_chat != "") {
              if (data.file_chat.toUpperCase().includes(".MP4") || data.file_chat.toUpperCase().includes(".MOV") || data.file_chat.toUpperCase().includes(".WMV") || data.file_chat.toUpperCase().includes(".AVI") || data.file_chat.toUpperCase().includes(".MKV")) {
                console.log("data.video=>" + data.file_chat);
                setChatUserList(chatUserList => [...chatUserList, {
                  id: data.message_map_id,
                  message_id: data.message_id,
                  isSend: isSend,
                  message: "",
                  isChecked: 0,
                  isReadMore: 0,
                  isVideo: 1,
                  video: CHAT_FILE_URL + data.file_chat,
                  isImage: 0,
                  image: "",
                  msg_date: msg_date,
                  msg_time: msg_time,
                  read: "",
                  clear: 0,
                  isLoad: 0
                }]);

                chatUserList.push({
                  id: data.message_map_id,
                  message_id: data.message_id,
                  isSend: isSend,
                  message: "",
                  isChecked: 0,
                  isReadMore: 0,
                  isVideo: 1,
                  video: CHAT_FILE_URL + data.file_chat,
                  isImage: 0,
                  image: "",
                  msg_date: msg_date,
                  msg_time: msg_time,
                  read: "",
                  clear: 0,
                  isLoad: 0
                });
              } else {
                console.log("data.image=>" + data.file_chat);
                setChatUserList(chatUserList => [...chatUserList, {
                  id: data.message_map_id,
                  message_id: data.message_id,
                  isSend: isSend,
                  message: "",
                  isChecked: 0,
                  isReadMore: 0,
                  isVideo: 0,
                  video: "",
                  isImage: 1,
                  image: CHAT_FILE_URL + data.file_chat,
                  msg_date: msg_date,
                  msg_time: msg_time,
                  read: "",
                  clear: 0,
                  isLoad: 0
                }]);

                chatUserList.push({
                  id: data.message_map_id,
                  message_id: data.message_id,
                  isSend: isSend,
                  message: "",
                  isChecked: 0,
                  isReadMore: 0,
                  isVideo: 0,
                  video: "",
                  isImage: 1,
                  image: CHAT_FILE_URL + data.file_chat,
                  msg_date: msg_date,
                  msg_time: msg_time,
                  read: "",
                  clear: 0,
                  isLoad: 0
                });
              }
            } else {
              setChatUserList(chatUserList => [...chatUserList, {
                id: data.message_map_id,
                message_id: data.message_id,
                isSend: isSend,
                message: data.msg,
                isChecked: 0,
                isReadMore: 0,
                isVideo: 0,
                video: "",
                isImage: 0,
                image: "",
                msg_date: msg_date,
                msg_time: msg_time,
                read: "",
                clear: 0,
                isLoad: 0
              }]);

              chatUserList.push({
                id: data.message_map_id,
                message_id: data.message_id,
                isSend: isSend,
                message: data.msg,
                isChecked: 0,
                isReadMore: 0,
                isVideo: 0,
                video: "",
                isImage: 0,
                image: "",
                msg_date: msg_date,
                msg_time: msg_time,
                read: "",
                clear: 0,
                isLoad: 0
              });
            }

            socket.emit('read_msg', data);
          }
        });

        socket.on('read-update-html', (data) => {
          console.log("read-update-html=>" + JSON.stringify(data));
          // for (var k = 0 ; k < chatUserList.length ; k++){
          //   console.log("data.message_id123=>"+data.message_id+":"+chatUserList[k].message_id);
          //   if (data.message_id === chatUserList[k].message_id) {
          //     console.log("data.message_id=>"+data.message_id)
          //     setChatUserList({ ...chatUserList[k], read: data.receiver_name +" : now\n" });
          //   }
          // }

          let temp = chatUserList.map((product) => {
            if (data.message_id === product.message_id) {
              return { ...product, read: data.receiver_name + " : now\n" };
            }
            return product;
          });
          setChatUserList(temp);
        });
      }
    });

    // socket = io("http://localhost");

    // socket.on("connect", () => {
    //   console.log(socket.connected); // true
    // });

    // socket.on('connect', () => {
    //   console.log("socket connected")
    // });

    // socket.on('connect_error', (err) => {
    //   console.log(err)
    // });

    // socket.on('disconnect', () => {
    //   console.log("Disconnected Socket!")
    // });

    // socket.on('get_group_messages', data => {
    //   var userMessageData = JSON.parse(data);
    //   var chatDataArray = [...this.state.userChatList];
    //   let message = [userMessageData];
    //   let newChatArray = message.concat(chatDataArray);
    // });
  }

  const submitChatMessage = async () => {
    try {
      if (isScoketConnect) {
        console.log("submitChatMessage");
        // socket.emit('send_msg', {"channel_name":"message-update",'text':msg,'file_chat':file_chat,'auth_id':{{Auth::user()->id}},'auth_name':"{{Auth::user()->fname}} {{Auth::user()->lname}}",
        //                          'group_id':{{$chat->id}}});
        var addUser = [];
        addUser.push({ channel_name: "message-update", text: messageType, group_id: group_id, auth_id: user_id, auth_name: user_name });
        console.log("addUser[0]" + addUser[0].text);
        console.log("addUser[0]" + addUser[0].group_id);

        // socket.emit("add user",);

        socket.emit('send_msg', addUser[0]);
        // socket.emit('send_msg', addUser[0],(data)=> {
        //   console.log("data321=>"+JSON.stringify(data));
        // });
        setSendButtonDisable(false)//new change
        setMessageType('');

        // socket.emit('chat message', messageType);
      }
    } catch (e) {
      setSendButtonDisable(false)//new change
      console.log("Error=>" + e);
      showToastModal(e);
    }
  }

  const submitFileChatMessage = async (file_base64) => {
    try {
      if (isScoketConnect) {
        console.log("submitChatMessage");
        // socket.emit('send_msg', {"channel_name":"message-update",'text':msg,'file_chat':file_chat,'auth_id':{{Auth::user()->id}},'auth_name':"{{Auth::user()->fname}} {{Auth::user()->lname}}",
        //                          'group_id':{{$chat->id}}});
        var addUser = [];
        addUser.push({ channel_name: "message-update", text: "", file_chat: file_base64, group_id: group_id, auth_id: user_id, auth_name: user_name });
        console.log("addUser[0]" + addUser[0].file_chat);
        console.log("addUser[0]" + addUser[0].group_id);

        // socket.emit("add user",);

        socket.emit('send_msg', addUser[0]);
        // socket.emit('send_msg', addUser[0],(data)=> {
        //   console.log("data321=>"+JSON.stringify(data));
        // });
        setMessageType('');

        // socket.emit('chat message', messageType);
      }
    } catch (e) {
      console.log("Error=>" + e);
      showToastModal(e);
    }
  }

  const callChatFileApi = async (uri, fileName, fileType) => {
    try {
      console.log("uri=>" + uri);
      console.log("fileName=>" + fileName);
      console.log("fileType=>" + fileType);
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("file_chat", { uri: uri, name: fileName, filename: fileName, type: fileType });
      // formdata.append("file_chat", {uri: newImageUri,name: fileName,filename :fileName,type: fileType});
      // formdata.append("file_chat", uri);
      formdata.append('Content-Type', fileType);

      RequestLogPrint(FILE_SEND, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setLoding(true);
      setSendMessageDisabled(true);

      fetch(FILE_SEND, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          if (json.RESULT) {
            submitFileChatMessage(json.RESULT.filename);
          } else {
            // Alert.alert(APP_NAME,json.error);
          }
          setLoding(false);
          setSendMessageDisabled(false);
        })
        .catch((error) => {
          setLoding(false);
          setSendMessageDisabled(false);
          console.log("Error=>" + error);
          // Alert.alert(APP_NAME, error + "");
          // setNetworkMessage(error.message);//new change
          // setNetworkErrorModal(true)//new change
          showToastModal(error.message);
        });
    } catch (e) {
      setLoding(false);
      setSendMessageDisabled(false);
      console.log("Exception=>" + e + "");
      // Alert.alert(APP_NAME, e);
      // setNetworkMessage(e);//new change
      // setNetworkErrorModal(true)//new change
      showToastModal(e);
    }
  }

  const callChatListApi = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("user_id", user_id);
      formdata.append("group_id", group_id);

      RequestLogPrint(GET_GROUP_MESSAGES, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setLoding(true);
      chatUserList.length = 0;

      fetch(GET_GROUP_MESSAGES, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          if (json.RESULT) {
            // console.log("chatUserList=>"+chatUserList.length);
            var last_date = "";

            for (let i = 0; i < json.RESULT.map_message.length; i++) {
              var isSend = user_id == json.RESULT.map_message[i].sender_id ? 1 : 0;
              var msg_time = "";
              var msg_date = json.RESULT.map_message[i].created_at.split(".")[0];

              msg_date = msg_date.replace("T", " ");
              // msg_date = "2021-12-17 13:30:00";
              msg_date = convertUTCToLocal(msg_date, "YYYY-MM-DD HH:mm:ss");

              msg_time = msg_date;

              if (itsToday(msg_date.split(" ")[0])) {
                msg_date = "Today";
                msg_time = changeDateTimeFormat(msg_time, "YYYY-MM-DD HH:mm:ss", "HH:mm");
              } else {
                msg_date = changeDateTimeFormat(msg_date, "YYYY-MM-DD HH:mm:ss", "dddd");
                msg_time = changeDateTimeFormat(msg_time, "YYYY-MM-DD HH:mm:ss", "HH:mm");
              }


              if ((json.RESULT.map_message[i].created_at.split(".")[0]).replace("T", " ").split(" ")[0] == last_date) {
                msg_date = "";
                msg_time = "";
              }
              last_date = (json.RESULT.map_message[i].created_at.split(".")[0]).replace("T", " ").split(" ")[0];

              // console.log("last_date=>"+last_date);
              // console.log("json.RESULT=>"+(json.RESULT.map_message[i].created_at.split(".")[0]).replace("T"," ").split(" ")[0]);

              var isRead = "";
              // var read_at = "";
              if (json.RESULT.map_message[i].message.map_message) {
                if (json.RESULT.map_message[i].message.map_message.length > 0) {
                  for (var k = 0; k < json.RESULT.map_message[i].message.map_message.length; k++) {
                    var read_at = "";
                    if (json.RESULT.map_message[i].message.map_message[k].is_read == "1") {
                      read_at = json.RESULT.map_message[i].message.map_message[k].read_at;

                      if (read_at) {
                        if (json.RESULT.map_message[i].message.map_message[k].receiver.id != user_id) {
                          if (itsToday((read_at.split(".")[0]).replace("T", " ").split(" ")[0])) {
                            isRead += json.RESULT.map_message[i].message.map_message[k].receiver.fname + " : "
                              + changeDateTimeFormat((read_at.split(".")[0]).replace("T", " "), "YYYY-MM-DD HH:mm:ss", "HH:mm") + "\n";
                          } else {
                            isRead += json.RESULT.map_message[i].message.map_message[k].receiver.fname + " : "
                              + changeDateTimeFormat((read_at.split(".")[0]).replace("T", " "), "YYYY-MM-DD HH:mm:ss", "dddd HH:mm") + "\n";
                          }
                        }
                      }
                    }
                  }
                  // read_at = json.RESULT.map_message[i].message.map_message[json.RESULT.map_message[i].message.map_message.length-1].read_at;
                  // read_at = json.RESULT.map_message[i].message.map_message[0].read_at;
                }
              }

              // if (read_at){
              //   // 2021-12-15T12:59:53.000000Z
              //   if (itsToday((read_at.split(".")[0]).replace("T"," ").split(" ")[0])){
              //     isRead = changeDateTimeFormat((read_at.split(".")[0]).replace("T"," "),"YYYY-MM-DD HH:mm:ss","HH:mm");
              //   }else{
              //     isRead = changeDateTimeFormat((read_at.split(".")[0]).replace("T"," "),"YYYY-MM-DD HH:mm:ss","dddd HH:mm");
              //   }
              // }
              // console.log("isRead=>"+isRead);
              if (json.RESULT.map_message[i].message.message_body) {
                chatUserList.push({
                  id: json.RESULT.map_message[i].id,
                  message_id: json.RESULT.map_message[i].message_id,
                  isSend: isSend,
                  message: json.RESULT.map_message[i].message.message_body,
                  isChecked: 0,
                  isReadMore: 0,
                  isVideo: 0,
                  video: "",
                  isImage: 0,
                  image: "",
                  msg_date: msg_date,
                  msg_time: msg_time,
                  read: isRead,
                  clear: 0,
                  isLoad: 0
                });
              } else {
                console.log("CHAT_FILE_URL=>" + CHAT_FILE_URL + json.RESULT.map_message[i].message.file);
                if (json.RESULT.map_message[i].message.file.toUpperCase().includes('.MP4') || json.RESULT.map_message[i].message.file.toUpperCase().includes(".MOV") || json.RESULT.map_message[i].message.file.toUpperCase().includes(".WMV") || json.RESULT.map_message[i].message.file.toUpperCase().includes(".AVI") || json.RESULT.map_message[i].message.file.toUpperCase().includes(".MKV")) {
                  chatUserList.push({
                    id: json.RESULT.map_message[i].id,
                    message_id: json.RESULT.map_message[i].message_id,
                    isSend: isSend,
                    message: "",
                    isChecked: 0,
                    isReadMore: 0,
                    isVideo: 1,
                    video: CHAT_FILE_URL + json.RESULT.map_message[i].message.file,
                    isImage: 0,
                    image: "",
                    msg_date: msg_date,
                    msg_time: msg_time,
                    read: isRead,
                    clear: 0,
                    isLoad: 0
                  });
                } else {
                  chatUserList.push({
                    id: json.RESULT.map_message[i].id,
                    message_id: json.RESULT.map_message[i].message_id,
                    isSend: isSend,
                    message: "",
                    isChecked: 0,
                    isReadMore: 0,
                    isVideo: 0,
                    video: "",
                    isImage: 1,
                    image: CHAT_FILE_URL + json.RESULT.map_message[i].message.file,
                    msg_date: msg_date,
                    msg_time: msg_time,
                    read: isRead,
                    clear: 0,
                    isLoad: 0
                  });
                }
              }
            }
            setChatUserList(chatUserList);
          } else {
            // Alert.alert(APP_NAME,json.error);
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
      // console.log("Exception=>" + e + "");
      // Alert.alert(APP_NAME, e);
      // setNetworkMessage(e);//new change
      // setNetworkErrorModal(true)//new change
      showToastModal(e);
    }
  }

  const callDeleteChatApi = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("user_id", user_id);
      formdata.append("group_id", group_id);
      formdata.append("message_id", message_ids);

      RequestLogPrint(DELETE_CHAT, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setLoding(true);

      fetch(DELETE_CHAT, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);
          let temp;
          message_ids = "";
          if (json.STATUS == 200) {
            setChatUserList(chatUserList.filter(item => item.isChecked !== 1));

            // setChatUserList(temp);
            // callChatListApi();
            // setChatUserList(chatUserList.filter(item => item.group_id !== group_id));
          } else {
            // Alert.alert(APP_NAME, json.MESSAGE);
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

  const callClearChatApi = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("user_id", user_id);
      formdata.append("group_id", group_id);

      RequestLogPrint(CLEAR_CHAT, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setLoding(true);

      fetch(CLEAR_CHAT, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);
          let temp;
          message_ids = "";

          if (json.STATUS == 200) {
            chatUserList.length = 0;
          } else {
            // Alert.alert(APP_NAME, json.MESSAGE);
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

  // const initiateSocket = (room) => {
  //   socket = io('http://localhost:3000');
  //   console.log(`Connecting socket...`);
  //   if (socket && room) socket.emit('join', room);
  // }

  // const disconnectSocket = () => {
  //   console.log('Disconnecting socket...');
  //   if(socket) socket.disconnect();
  // }

  // const subscribeToChat = (cb) => {
  //   if (!socket) return(true);
  //   socket.on('chat', msg => {
  //     console.log('Websocket event received!');
  //     return cb(null, msg);
  //   });
  // }

  // const sendMessage = (room, message) => {
  //   if (socket) socket.emit('chat', { message, room });
  // }

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
    // ImagePicker.launchImageLibrary(options, setResponse);
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log(response, "image picker response");
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        // Alert.alert("Please try again");
        // setNetworkMessage("Please try again");//new change
        // setNetworkErrorModal(true)//new change
        showToastModal("Please try again");
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        callChatFileApi(response.assets[0].uri, response.assets[0].fileName, response.assets[0].type);

        // RNFS.readFile(response.assets[0].uri, 'base64').then(res => {
        //   console.log("Res=>"+res);
        //   submitFileChatMessage("data:"+response.assets[0].type+";base64,"+res);
        // })
        // .catch(err => {
        //     console.log(err.message, err.code);
        // });
        // submitFileChatMessage("data:"+response.assets[0].type+";base64,"+response.assets[0].base64);
        console.log("image Picker worked!")
      }
    });

    // console.log("Response=>"+JSON.stringify(response));

    // submitFileChatMessage(response.assets[0].base64);
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
    // ImagePicker.launchCamera(options, setResponse);
    ImagePicker.launchCamera(options, (response) => {
      console.log(response, "image picker response");
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        // Alert.alert("Please try again");
        // setNetworkMessage("Please try again");//new change
        // setNetworkErrorModal(true)//new change
        showToastModal("Please try again");
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        callChatFileApi(response.assets[0].uri, response.assets[0].fileName, response.assets[0].type);
        // submitFileChatMessage(response.assets[0].base64);
        // RNFS.readFile(response.assets[0].uri, 'base64').then(res => {
        //   console.log("Res=>"+res);
        //   submitFileChatMessage("data:"+response.assets[0].type+";base64,"+res);
        // })
        // .catch(err => {
        //     console.log(err.message, err.code);
        // });
        // submitFileChatMessage("data:"+response.assets[0].type+";base64,"+response.assets[0].base64);
        console.log("image Picker worked!")
      }
    });

    // console.log("Response=>"+response);
  }

  const videoCompress = async (file_path, file_name, file_type) => {
    try {
      setSendMessageDisabled(true);

      const result = await Video.compress(
        file_path,
        {
          compressionMethod: 'auto',
        },
        (progress) => {
          console.log('Compression Progress: ', progress);
          // setCompressingProgress(progress);
          // console.log('Compression : ', result);
        }
      );
      console.log('Compression : ', result);
      console.log('Compression : ', result.split('/').pop());
      // if (await RNFS.exists(result)){
      //   console.log("BLAH EXISTS");
      // } else {
      //     console.log("BLAH DOES NOT EXIST");
      // }
      const newImageUri = "file:///" + result.split("file:/").join("");
      callChatFileApi(newImageUri, result.split('/').pop(), file_type);
    } catch (e) {
      setSendMessageDisabled(false);
      console.log("Error=>" + e);
      showToastModal(e);
    }
  };

  // Launch Video
  const launchVideo = () => {
    let options = {
      // selectionLimit: 0,
      videoQuality: 'low',
      mediaType: 'video',
      includeBase64: false,
    };
    // ImagePicker.launchImageLibrary(options, setResponse);
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log(response, "image picker response");
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        // Alert.alert("Please try again");
        // setNetworkMessage("Please try again");//new change
        // setNetworkErrorModal(true)//new change
        showToastModal("Please try again");
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        // callChatFileApi(response.assets[0].uri,response.assets[0].fileName,response.assets[0].type);
        // RNFS.readFile(response.assets[0].uri, 'base64').then(res => {
        //   console.log("Res=>"+res);
        //   submitFileChatMessage("data:"+response.assets[0].type+";base64,"+res);
        // })
        // .catch(err => {
        //     console.log(err.message, err.code);
        // });
        videoCompress(response.assets[0].uri, response.assets[0].fileName, response.assets[0].type);
        console.log("image Picker worked!=>" + response.assets[0].fileSize)
      }
    });

    // console.log("Response=>"+response.uri);
    // console.log("Response=>"+response.fileName);
  }

  function containsOnlyEmojis(text) {
    const onlyEmojis = text.replace(new RegExp('[\u0000-\u1eeff]', 'g'), '')
    const visibleChars = text.replace(new RegExp('[\n\r\s]+|( )+', 'g'), '')
    return onlyEmojis.length === visibleChars.length
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
    <Provider>

      <View style={externalStyles.column_parent}>
        {isLoading ? CustomProgressBar(isLoading) : null}
        {networkErrorModal ? CustomToastMessage(networkErrorModal, networkMessage) : null}

        <View style={externalStyles.chating_row_parent}>
          <Pressable onPress={() => {
            socket.disconnect();
            navigation.goBack();
          }}>
            <Image style={externalStyles.chat_back_button} source={require('../assets/back.png')} />
          </Pressable>
          <View style={externalStyles.chating_row_parent_title}>
            <Pressable onPress={() => {
              if (group_type == "2") {
                navigation.navigate('GroupDetails', { group_id: group_id })
              }
            }}>
              <View>
                {
                  <Image style={externalStyles.chating_profile_image}
                    source={{ uri: group_picture }} />
                }
                {
                  //   response?
                  //   response.assets?<Text style={externalStyles.chating_profile_name}>{JSON.stringify({uri: response.assets[0].uri})}</Text>:<Text style={externalStyles.chating_profile_name}>Name</Text>
                  // :
                  <Text style={externalStyles.chating_profile_name}>{group_name}</Text>
                }
              </View>
            </Pressable>
          </View>
        </View>
        <View style={externalStyles.setting_divider} />

        <FlatList
          style={externalStyles.chating_list}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={chatUserList}
          ref={ref => flatList = ref}
          // inverted
          // contentContainerStyle={{ flexDirection: 'column-reverse' }}
          onContentSizeChange={() => {
            if (isSelectMore) {
              setSelectMore(false);
            } else {
              flatList.scrollToEnd({ animated: true });
            }
          }}
          ListFooterComponent={() => (
            <View style={{ margin: 15 }} />
          )}
          onLayout={() => flatList.scrollToEnd({ animated: true })}
          keyExtractor={(item, id) => String(id)}
          // contentContainerStyle={{ paddingBottom: 50, paddingTop:10 }}
          renderItem={({ item }) =>
            item.isSend == 1 ?
              <View>
                {
                  item.msg_date == "" ?
                    null
                    :
                    <View style={externalStyles.chat_daytime_parent}>
                      <Text style={externalStyles.chat_day_title}>{item.msg_date}</Text>
                      <Text style={externalStyles.chat_time_title}> {item.msg_time}</Text>
                    </View>
                }
                <Pressable onPress={() => {
                  // let list =  chatUserList;

                  // list[item.id].isChecked == 0 ?  list[item.id].isChecked = 1 : list[item.id].isChecked = 0;

                  // setUpdateList({list});
                  if (isCheckBox) {
                    let temp = chatUserList.map((product) => {
                      console.log(product.isVideo);
                      if (item.id === product.id) {
                        { product.isChecked == 0 ? setDeleteMessageCount(deleteMessageCount + 1) : setDeleteMessageCount(deleteMessageCount - 1); }
                        { product.isChecked == 0 ? message_ids += product.id + "," : message_ids = message_ids.replace(product.id + ",", ""); }
                        return { ...product, isChecked: product.isChecked == 0 ? 1 : 0 };
                      }
                      return product;
                    });
                    setChatUserList(temp);
                  } else if (item.isImage == 1) {
                    navigation.navigate('FullScreenImg', { isImage: 1, isVideo: 0, url: item.image });
                  } else if (item.isVideo == 1) {
                    navigation.navigate('FullScreenImg', { isImage: 0, isVideo: 1, url: item.video });
                  }
                }}>
                  <View style={externalStyles.clear_chat_parent}>
                    {isCheckBox ? <Image style={externalStyles.clear_checkbox} source={item.isChecked == 0 ? require('../assets/check_deactive.png') : require('../assets/check_active.png')} /> : null}

                    {
                      item.message == "" ?
                        // Second Condition
                        item.isVideo == 1 ?
                          <View style={{ marginRight: isCheckBox ? Dimensions.get("window").width > 400 ? Dimensions.get("window").width * 0.015 : Dimensions.get("window").width * 0.13 : Dimensions.get("window").width > 400 ? -Dimensions.get("window").width * 0.05 : Dimensions.get("window").width * 0.05, flex: 1 }}>
                            <Image style={externalStyles.chat_video_sender_back} source={{ uri: item.video, }} />
                            <Image style={[externalStyles.play_sender_button_icon, { marginRight: isCheckBox ? Dimensions.get("window").width > 400 ? Dimensions.get("window").width * 0.20 : Dimensions.get("window").width * 0.10 : Dimensions.get("window").width > 400 ? Dimensions.get("window").width * 0.27 : Dimensions.get("window").width * 0.185 }]} source={require('../assets/video_play.png')} />
                          </View>
                          :
                          <View style={{ marginRight: isCheckBox ? Dimensions.get("window").width > 400 ? Dimensions.get("window").width * 0.015 : Dimensions.get("window").width * 0.13 : Dimensions.get("window").width > 400 ? -Dimensions.get("window").width * 0.05 : Dimensions.get("window").width * 0.05, flex: 1 }}>
                            <Image style={item.isLoad ? externalStyles.chat_image_sender_back : externalStyles.chat_image_sender_back_hide} source={{ uri: item.image, }}
                              onLoadEnd={e => {
                                let temp = chatUserList.map((product) => {
                                  if (item.id === product.id) {
                                    return { ...product, isLoad: product.isLoad = 1 };
                                  }
                                  return product;
                                });
                                setChatUserList(temp);
                              }} />
                            {
                              item.isLoad == 0 ? <Text style={externalStyles.chat_image_sender_loading}>Loading...</Text> : null
                            }
                          </View>
                        // Closed Second Condition
                        :
                        <View style={{ flex: 1 }}>
                          {!containsOnlyEmojis(item.message) ?
                            <View style={{
                              // flex:1,
                              backgroundColor: "#F47920",
                              padding: 14,
                              // marginLeft: '30%',
                              borderRadius: 5,
                              //marginBottom: 15,
                              marginTop: 5,
                              marginRight: "5%",
                              maxWidth: '71%', //new change
                              alignSelf: 'flex-end',
                              //maxWidth: 500,
                              borderRadius: 20,
                            }}>

                              <Text style={externalStyles.chat_send_msg} >{item.message}</Text>

                              <View style={styles.rightArrow} />

                              <View style={styles.rightArrowOverlap} />
                            </View>
                            :
                            <View style={{
                              // flex:1,
                              padding: 10,
                              // marginLeft: '30%',
                              borderRadius: 5,
                              //marginBottom: 15,
                              marginTop: 5,
                              marginRight: "5%",
                              maxWidth: '71%', //new change
                              alignSelf: 'flex-end',
                              //maxWidth: 500,
                              borderRadius: 20,
                            }}>
                              <Text style={externalStyles.chat_send_msg_emoji} >{item.message}</Text>
                            </View>
                          }
                        </View>
                    }
                  </View>
                </Pressable>
                {
                  item.read == "" ? null :
                    <Pressable onPress={() => {
                      setSelectMore(true);
                      let temp = chatUserList.map((product) => {
                        if (item.id === product.id) {
                          return { ...product, isReadMore: product.isReadMore == 0 ? 1 : 0 };
                        }
                        return product;
                      });
                      setChatUserList(temp);
                    }}>
                      {/* { 
                      item.isReadMore==0?
                      <Text style={externalStyles.chat_read_title}>Read More</Text>
                      :<Text style={externalStyles.chat_read_title}>{item.read}{"\n"}Read Less</Text>
                      } */}
                    </Pressable>
                }
              </View>
              :
              <Pressable onPress={() => {
                if (isCheckBox) {
                  let temp = chatUserList.map((product) => {
                    if (item.id === product.id) {
                      { product.isChecked == 0 ? setDeleteMessageCount(deleteMessageCount + 1) : setDeleteMessageCount(deleteMessageCount - 1); }
                      { product.isChecked == 0 ? message_ids += product.id + "," : message_ids = message_ids.replace(product.id + ",", ""); }
                      return { ...product, isChecked: product.isChecked == 0 ? 1 : 0 };
                    }
                    return product;
                  });
                  setChatUserList(temp);
                } else if (item.isImage == 1) {
                  navigation.navigate('FullScreenImg', { isImage: 1, isVideo: 0, url: item.image });
                } else if (item.isVideo == 1) {
                  navigation.navigate('FullScreenImg', { isImage: 0, isVideo: 1, url: item.video });
                }
              }}>
                {
                  item.msg_date == "" ?
                    null
                    :
                    <View style={externalStyles.chat_daytime_parent}>
                      <Text style={externalStyles.chat_day_title}>{item.msg_date}</Text>
                      <Text style={externalStyles.chat_time_title}> {item.msg_time}</Text>
                    </View>
                }
                <View style={externalStyles.clear_chat_parent}>

                  {isCheckBox ? <Image style={externalStyles.clear_checkbox} source={item.isChecked == 0 ? require('../assets/check_deactive.png') : require('../assets/check_active.png')} /> : null}

                  {
                    item.message == "" ?
                      // Second Condition
                      item.isVideo == 1 ?
                        <View style={{ marginLeft: "-1%" }}>
                          <Image style={externalStyles.chat_video_back} source={{ uri: item.video, }} />
                          <Image style={externalStyles.play_button_icon} source={require('../assets/video_play.png')} />
                        </View>
                        :
                        <View>
                          <Image style={item.isLoad ? externalStyles.chat_image_back : externalStyles.chat_image_back_hide} source={{ uri: item.image, }}
                            onLoadEnd={e => {
                              let temp = chatUserList.map((product) => {
                                if (item.id === product.id) {
                                  return { ...product, isLoad: product.isLoad = 1 };
                                }
                                return product;
                              });
                              setChatUserList(temp);

                            }} />
                          {
                            item.isLoad == 0 ? <Text style={externalStyles.chat_image_loading}>Loading...</Text> : null
                          }
                        </View>

                      // Closed Second Condition
                      :
                      !containsOnlyEmojis(item.message) ?
                        <View style={{
                          backgroundColor: "#E5E6EA",
                          padding: 14,
                          borderRadius: 5,
                          marginTop: 5,
                          marginLeft: "6%",
                          maxWidth: '71%', //new change
                          alignSelf: 'flex-start',
                          //maxWidth: 500,
                          //padding: 14,

                          //alignItems:"center",
                          borderRadius: 20,
                        }}>

                          <Text style={externalStyles.chat_receive_msg}>{item.message}</Text>
                          <View style={styles.leftArrow} />
                          <View style={styles.leftArrowOverlap} />
                        </View>
                        :
                        <View style={{
                          padding: 10,
                          borderRadius: 5,
                          marginTop: 5,
                          marginLeft: "5%",
                          maxWidth: '71%', //new change
                          alignSelf: 'flex-start',
                          //maxWidth: 500,
                          //padding: 14,

                          //alignItems:"center",
                          borderRadius: 20,
                        }}>
                          <Text style={externalStyles.chat_receive_msg_emoji}>{item.message}</Text>
                        </View>

                  }
                </View>
              </Pressable>
          } />
        {sendMessageDisabled ? <View style={{ width: "100%", backgroundColor: "white" }}>
          <Text style={[externalStyles.chat_day_title, { color: "black", fontSize: 15, paddingVertical: 5 }]}>{"Sending...."}</Text>
        </View> : null}
        <View style={externalStyles.setting_divider} />
        {
          isCheckBox ?
            <View style={externalStyles.chating_bottom_delete_parent}>
              <Text style={externalStyles.delete_message_text}>{deleteMessageCount} Message Selected</Text>
              <Pressable onPress={() => { setBottomDeleteOptionVisible(!bottomDeleteOptionVisible) }}>
                <Image style={externalStyles.delete_message_btn} source={require('../assets/delete_message.png')} />
              </Pressable>
            </View>
            :
            <View style={externalStyles.chating_bottom_parent}>
              <Pressable disabled={sendMessageDisabled}
                onPress={() => { setBottomOptionVisible(!bottomOptionVisible); }}>
                <Image style={externalStyles.chating_add_media_button} source={require('../assets/chat_add_media.png')} />
              </Pressable>
              <TextInput placeholder="Write your message"
                style={externalStyles.chating_text_area_2}
                multiline={true}
                underlineColorAndroid='transparent'
                placeholderTextColor="#999999"
                onChangeText={text => setMessageType(text)}
                value={messageType}
                editable={!sendMessageDisabled} />
              <Pressable onPress={() => {
                if (messageType.trim() !== '') {
                  setSendButtonDisable(true)//new change
                  // console.log("messageType=>"+messageType);
                  // console.log("messageType=>"+(messageType.trim() !== ''));
                  // console.log("messageType=>"+(messageType.trim() === ''));

                  submitChatMessage();
                }
              }}
                disabled={sendButtonDisable}>
                <Image style={externalStyles.chating_camera_button} source={require('../assets/send_message.png')} />
              </Pressable>
            </View>
        }
      </View>

      <View style={externalStyles.chating_menu_row_parent}>
        <Menu
          visible={visibleMenu}
          onDismiss={closeMenu}
          anchor={<Pressable onPress={openMenu}>
            <Image style={externalStyles.chating_more_button} source={require('../assets/chat_more.png')} />
          </Pressable>}>
          <Menu.Item style={externalStyles.chat_menu_text} onPress={() => {
            closeMenu();
            setIsCheckBox(false);
            callClearChatApi();
          }} title="Clear Chat History" />
          <Menu.Item style={externalStyles.chat_menu_text} onPress={() => {
            closeMenu();
            setIsCheckBox(!isCheckBox);
          }} title="Select Messages" />
        </Menu>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={bottomDeleteOptionVisible}
        onRequestClose={() => {
          setBottomDeleteOptionVisible(!bottomDeleteOptionVisible);
        }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(4,4,15,0.4)' }}>
          <View style={externalStyles.bottomMenuView}>
            <View style={externalStyles.bottomMenuParent}>
              <View style={externalStyles.bottomMenuChild}>
                <Pressable onPress={() => {
                  // setBottomDeleteOptionVisible(!bottomDeleteOptionVisible);
                  if (message_ids.trim != "") {
                    setBottomDeleteOptionVisible(!bottomDeleteOptionVisible);
                    setIsCheckBox(!isCheckBox);
                    callDeleteChatApi();
                  }
                }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={externalStyles.bottomDeleteMenuText}>Delete Messages</Text>
                  </View>
                </Pressable>
              </View>

            </View>

            <View style={externalStyles.bottomMenuParent2}>
              <Pressable onPress={() => { setBottomDeleteOptionVisible(!bottomDeleteOptionVisible); }}>
                <View style={externalStyles.bottomMenuChild}>
                  <Text style={externalStyles.bottomMenuCancelText}>Cancel</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
                  requestCameraPermission(0);
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
                  requestCameraPermission(1);
                }}>
                  <View style={{ flexDirection: "row" }}>
                    <Image style={externalStyles.bottomMenuIcon} source={require('../assets/gallery_menu.png')} />
                    <Text style={externalStyles.bottomMenuText}>Photo</Text>
                  </View>
                </Pressable>
              </View>

              <View style={externalStyles.chat_bottom_divider} />

              <View style={externalStyles.bottomMenuChild}>
                <Pressable onPress={() => {
                  setBottomOptionVisible(!bottomOptionVisible);
                  requestCameraPermission(2);
                }}>
                  <View style={{ flexDirection: "row" }}>
                    <Image style={externalStyles.bottomMenuIcon} source={require('../assets/video_menu.png')} />
                    <Text style={externalStyles.bottomMenuText}>Video</Text>
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
    </Provider>

  );
}

const styles = StyleSheet.create({
  rightArrow: {
    position: "absolute",
    backgroundColor: "#F47920",
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10
  },

  rightArrowOverlap: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20

  },

  /*Arrow head for recevied messages*/
  leftArrow: {
    position: "absolute",
    backgroundColor: "#E5E6EA",
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10
  },

  leftArrowOverlap: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -20

  },
})