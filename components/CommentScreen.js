import React, { useState } from 'react';
import { Text, View, Modal, Image, TextInput, Pressable, Alert, FlatList, BackHandler } from 'react-native';
import { externalStyles } from '../common/styles';
import { COMMENT_PIN_LIST, GET_PIN_LIST, REMOVE_COMMENT_PIN_LIST, UPDATE_COMMENT_PIN_LIST } from '../common/webUtils';
import { APP_NAME } from '../common/strings';
import { PROFILE_IMAGE_URL } from '../common/webUtils';
import { CustomProgressBar, CustomToastMessage, getDisplayTime2, RequestLogPrint } from '../common/utils';
import { USER_ID, FIRST_NAME, LAST_NAME, PROFILE_IMG, getSession, LOCAL_USER_ID } from '../common/LocalStorage';

var userId = "", user_id = "";
var localUserId = "";
var pin_id = "", profile_pic = "";
var firstName = "", lastName = "";
let flatList;

export function CommentScreen({ navigation, route }) {
  const [isLoading, setLoding] = useState(false);
  const [bottomOptionVisible, setBottomOptionVisible] = useState(false);
  const [isDisplayComment, setDisplayComment] = useState(true);

  const [comment, setComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editCommentId, setEditCommentId] = useState("");

  const [commentList, setCommentList] = useState([]);
  const [reactionList, setReactionList] = useState([]);

  const [commentCount, setCommentCount] = useState(0);
  const [reactionCount, setReactionCount] = useState(0);

  const [lastReactionCount, setLastReactionCount] = useState("1");

  const [networkErrorModal, setNetworkErrorModal] = useState(false);//new change
  const [networkMessage, setNetworkMessage] = useState("");//new change

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      console.log("route.params.event_title=>" + JSON.stringify(route.params));
      if ((route.params !== undefined)) {
        if (route.params.pin_id) {
          pin_id = route.params.pin_id;
          // callEventDetailsApi();
          getUserId(pin_id);
        }
      }
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

  const getUserId = async (pin_id) => {
    try {
      userId = await getSession(USER_ID);
      localUserId = await getSession(LOCAL_USER_ID);
      profile_pic = await getSession(PROFILE_IMG);
      firstName = await getSession(FIRST_NAME);
      lastName = await getSession(LAST_NAME);
      user_id = localUserId;

      console.log("profile_pic=>" + profile_pic);

      callGetPins(pin_id);
    } catch (e) {
      console.log("Error=>" + e);
      showToastModal(e);
    }
  };

  const callGetPins = async (pin_id) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("pin_id", pin_id);

      RequestLogPrint(GET_PIN_LIST, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setLoding(true);

      fetch(GET_PIN_LIST, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          commentList.length = 0;
          reactionList.length = 0;

          if (json.results) {
            for (let i = 0; i < json.results.comments.length; i++) {
              var created_at = "";
              if (json.results.comments[i].created_at) {
                created_at = getDisplayTime2(json.results.comments[i].created_at);
              }

              commentList.push({
                id: json.results.comments[i].id,
                pin_id: json.results.comments[i].pin_id,
                pinboard_comments: json.results.comments[i].pinboard_comments,
                user_id: json.results.comments[i].user_id,
                fname: json.results.comments[i].users.fname,
                lname: json.results.comments[i].users.lname,
                profile_pic: PROFILE_IMAGE_URL + json.results.comments[i].users.profile_pic,
                created_at: created_at,
              });
            }

            for (let i = 0; i < json.results.reactions.length; i++) {
              var created_at = "";
              if (json.results.reactions[i].created_at) {
                created_at = getDisplayTime2(json.results.reactions[i].created_at);
              }

              reactionList.push({
                id: json.results.reactions[i].id,
                reaction_type: json.results.reactions[i].reaction_type,
                user_id: json.results.reactions[i].user_id,
                fname: json.results.reactions[i].users.fname,
                lname: json.results.reactions[i].users.lname,
                profile_pic: PROFILE_IMAGE_URL + json.results.reactions[i].users.profile_pic,
                created_at: created_at,
              });

              if (i == 0) {
                setLastReactionCount(json.results.reactions[i].reaction_type);
              }
            }

            setCommentList(commentList);
            setReactionList(reactionList);

            setReactionCount(reactionList.length);
            setCommentCount(commentList.length);

            console.log("commentList=>" + commentList.length);
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

  const callSendComment = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("pin_id", pin_id);
      formdata.append("user_id", localUserId);
      formdata.append("pinboard_comments", comment.trim());

      RequestLogPrint(COMMENT_PIN_LIST, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch(COMMENT_PIN_LIST, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          if (json.results) {
            var created_at = getDisplayTime2(json.results.created_at);

            setCommentList(commentList => [...commentList, {
              id: json.results.id,
              pin_id: json.results.pin_id,
              pinboard_comments: comment,
              user_id: localUserId,
              fname: firstName,
              lname: lastName,
              profile_pic: profile_pic,
              created_at: created_at,
            }]);

            setComment("");

            setCommentCount(commentCount+1);

            // commentList.push({
            //   id:data.message_map_id,
            //   message_id:data.message_id,
            //   isSend:isSend,
            //   message:"",
            //   isChecked:0,
            //   isReadMore:0,
            //   isVideo:1,
            //   video:CHAT_FILE_URL+data.file_chat,
            //   isImage:0,
            //   image:"",
            //   msg_date:msg_date,
            //   msg_time:msg_time,
            //   read:"",
            //   clear:0,
            //   isLoad:0
            // });
          }
        })
        .catch((error) => {
          console.log("Error=>" + error);
          // Alert.alert(APP_NAME,error+"");
          // setNetworkMessage(error.message);//new change
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

  const callDeleteComment = async (comments_id) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("comments_id", comments_id);
      formdata.append("user_id", localUserId);

      RequestLogPrint(REMOVE_COMMENT_PIN_LIST, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch(REMOVE_COMMENT_PIN_LIST, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          if (json.status == 1) {
            setCommentList(commentList.filter(item => item.id !== comments_id));
          }
        })
        .catch((error) => {
          console.log("Error=>" + error);
          showToastModal(error.message);
        });
    } catch (e) {
      console.log("Exception=>" + e + "");
      showToastModal(e);
    }
  }

  const callEditComment = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("comments_id", editCommentId);
      formdata.append("pin_id", pin_id);
      formdata.append("pinboard_comments", editComment);

      RequestLogPrint(UPDATE_COMMENT_PIN_LIST, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch(UPDATE_COMMENT_PIN_LIST, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log(json);

          if (json.status == 1) {
            // setCommentList(commentList.filter(item => item.id !== comments_id));
            let temp = commentList.map((product) => {
              if (editCommentId === product.id) {
                return { ...product, pinboard_comments: editComment };
              }
              return product;
            });
            setCommentList(temp);
          }
        })
        .catch((error) => {
          console.log("Error=>" + error);
          showToastModal(error.message);
        });
    } catch (e) {
      console.log("Exception=>" + e + "");
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
      </View>

      {/* {
        isDisplayComment ?

          reactionList.length != 0 ?
            <Pressable onPress={() => {
              setDisplayComment(!isDisplayComment);
            }}>
              <View style={externalStyles.reaction_row_parent}>
                <Image style={externalStyles.comment_top_image}

                  source={lastReactionCount == "0" ? require('../assets/pin_cry_laughing.png') :
                    lastReactionCount == "1" ? require('../assets/pin_cry_laughing.png') :
                      lastReactionCount == "2" ? require('../assets/pin_heart_eyes.png') :
                        lastReactionCount == "3" ? require('../assets/pin_horror_face.png') :
                          lastReactionCount == "4" ? require('../assets/pin_smiley_face.png') :
                            lastReactionCount == "5" ? require('../assets/pin_thank_you.png') : require('../assets/pin_cry_laughing.png')} />
                <Text style={externalStyles.topCountText}>{reactionCount}</Text>
                <Image style={externalStyles.topCounterArrow} source={require('../assets/notification_list_arrow.png')} />
              </View>
            </Pressable>
            : null

          :
          commentCount.length != 0 ?
            <Pressable onPress={() => {
              setDisplayComment(!isDisplayComment);
            }}>
              <View style={externalStyles.reaction_row_parent}>
                <Image style={externalStyles.comment_top_image}
                  source={require('../assets/pin_comment.png')} />
                <Text style={externalStyles.topCountText}>{commentCount}</Text>
                <Image style={externalStyles.topCounterArrow} source={require('../assets/notification_list_arrow.png')} />
              </View>
            </Pressable>
            : null
      } */}

      <View style={externalStyles.tabParentView}>
        <Pressable onPress={() => {
          setDisplayComment(false);
        }}
          style={[externalStyles.reactionViewDesign, { backgroundColor: !isDisplayComment ? "rgba(0, 171, 233, 0.15)" : "white" }]}>
          <Text style={externalStyles.tabTitleText}>Reactions</Text>
          <Text style={externalStyles.topCountText}>{reactionCount}</Text>
        </Pressable>
        <Pressable onPress={() => {
          setDisplayComment(true);
        }}
          style={[externalStyles.reactionViewDesign, { backgroundColor: isDisplayComment ? "rgba(0, 171, 233, 0.15)" : "white" }]}>
          <Text style={externalStyles.tabTitleText}>Comments</Text>
          <Text style={externalStyles.topCountText}>{commentCount}</Text>
        </Pressable>
      </View>

      <View style={externalStyles.setting_divider} />
      {
        isDisplayComment ?
          <View style={externalStyles.notification_list_parent}>
            {commentList.length ?
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={commentList}
                ref={ref => flatList = ref}
                onContentSizeChange={() => {
                  flatList.scrollToEnd({ animated: true });
                }}
                onLayout={() => flatList.scrollToEnd({ animated: true })}
                keyExtractor={(item, id) => String(id)}
                renderItem={({ item }) =>
                  <Pressable onPress={() => console.log("Pressed")}>
                    <View style={externalStyles.column_parent}>
                      <View style={externalStyles.notification_list_raw_parent}>
                        <Image style={externalStyles.comment_user_image}
                          source={{ uri: item.profile_pic }} />
                        <View style={externalStyles.comment_parent}>
                          <Text style={externalStyles.home_list_items_text1}>{item.fname} {item.lname}</Text>
                          <Text style={externalStyles.comment_datetime_parent}>{item.created_at}</Text>
                          <Text style={externalStyles.home_list_items_text2}>{item.pinboard_comments}</Text>
                        </View>
                      </View>
                      {
                        localUserId == item.user_id ?
                          <View style={externalStyles.comment_action_parent}>
                            <Pressable onPress={() => {
                              setEditComment(item.pinboard_comments);
                              setEditCommentId(item.id);
                              setBottomOptionVisible(!bottomOptionVisible);
                            }}>
                              <Text style={externalStyles.comment_edit_action_parent}>Edit</Text>
                            </Pressable>
                            <Pressable onPress={() => {
                              Alert.alert(
                                APP_NAME,
                                "Are you sure you want to delete this comment?",
                                [
                                  {
                                    text: "No",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                  },
                                  {
                                    text: "Yes", onPress: () => {
                                      console.log("OK Pressed")
                                      callDeleteComment(item.id);
                                    }
                                  }
                                ]
                              );
                            }}>
                              <Text style={externalStyles.comment_edit_action_parent}>Delete</Text>
                            </Pressable>
                          </View>
                          : null
                      }
                    </View>
                  </Pressable>
                }
              />
              :
              <View style={externalStyles.comment_list_container}>
                <Text style={externalStyles.home_empty_text}>No any comment available!</Text>
              </View>
            }
          </View>
          :
          <View style={externalStyles.notification_list_parent}>
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={reactionList}
              ref={ref => flatList = ref}
              keyExtractor={(item, id) => String(id)}
              renderItem={({ item }) =>
                <Pressable onPress={() => console.log("Pressed")}>
                  <View style={externalStyles.column_parent}>
                    <View style={externalStyles.notification_list_raw_parent}>
                      <Image style={externalStyles.comment_user_image}
                        source={{ uri: item.profile_pic }} />
                      <View style={externalStyles.comment_parent}>
                        <Text style={externalStyles.home_list_items_text1}>{item.fname} {item.lname}</Text>
                        <Text style={externalStyles.comment_datetime_parent}>{item.created_at}</Text>
                        <Image style={externalStyles.reaction_list_image}

                          source={item.reaction_type == "0" ? require('../assets/pin_cry_laughing.png') :
                            item.reaction_type == "1" ? require('../assets/pin_cry_laughing.png') :
                              item.reaction_type == "2" ? require('../assets/pin_heart_eyes.png') :
                                item.reaction_type == "3" ? require('../assets/pin_horror_face.png') :
                                  item.reaction_type == "4" ? require('../assets/pin_smiley_face.png') :
                                    item.reaction_type == "5" ? require('../assets/pin_thank_you.png') : require('../assets/pin_cry_laughing.png')} />
                      </View>
                    </View>
                  </View>
                </Pressable>
              }
            />
          </View>
      }

      {
        isDisplayComment ?
          <View style={externalStyles.chating_bottom_parent}>
            <TextInput placeholder="Write your comment"
              style={externalStyles.chating_text_area}
              placeholderTextColor="#999999"
              onChangeText={text => setComment(text)}
              value={comment} 
              multiline={true}
              maxHeight={70}/>
            <Pressable onPress={() => {
              if (comment.trim() !== '') {
                // submitChatMessage();
                callSendComment();
              }
            }}>
              <Image style={externalStyles.chating_camera_button} source={require('../assets/send_message.png')} />
            </Pressable>
          </View>
          : null
      }

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
                }}>
                  <View style={{ flexDirection: "row" }}>
                    <TextInput placeholder="Edit your comment"
                      style={externalStyles.edit_text_area}
                      placeholderTextColor="#999999"
                      onChangeText={text => setEditComment(text)}
                      value={editComment} />
                  </View>
                </Pressable>
              </View>
            </View>

            <View style={externalStyles.bottomEditMenuParent2}>
              <Pressable onPress={() => {
                if (editComment.trim() !== '') {
                  setBottomOptionVisible(!bottomOptionVisible);
                  callEditComment();
                }
              }}>
                <Text style={externalStyles.bottomEditSaveText}>Save</Text>
              </Pressable>
              <View style={externalStyles.chat_bottom_divider} />
              <Pressable onPress={() => { setBottomOptionVisible(!bottomOptionVisible); }}>
                <Text style={externalStyles.bottomEditCancelText}>Cancel</Text>
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

  );
}