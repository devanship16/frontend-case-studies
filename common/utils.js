import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet ,Dimensions} from 'react-native';
import { Modal, ScrollView, StatusBar, Text, ActivityIndicator, View, Image, TextInput, Pressable, Alert } from 'react-native';
import { externalStyles } from './styles';
import moment from './moment';

export const CustomProgressBar = ({ visible }) => (
  null
  // <Modal onRequestClose={() => null} visible={visible}>
  //   <View style={{ flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' }}>
  //     <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
  //       <Text style={externalStyles.loadingText}>Loading</Text>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   </View>
  // </Modal>
);

export const CustomLoginProgressBar = ({ visible }) => (
  <Modal onRequestClose={() => null} visible={visible}>
    <View style={{ flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
        <Text style={externalStyles.loadingText}>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    </View>
  </Modal>
);

//new changes
export const CustomToastMessage = (visible, text) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={() => null}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={externalStyles.bottomMenuView}>
        <View style={externalStyles.toastParent}>
          <View style={externalStyles.toastParent2}>
            <Text style={externalStyles.toastTextMessage}>{text}</Text>
          </View>
        </View>
      </View>
    </View>
  </Modal>
);
export const validateEmail = (text) => {
  console.log(text);
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(text) === false) {
    return false;
    console.log("Email is Incorrect");
  }
  else {
    console.log("Email is Correct");
    return true;
  }
}

export const RequestLogPrint = (url, formdata) => {
  console.log(url);
  console.log("REQUEST=>");
  for (const part of formdata.getParts()) {
    console.log(part.fieldName + ":" + part.string);
  }
  console.log("RESPONSE=>");
}

export const getBoldFont = () => {
  if (Platform.OS === 'ios') {
    return "..assets/fonts/roboto_slab_bold.ttf"
  } else {
    return "roboto_slab_bold"
    // return "open_sans_bold"
  }
}

export const getRegularFont = () => {
  if (Platform.OS === 'ios') {
    return "..assets/fonts/roboto_slab_regular.ttf"
  } else {
    return "roboto_slab_regular"
    // return "open_sans_regular"
  }
}

export const getLightFont = () => {
  if (Platform.OS === 'ios') {
    return "..assets/fonts/roboto_slab_light.ttf"
  } else {
    return "roboto_slab_light"
    // return "open_sans_regular"
  }
}

export const getSemiBoldFont = () => {
  if (Platform.OS === 'ios') {
    return "..assets/fonts/roboto_slab_semibold.ttf"
  } else {
    return "roboto_slab_semibold"
    // return "open_sans_regular"
  }
}

export const getYYYYMMDD = () => {
  // required (YYYY-MM-DD)
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();

  //Alert.alert(date + '-' + month + '-' + year);
  // You can turn it in to your desired format
  return year + '-' + month + '-' + date;//format: yyyy-mm-dd;
}

export const getDisplayTime = (createdDate) => {
  // 2021-11-03T11:00:02.000000Z
  // var currentDateTime = year+"-"+month+"-"+date;
  var splitDate = createdDate.split(".")[0];

  splitDate = splitDate.split("T").join(" ");

  splitDate = convertUTCToLocal(splitDate, "YYYY-MM-DD HH:mm:ss");

  splitDate = splitDate.split(":").join("").split("-").join("").split("T").join("");
  // console.log("splitDate=>"+splitDate);
  // console.log("moment=>"+moment("20111031", "YYYYMMDD").fromNow());
  // console.log("moment123=>"+moment(splitDate, "YYYYMMDDHHmmss").fromNow());

  return moment(splitDate, "YYYYMMDDHHmmss").fromNow();
}

export const getDisplayTime2 = (createdDate) => {
  // 2021-11-03T11:00:02.000000Z
  // var currentDateTime = year+"-"+month+"-"+date;
  var splitDate = createdDate.split(".")[0];
  // splitDate = splitDate.split(":").join("").split("-").join("").split("T").join("");
  splitDate = splitDate.split("T").join(" ");

  console.log("convertUTCToLocal=>" + splitDate);

  splitDate = convertUTCToLocal(splitDate, "YYYY-MM-DD HH:mm:ss");

  console.log("convertUTCToLocal123=>" + splitDate);
  // console.log("splitDate=>"+splitDate);
  // console.log("moment=>"+moment("20111031", "YYYYMMDD").fromNow());
  // console.log("moment123=>"+moment(splitDate, "YYYYMMDDHHmmss").fromNow());

  return moment(splitDate, "YYYY-MM-DD HH:mm:ss").fromNow();
}

export const changeDateTimeFormat = (datetime, inputFormat, outputFormat) => {
  // console.log("changeDateTimeFormat=>"+datetime+"=>"+inputFormat+"=>"+outputFormat);
  var date = moment(datetime, inputFormat);
  return date.format(outputFormat);
}

export const itsToday = (datetime) => {
  return datetime == getYYYYMMDD();
}

export const convertUTCToLocal = (datetime, format) => {
  return moment.utc(datetime).local().format(format);
}

export const getCurrentTime = () => {
  const currTime = new Date().toLocaleTimeString();
  console.log("getCurrentDateTime=" + currTime);

  return changeDateTimeFormat(currTime, "HH:mm:ss", "HH:mm");
}

export const getHeight = () => {
  return Dimensions.get("window").height;
}

export const getWidth = () => {
  return Dimensions.get("window").width;
}