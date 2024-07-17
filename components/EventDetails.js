import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, FlatList, StatusBar, StyleSheet, Text, useColorScheme, View, ImageBackground, Image, TextInput, Pressable, Alert, BackHandler, Switch } from 'react-native';
import { externalStyles } from '../common/styles';
import { EDIT_RSVP, EVENT_DETAILS } from '../common/webUtils';
import { APP_NAME } from '../common/strings';
import { CustomProgressBar, validateEmail, RequestLogPrint, changeDateTimeFormat, CustomToastMessage } from '../common/utils';
import { getSession, saveSession, USER_ID, LOCAL_USER_ID, FIRST_NAME, LAST_NAME, EMAIL, ACCESS_TOKEN, PROFILE_IMG, PHONE } from '../common/LocalStorage';

// var subjectNumber = "", className="", dateStart="", dateEnd="", timeStart="", timeEnd="", location="";
var userId = "";
var localUserId = "";
var event_title = "", user_id = "", eventId = "";

export function EventDetails({ navigation, route }) {
  const [isLoading, setLoding] = useState(false);

  const [isOptionYes, setOptionYes] = useState(false);
  const [isOptionNo, setOptionNo] = useState(false);

  const [subjectNumber, setSubjectNumber] = useState("");
  // const [eventId, setEventId] = useState("");
  const [className, setClassName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [location, setLocation] = useState("");

  const [note, setNote] = useState("");

  // if (route.params.event_title){
  //   event_title = route.params.event_title;
  //   user_id = route.params.user_id;
  // }else{
  //   subjectNumber = route.params.subjectNumber;
  //   className = route.params.className;
  //   dateStart = route.params.dateStart;
  //   dateEnd = route.params.dateEnd;
  //   timeStart = route.params.timeStart;
  //   timeEnd = route.params.timeEnd;
  //   location = route.params.location; 
  // }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      console.log("route.params.event_title=>" + route.params.event_title);
      console.log("route.params.event_title=>" + JSON.stringify(route.params));
      if ((route.params !== undefined)) {
        if (route.params.event_title) {
          event_title = route.params.event_title;
          user_id = route.params.user_id;
          eventId = route.params.eventId;
          // callEventDetailsApi();
        } else {
          // subjectNumber = route.params.subjectNumber;
          // className = route.params.className;
          // dateStart = route.params.dateStart;
          // dateEnd = route.params.dateEnd;
          // timeStart = route.params.timeStart;
          // timeEnd = route.params.timeEnd;
          // location = route.params.location; 

          event_title = route.params.className;
          eventId = route.params.eventId;

          // setSubjectNumber(route.params.subjectNumber);
          // setClassName(route.params.className);
          // setDateStart(route.params.dateStart);
          // setDateEnd(route.params.dateEnd);
          // setTimeStart(route.params.timeStart);
          // setTimeEnd(route.params.timeEnd);
          // setLocation(route.params.location); 
        }
      }
      getUserId();
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

  const getUserId = async () => {
    try {
      userId = await getSession(USER_ID);
      localUserId = await getSession(LOCAL_USER_ID);
      user_id = localUserId;

      callEventDetailsApi();
    } catch (e) {
      console.log("Error=>" + e);
      showToastModal(e);
    }
  };

  const getDateFormat = (start_date, end_date) => {
    // 2021-05-15 to 14 - 15
    // start_date = "2021-05-15";
    // end_date = "2021-05-16";

    var date = "";
    var month = "";

    // console.log("start_date=>"+start_date);
    if (start_date.includes("-") && end_date != null && end_date.includes("-")) {
      date = start_date.split("-")[2] + " - " + end_date.split("-")[2];
    } else {
      date = start_date.split("-")[2];
    }

    if (start_date.includes("-")) {
      // console.log("start_date=>"+start_date.split("-")[2]);

      switch (start_date.split("-")[1]) {
        case '01':
          month = "January";
          break;

        case '02':
          month = "February";
          break;

        case '03':
          month = "March";
          break;

        case '04':
          month = "April";
          break;

        case '05':
          month = "May";
          break;

        case '06':
          month = "June";
          break;

        case '07':
          month = "July";
          break;

        case '08':
          month = "Auguest";
          break;

        case '09':
          month = "September";
          break;

        case '10':
          month = "October";
          break;

        case '11':
          month = "November";
          break;

        case '12':
          month = "December";
          break;
      }

      return date + " " + month;
    } else {
      date = "TBA"
    }

    return date;
  }

  const getTimeFormat = (start_time, end_time) => {
    // 2021-05-15 to 14 - 15
    start_time = changeDateTimeFormat(start_time, "HH:mm:ss", "hh:mm a");

    if (end_time != null) {
      end_time = changeDateTimeFormat(end_time, "HH:mm:ss", "hh:mm a");

      return start_time + " - " + end_time;
    } else {
      return start_time;
    }
  }

  const callEditRSVP = async (rsvp) => {
    try {
      if (rsvp == "No" && note.length == 0) {
        Alert.alert(APP_NAME, "Please enter note");
        return;
      }

      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("rsvp", rsvp);
      formdata.append("note", note);
      formdata.append("className", eventId);
      formdata.append("user_id", userId);

      RequestLogPrint(EDIT_RSVP, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setLoding(true);

      fetch(EDIT_RSVP, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log("Result=>");
          console.log(json);
          setLoding(false);
          if (json.message) {
            // Alert.alert(APP_NAME, json.message);
            // setNetworkMessage(json.message);//new change
            // setNetworkErrorModal(true)//new change
            showToastModal(json.message);
          } else {
            // Alert.alert(APP_NAME, json.error);
            // setNetworkMessage(json.error);//new change
            // setNetworkErrorModal(true)//new change
            showToastModal(json.error);
          }
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

  const callEventDetailsApi = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", "neXCUkYvPzSSjUyUqlp");

      var formdata = new FormData();
      formdata.append("event_title", eventId);
      formdata.append("user_id", user_id);

      RequestLogPrint(EVENT_DETAILS, formdata);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      setLoding(true);

      fetch(EVENT_DETAILS, requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log("Result=>");
          console.log(json);
          if (json.results) {
            if (json.results.length > 0) {
              if (json.results[0].events) {
                setNote(json.results[0].note);
                if (json.results[0].rsvp == "Yes") {
                  setOptionNo(false);
                  setOptionYes(true);
                } else if (json.results[0].rsvp == "No") {
                  setOptionNo(true);
                  setOptionYes(false);
                } else {
                  setOptionNo(false);
                  setOptionYes(false);
                }
                setSubjectNumber(json.results[0].events.sno);
                // setEventId(json.results[0].events.eventId);
                eventId = json.results[0].events.unique_id;
                setClassName(json.results[0].events.event_title);
                setCourseName(json.results[0].events.course_name);
                setDateStart(json.results[0].events.date_start_at);
                setDateEnd(json.results[0].events.date_end_at);
                setTimeStart(json.results[0].events.time_start_at);
                setTimeEnd(json.results[0].events.time_end_at);
                setLocation(json.results[0].events.event_location);
              }
            }
          } else {
            // Alert.alert(APP_NAME,json.error);
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
      showToastModal(e);
      // Alert.alert(APP_NAME,e);
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

      <StatusBar backgroundColor={'transparent'} translucent={true} />
      {/* <View style={externalStyles.event_details_titlebar}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Image style={externalStyles.event_back_button} source={require('../assets/back.png')}/>
                </Pressable>
                <Pressable  onPress={() => navigation.navigate('NotificationList')}>
                    <Image style={externalStyles.top_header_notification} source={require('../assets/home_notification.png')}/>
                </Pressable>
            </View>
            <View style={externalStyles.event_details_titlebar}>
                <Text style={externalStyles.event_details_title_text}>Notifications</Text>
            </View> */}
      <View style={{ flexDirection: "row" }}>
        <View style={externalStyles.event_details_titlebar}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image style={externalStyles.event_back_button} source={require('../assets/back.png')} />
          </Pressable>
        </View>
        <View style={externalStyles.event_details_titlebar2}>
          <Pressable onPress={() => navigation.navigate('NotificationList')}>
            <Image style={externalStyles.event_details_header_notification} source={require('../assets/home_notification.png')} />
          </Pressable>
        </View>
      </View>
      <View style={externalStyles.event_details_titlebar3}>
        <Text style={externalStyles.event_details_title_text}>{subjectNumber}: {className}</Text>
        <Text style={externalStyles.event_details_subtitle_text}>{courseName}</Text>
      </View>
      <ScrollView keyboardShouldPersistTaps={'handled'} style={{ backgroundColor: "white" }}>
        <View style={externalStyles.event_details_session_details_parent}>
          <Text style={externalStyles.event_details_session_details}>Session Details</Text>
          <View style={externalStyles.event_details_session_details_child}>
            <Image style={externalStyles.event_details_session_img} source={require('../assets/event_details_date.png')} />
            <Text style={externalStyles.event_details_session_details_data}>{(dateStart != "TBA" && dateStart != null) ? getDateFormat(dateStart, dateEnd) : "TBA"}</Text>
          </View>
          <View style={externalStyles.event_details_divider} />
          <View style={externalStyles.event_details_session_details_child}>
            <Image style={externalStyles.event_details_session_img} source={require('../assets/event_details_time.png')} />
            <Text style={externalStyles.event_details_session_details_data}>{(timeStart) ? getTimeFormat(timeStart, timeEnd) : "NA"}</Text>
          </View>
          <View style={externalStyles.event_details_divider} />
          <View style={externalStyles.event_details_session_details_child}>
            <Image style={externalStyles.event_details_session_img} source={require('../assets/event_details_location.png')} />
            <Text style={externalStyles.event_details_session_details_data}>{location}</Text>
          </View>
        </View>

        <View style={externalStyles.event_details_options_parent}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={externalStyles.event_details_session_option_title}>Are coming for the class.</Text>
            <Pressable onPress={() => {
              setOptionNo(true);
              setOptionYes(false);
            }}>
              <Text style={isOptionNo ? externalStyles.event_details_session_option_N : externalStyles.event_details_session_option1}>NO</Text>
            </Pressable>
            <Pressable onPress={() => {
              setOptionYes(true);
              setOptionNo(false);

              callEditRSVP("Yes");
            }}>
              <Text style={isOptionYes ? externalStyles.event_details_session_option_Y : externalStyles.event_details_session_option1}>YES</Text>
            </Pressable>
          </View>
          {
            isOptionNo
              ?
              <View>
                <TextInput style={externalStyles.event_details_note} multiline={true}
                  placeholder={"Add Note"} placeholderTextColor="#999999" onChangeText={text => setNote(text)}
                  value={note} />
                <Pressable onPress={() => {
                  callEditRSVP("No");
                }}>
                  <Text style={externalStyles.event_details_note_submit}>SUBMIT</Text>
                </Pressable>
              </View>
              : null
          }
        </View>
      </ScrollView>
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