import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, FlatList, StatusBar, StyleSheet, Text, useColorScheme, View, ImageBackground, Image, TextInput, Pressable, Alert, BackHandler, Switch, Platform } from 'react-native';
import { externalStyles } from '../common/styles';
import { LOGIN, COURSE_LIST, UPDATE_EVENTS_BY_APP } from '../common/webUtils';
import { APP_NAME } from '../common/strings';
import { CustomProgressBar, CustomToastMessage, RequestLogPrint } from '../common/utils';
import { saveSession, getSession, LOCAL_USER_ID, USER_ID, FIRST_NAME, LAST_NAME, EMAIL, ACCESS_TOKEN, PROFILE_IMG, PHONE, FCM_TOKEN, LOGIN_TIME } from '../common/LocalStorage';

var identifier_pass = "";
var enrolments_pass = [];

export function CourseList({ navigation }) {
  const [isLoading, setLoding] = useState(false);

  //COURSE_LIST API data store
  const [identifier, setIdentifier] = useState("");
  const [enrolments, setEnrolments] = useState([]);

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
    var access_token = "", fcm_token = "", login_time = "", email = "";
    try {
      access_token = await getSession(ACCESS_TOKEN);
      fcm_token = await getSession(FCM_TOKEN);
      login_time = await getSession(LOGIN_TIME);
      email = await getSession(EMAIL);
      console.log("email=>" + email);
      callEventsApi(access_token, fcm_token, login_time, email);
    } catch (e) {
      console.log("Error=>" + e);
      showToastModal(e);
    }
  };

  const callEventsApi = async (access_token, fcm_token, login_time, email) => {
    try {
      console.log("callEventsApi=>" + COURSE_LIST + access_token);
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
      };

      setLoding(true);

      fetch(COURSE_LIST + access_token, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log("Result=>");
          console.log(json);
          if (json.identifier) {
            setIdentifier(json.identifier);
            identifier_pass = json.identifier;

            enrolments.length = 0;
            enrolments_pass.length = 0;

            for (let i = 0; i < json.enrolments.length; i++) {
              var timetableList = [];

              for (let j = 0; j < json.enrolments[i].timetable.length; j++) {
                enrolments.push({
                  courseCode: json.enrolments[i].courseCode,
                  courseName: json.enrolments[i].courseName,
                  eventId: json.enrolments[i].timetable[j].eventId,
                  subjectNumber: json.enrolments[i].timetable[j].subjectNumber,
                  className: json.enrolments[i].timetable[j].className,
                  timetableFormat: json.enrolments[i].timetable[j].timetableFormat,
                  dateStart: json.enrolments[i].timetable[j].dateStart,
                  dateEnd: json.enrolments[i].timetable[j].dateEnd,
                  timeStart: json.enrolments[i].timetable[j].timeStart,
                  timeEnd: json.enrolments[i].timetable[j].timeEnd,
                  location: json.enrolments[i].timetable[j].location,
                  creditApplied: json.enrolments[i].timetable[j].creditApplied,
                  attendance: json.enrolments[i].timetable[j].attendance.day1,
                });

                timetableList.push({
                  eventId: json.enrolments[i].timetable[j].eventId,
                  subjectNumber: json.enrolments[i].timetable[j].subjectNumber,
                  className: json.enrolments[i].timetable[j].className,
                  timetableFormat: json.enrolments[i].timetable[j].timetableFormat,
                  dateStart: json.enrolments[i].timetable[j].dateStart,
                  dateEnd: json.enrolments[i].timetable[j].dateEnd,
                  timeStart: json.enrolments[i].timetable[j].timeStart,
                  timeEnd: json.enrolments[i].timetable[j].timeEnd,
                  location: json.enrolments[i].timetable[j].location,
                  creditApplied: json.enrolments[i].timetable[j].creditApplied,
                  attendance: json.enrolments[i].timetable[j].attendance.day1,
                });
              }

              enrolments_pass.push({
                courseCode: json.enrolments[i].courseCode,
                courseName: json.enrolments[i].courseName,
                timetable: timetableList
              });
            }
            setEnrolments(enrolments);

            callUpdateEventsApi(access_token, fcm_token, login_time, email, json.firstName, json.lastName);
          } else {
            // Alert.alert(APP_NAME,json.error);
            // setNetworkMessage(json.error);//new change
            // setNetworkErrorModal(true)//new change
            showToastModal(json.error);
            setLoding(false);
          }
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

  const callUpdateEventsApi = async (access_token, fcm_token, login_time, email, firstName, lastName) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      // enrolments
      // identifier
      // email_id
      // first_name
      // last_name
      // login_date_time
      // access_token
      // device_token
      // device_name
      var formdata = new FormData();
      formdata.append("enrolments", JSON.stringify(enrolments_pass));
      formdata.append("identifier", identifier_pass);
      formdata.append("email_id", email);
      formdata.append("first_name", firstName);
      formdata.append("last_name", lastName);
      formdata.append("login_date_time", login_time);
      formdata.append("access_token", access_token);
      formdata.append("device_token", fcm_token);
      formdata.append("device_name", Platform.OS);

      RequestLogPrint(UPDATE_EVENTS_BY_APP, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch(UPDATE_EVENTS_BY_APP, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log("Result=>");
          console.log(json);

          saveSession(LOCAL_USER_ID, json.results.id + "");
          setLoding(false);
        })
        .catch((error) => {
          setLoding(false);
          console.log("Error=>" + error);
          showToastModal(error.message);
        });
    } catch (e) {
      setLoding(false);
      console.log("Exception=>" + e + "");
      showToastModal(e);
    }
  }

  const getDateFormat = (start_date, end_date) => {
    // 2021-05-15 to 14 - 15
    // start_date = "2021-05-15";
    // end_date = "2021-05-16";

    var date = "";
    // console.log("start_date=>"+start_date);
    if (start_date.includes("-") && end_date.includes("-")) {
      // console.log("start_date=>"+start_date.split("-")[2]);
      date = start_date.split("-")[2] + " - " + end_date.split("-")[2];
    } else {
      date = "TBA"
    }

    return date;
  }

  const getMonthFormat = (start_date) => {
    // 2021-05-15 to 14 - 15
    // start_date = "2021-05-15";

    var month = "";
    // console.log("start_date=>"+start_date);
    if (start_date.includes("-")) {
      // console.log("start_date=>"+start_date.split("-")[1]);

      switch (start_date.split("-")[1]) {
        case '01':
          month = "Jan";
          break;

        case '02':
          month = "Feb";
          break;

        case '03':
          month = "Mar";
          break;

        case '04':
          month = "Apr";
          break;

        case '05':
          month = "May";
          break;

        case '06':
          month = "Jun";
          break;

        case '07':
          month = "Jul";
          break;

        case '08':
          month = "Aug";
          break;

        case '09':
          month = "Sep";
          break;

        case '10':
          month = "Oct";
          break;

        case '11':
          month = "Nov";
          break;

        case '12':
          month = "Dec";
          break;
      }
    } else {
      month = "TBA"
    }

    return month;
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

      <StatusBar backgroundColor={'transparent'} translucent={true} />
      <View style={externalStyles.event_row_parent}>
        {/* <Pressable onPress={() => navigation.goBack()}>
              <Image style={externalStyles.back_button2} source={require('../assets/back.png')}/>
            </Pressable> */}
        <Text style={[externalStyles.setting_title_text, { marginLeft: 32 }]}>Event List</Text>
        <Pressable onPress={() => navigation.navigate('NotificationList')}>
          <Image style={externalStyles.top_event_notification} source={require('../assets/home_notification.png')} />
        </Pressable>
      </View>
      <View style={externalStyles.event_screen_parent}>
        {enrolments.length == 0 ?
          <View style={externalStyles.no_data_parent}>
            <Text style={externalStyles.no_data_text}>No events available</Text>
          </View>
          :
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={enrolments}
            renderItem={({ item }) =>
              <Pressable onPress={() => navigation.navigate('EventDetails', item)}>
                {/* <View style={externalStyles.event_list_parent}> */}
                <View>
                  <ImageBackground style={externalStyles.event_list_parent_new} resizeMode="stretch" source={require('../assets/event_back.png')}>
                    <View style={{ flexDirection: "row", }}>
                      <View style={{ flexDirection: "column", width: '73%' }}>
                        <Text style={externalStyles.event_list_title}>{item.subjectNumber + ": " + item.className}</Text>
                        <Text style={externalStyles.event_list_sub_title}>{"Course : " + item.courseName}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Image style={externalStyles.notification_location_icon} source={require('../assets/notification_location.png')} />
                          <Text style={externalStyles.event_list_location}>{(item.location) ? item.location : "NA"}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                          <Image style={externalStyles.notification_location_icon} source={require('../assets/notification_time.png')} />
                          <Text style={externalStyles.event_list_time}>{(item.timeStart) ? item.timeStart : "NA"}</Text>
                        </View>
                      </View>
                      <View style={Platform.OS === 'ios' ? externalStyles.event_list_divider_ios : externalStyles.event_list_divider} />
                      {
                        item.dateStart != "TBA" ?
                          <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
                            <Text style={externalStyles.event_list_date}>{(item.dateStart != "TBA") ? getDateFormat(item.dateStart, item.dateEnd) : "TBA"}</Text>
                            <Text style={externalStyles.event_list_month}>{(item.dateStart != "TBA") ? getMonthFormat(item.dateStart) : "TBA"}</Text>
                          </View>
                          :
                          <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
                            <Text style={externalStyles.event_list_date}>{(item.dateStart != "TBA") ? item.dateStart : "TBA"}</Text>
                          </View>
                      }
                      {/* <View style={externalStyles.event_list_alert_parent}>
                              <Image style={externalStyles.event_list_alert}
                                  source={require('../assets/event_alert.png')}/>
                            </View> */}
                    </View>
                  </ImageBackground>
                </View>
              </Pressable>

              // <Pressable onPress={()=> navigation.navigate('EventScreen', item)}>
              //   <View style={externalStyles.course_list_parent}> 
              //       <Text style={externalStyles.course_list_title}>{item.courseName}</Text>
              //   </View>
              // </Pressable>

            }
          />
        }
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