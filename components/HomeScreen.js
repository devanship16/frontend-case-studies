import React, { useEffect, useState } from 'react';
import {SafeAreaView,FlatList,ScrollView,StatusBar,StyleSheet,Text,useColorScheme,View,ImageBackground,Image,TextInput,Pressable, Alert, BackHandler} from 'react-native';
import {externalStyles} from '../common/styles';
import { LOGIN } from '../common/webUtils';
import { APP_NAME } from '../common/strings';
import { CustomProgressBar,validateEmail,getDisplayTime,RequestLogPrint, changeDateTimeFormat } from '../common/utils';
import { getSession,saveSession,USER_ID,FIRST_NAME,LAST_NAME,EMAIL,ACCESS_TOKEN,PROFILE_IMG,PHONE, NOTI_TYPE, NOTI_EVENT_ID, NOTI_USER_ID, LOGIN_TIME, NOTI_GROUP_ID, NOTI_GROUP_TYPE, NOTI_GROUP_NAME, NOTI_GROUP_PIC } from '../common/LocalStorage';
import { NOTIFICATION_LIST, NOTIFICATION_READ } from '../common/webUtils';
import LinearGradient from 'react-native-linear-gradient';

var loginTime = "";
var firstName = "", lastName="";

export function HomeScreen({navigation,route}) {
  const [isLoading, setLoding] = useState(false);

  const [notificationList, setNotificationList] = useState([]);

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
    var user_id = "";
    try {
        user_id = await getSession(USER_ID);
        loginTime = await getSession(LOGIN_TIME);
        firstName = await getSession(FIRST_NAME);
        lastName = await getSession(LAST_NAME);

        if (await getSession(NOTI_TYPE)=="event"){
          saveSession(NOTI_TYPE,"");
          var event_id = await getSession(NOTI_EVENT_ID);
          var user_id = await getSession(NOTI_USER_ID);
          navigation.navigate('EventDetails',{event_title:event_id,user_id:user_id});
        }else if(await getSession(NOTI_TYPE)=="message"){
          saveSession(NOTI_TYPE,"");
          var group_id = await getSession(NOTI_GROUP_ID);
          var group_type = await getSession(NOTI_GROUP_TYPE);
          var group_name = await getSession(NOTI_GROUP_NAME);
          var group_pic = await getSession(NOTI_GROUP_PIC);

          navigation.navigate('ChatingScreen',{group_id:group_id,group_type:group_type,name:group_name,group_pic:group_pic});
        }

        callNotificationListApi(user_id);
    } catch(e) {
        console.log("Error=>"+e);
    }
  };

  const callNotificationListApi = async (user_id) => {
    try{
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("user_id", user_id);
      
      RequestLogPrint(NOTIFICATION_LIST,formdata);

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
          

          if (json.results){
            var size = json.results.length;

            if(size>=5){
              size = 5;
            }

            for (let i = 0 ; i < size ; i++){
              var createOn = "",updated_at="";
              if (json.results[i].pivot.created_at){
                createOn = getDisplayTime(json.results[i].pivot.created_at)
              }
              if (json.results[i].pivot.updated_at){
                updated_at = getDisplayTime(json.results[i].pivot.updated_at)
              }

              // var pass_event_id = json.results[i].id;
              // console.log("json.event_titles[pass_event_id]1=>"+json.event_titles[pass_event_id]);

              // if (json.results[i].pivot.is_read == "0"){
                if (json.results[i].event_id){
                  var pass_event_id = json.results[i].id;
  
                  console.log("json.event_titles.pass_event_id=>"+json.event_titles[pass_event_id]); 
    
                  notificationList.push({
                    index:i,
                    id:json.results[i].id,
                    notification_title:json.results[i].notification_title,
                    notification_message:json.results[i].notification_message,
                    event_id:json.results[i].event_id,
                    message_id:json.results[i].message_id,
                    type:json.results[i].type,
                    created_at:createOn,
                    updated_at:updated_at,
                    deleted_at:json.results[i].deleted_at,
                    user_id:json.results[i].pivot.user_id,
                    notification_id:json.results[i].pivot.notification_id,
                    is_read:json.results[i].pivot.is_read,
                    icon:json.results[i].pivot.icon,
                    event_title:json.event_titles[pass_event_id],
                    group_id:"",
                    group_name:"",
                    group_pic:"",
                    group_type:"",
                  });
                }else{
                  var pass_event_id = json.results[i].id;
                  if (json.results[i].notification_title==""){
                    var notification_title = "New File";
                  }else{
                    var notification_title = json.results[i].notification_title;
                  }
  
                  if (json.chat[pass_event_id].group_type=="1"){
                    notificationList.push({
                      index:i,
                      id:json.results[i].id,
                      notification_title:notification_title,
                      notification_message:json.results[i].notification_message,
                      event_id:json.results[i].event_id,
                      message_id:json.results[i].message_id,
                      type:json.results[i].type,
                      created_at:createOn,
                      updated_at:updated_at,
                      deleted_at:json.results[i].deleted_at,
                      user_id:json.results[i].pivot.user_id,
                      notification_id:json.results[i].pivot.notification_id,
                      is_read:json.results[i].pivot.is_read,
                      icon:json.results[i].pivot.icon,
                      event_title:"",
                      group_id:json.chat[pass_event_id].id,
                      group_name:json.chat[pass_event_id].users.fname + " " +json.chat[pass_event_id].users.lname,
                      group_pic:json.chat[pass_event_id].group_pic,
                      group_type:json.chat[pass_event_id].group_type,
                    });
                  }else{
                    notificationList.push({
                      index:i,
                      id:json.results[i].id,
                      notification_title:notification_title,
                      notification_message:json.results[i].notification_message,
                      event_id:json.results[i].event_id,
                      message_id:json.results[i].message_id,
                      type:json.results[i].type,
                      created_at:createOn,
                      updated_at:updated_at,
                      deleted_at:json.results[i].deleted_at,
                      user_id:json.results[i].pivot.user_id,
                      notification_id:json.results[i].pivot.notification_id,
                      is_read:json.results[i].pivot.is_read,
                      icon:json.results[i].pivot.icon,
                      event_title:"",
                      group_id:json.chat[pass_event_id].id,
                      group_name:json.chat[pass_event_id].group_name,
                      group_pic:json.chat[pass_event_id].group_pic,
                      group_type:json.chat[pass_event_id].group_type,
                    });
                  }
                }
              // }
            }
            setNotificationList(notificationList);
          }else{
            // Alert.alert(APP_NAME,json.error);
          }
          setLoding(false);
        })
        .catch((error) => {
          setLoding(false);
          console.log("Error=>"+error);
          // Alert.alert(APP_NAME,error+"");
        });
    }catch(e){
      setLoding(false);
      console.log("Exception=>"+e+"");
      // Alert.alert(APP_NAME,e);
    }
  }

  const callReadNotificationApi = async (user_id,notification_id,event_title,index) => {
    try{
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("notification_id", notification_id);
      formdata.append("is_read", "1");
      formdata.append("user_id", user_id);
      
      RequestLogPrint(NOTIFICATION_READ,formdata);

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
          
          if (json.status==1){
            if (json.results){
              // var pass_event_title = event_title;
              // notificationList.length = 0;
              

              // for (let i = 0 ; i < json.results.length ; i++){
              //   var createOn = "",updated_at="";
              //   if (json.results[i].pivot.created_at){
              //     createOn = getDisplayTime(json.results[i].pivot.created_at)
              //   }
              //   if (json.results[i].pivot.updated_at){
              //     updated_at = getDisplayTime(json.results[i].pivot.updated_at)
              //   }

              //   var pass_event_id = json.results[i].id;
              //   console.log("json.event_titles[pass_event_id]2=>"+json.event_titles[pass_event_id]);

              //   if (json.results[i].pivot.is_read == "0"){
              //     notificationList.push({
              //       id:json.results[i].id,
              //       notification_title:json.results[i].notification_title,
              //       notification_message:json.results[i].notification_message,
              //       event_id:json.results[i].event_id,
              //       type:json.results[i].type,
              //       created_at:createOn,
              //       updated_at:updated_at,
              //       deleted_at:json.results[i].deleted_at,
              //       user_id:json.results[i].pivot.user_id,
              //       notification_id:json.results[i].pivot.notification_id,
              //       is_read:json.results[i].pivot.is_read,
              //       icon:json.results[i].pivot.icon,
              //       event_title:json.event_titles[pass_event_id]
              //     });
              //     if (json.results[i].event_id){
              //       var pass_event_id = json.results[i].id;
    
              //       console.log("json.event_titles.pass_event_id=>"+json.event_titles[pass_event_id]); 
      
              //       notificationList.push({
              //         index:i,
              //         id:json.results[i].id,
              //         notification_title:json.results[i].notification_title,
              //         notification_message:json.results[i].notification_message,
              //         event_id:json.results[i].event_id,
              //         message_id:json.results[i].message_id,
              //         type:json.results[i].type,
              //         created_at:createOn,
              //         updated_at:updated_at,
              //         deleted_at:json.results[i].deleted_at,
              //         user_id:json.results[i].pivot.user_id,
              //         notification_id:json.results[i].pivot.notification_id,
              //         is_read:json.results[i].pivot.is_read,
              //         icon:json.results[i].pivot.icon,
              //         event_title:json.event_titles[pass_event_id],
              //         group_id:"",
              //         group_name:"",
              //         group_pic:"",
              //         group_type:"",
              //       });
              //     }else{
              //       var pass_event_id = json.results[i].id;
    
              //       if (json.chat[pass_event_id].group_type=="1"){
              //         notificationList.push({
              //           index:i,
              //           id:json.results[i].id,
              //           notification_title:json.results[i].notification_title,
              //           notification_message:json.results[i].notification_message,
              //           event_id:json.results[i].event_id,
              //           message_id:json.results[i].message_id,
              //           type:json.results[i].type,
              //           created_at:createOn,
              //           updated_at:updated_at,
              //           deleted_at:json.results[i].deleted_at,
              //           user_id:json.results[i].pivot.user_id,
              //           notification_id:json.results[i].pivot.notification_id,
              //           is_read:json.results[i].pivot.is_read,
              //           icon:json.results[i].pivot.icon,
              //           event_title:"",
              //           group_id:json.chat[pass_event_id].id,
              //           group_name:json.chat[pass_event_id].users.fname + " " +json.chat[pass_event_id].users.lname,
              //           group_pic:json.chat[pass_event_id].group_pic,
              //           group_type:json.chat[pass_event_id].group_type,
              //         });
              //       }else{
              //         notificationList.push({
              //           index:i,
              //           id:json.results[i].id,
              //           notification_title:json.results[i].notification_title,
              //           notification_message:json.results[i].notification_message,
              //           event_id:json.results[i].event_id,
              //           message_id:json.results[i].message_id,
              //           type:json.results[i].type,
              //           created_at:createOn,
              //           updated_at:updated_at,
              //           deleted_at:json.results[i].deleted_at,
              //           user_id:json.results[i].pivot.user_id,
              //           notification_id:json.results[i].pivot.notification_id,
              //           is_read:json.results[i].pivot.is_read,
              //           icon:json.results[i].pivot.icon,
              //           event_title:"",
              //           group_id:json.chat[pass_event_id].id,
              //           group_name:json.chat[pass_event_id].group_name,
              //           group_pic:json.chat[pass_event_id].group_pic,
              //           group_type:json.chat[pass_event_id].group_type,
              //         });
              //       }
              //     }
              //   }
              // }
              setNotificationList(notificationList);
              // navigation.navigate('EventDetails',{event_title:pass_event_title,user_id:user_id});
              console.log("index=>"+index);
              if (notificationList[index].event_id){
                navigation.navigate('EventDetails',{event_title:event_title,user_id:user_id});
              }else{
                navigation.navigate('ChatingScreen',{group_id:notificationList[index].group_id,group_type:notificationList[index].group_type,name:notificationList[index].group_name,group_pic:notificationList[index].group_pic});
              }
            }            
          }else{
            // Alert.alert(APP_NAME,json.message);
          }
          setLoding(false);
        })
        .catch((error) => {
          setLoding(false);
          console.log("Error=>"+error);
          // Alert.alert(APP_NAME,error+"");
        });
    }catch(e){
      setLoding(false);
      console.log("Exception=>"+e+"");
      // Alert.alert(APP_NAME,e);
    }
  }

    return (
      <View>
        <StatusBar backgroundColor={'transparent'} translucent={true}  />
        <LinearGradient
              style={styles.linearGradient}
              colors={['rgba(255,145,66,0.05)','rgba(0,171,233,0.25)']}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 1 }}>
            <ImageBackground style={externalStyles.top_header_parent_card}>
              <View style={externalStyles.top_header_notification_1}>
                <Pressable  onPress={() => navigation.navigate('NotificationList')}>
                  <Image style={externalStyles.top_header_notification} source={require('../assets/home_notification.png')}/>
                </Pressable>
              </View>
              <View style={externalStyles.top_header_data_parent}>
                <Image style={externalStyles.top_header_data_profile_image}/>
                <View style={externalStyles.top_header_data_parent2}>
                  <Text style={externalStyles.top_header_data_user_name}>{firstName} {lastName}</Text>
                  {/* <Text style={externalStyles.top_header_data_user_joined}>Member since 14 Jun 2018</Text> */}
                  <Text style={externalStyles.top_header_data_user_joined}>Member since {changeDateTimeFormat(loginTime,"YYYY-MM-DD","DD MMM YYYY")}</Text>
                </View>
              </View>
            </ImageBackground>
          </LinearGradient>

        {
          notificationList.length==0?
          <View style={externalStyles.home_list_container}>
            <Text style={externalStyles.home_empty_text}>No any notification available!</Text>
          </View>
          :
          <View style={externalStyles.home_list_container}>
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              style={{height:485}}
              data={notificationList}
              renderItem={({item}) => 
                <Pressable onPress={()=>callReadNotificationApi(item.user_id,item.id,item.event_title,item.index)}>
                  <View style={externalStyles.column_parent}>
                    <View style={externalStyles.home_list_items}>
                      <Image style={externalStyles.home_list_items_icon} 
                          source={item.icon=="upcomming" ? require('../assets/notification_list_icon.png') : require('../assets/notification_alert.png')}/>
                      <View style={{flexDirection:"column",flex:1}}>
                        <Text style={externalStyles.home_list_items_text1}>{item.notification_title}</Text>
                        <Text  style={externalStyles.home_list_items_text2}>{item.notification_message}</Text>
                      </View>
                      <Image style={externalStyles.home_list_arrow}
                          source={require('../assets/notification_list_arrow.png')}/>
                    </View>
                    <View style={externalStyles.home_list_divider}/>
                  </View>
                </Pressable>
              }
            />
          </View>
        }
      </View>
    );
  }
  const styles = StyleSheet.create({
    linearGradient: {
      borderBottomLeftRadius:32,
      borderBottomRightRadius:32,
    },
  })