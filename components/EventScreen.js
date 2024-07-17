import React, { useEffect, useState } from 'react';
import {SafeAreaView,ScrollView,FlatList,StatusBar,StyleSheet,Text,useColorScheme,View,ImageBackground,Image,TextInput,Pressable, Alert, BackHandler, Switch} from 'react-native';
import {externalStyles} from '../common/styles';
import { LOGIN, COURSE_LIST } from '../common/webUtils';
import { APP_NAME } from '../common/strings';
import { CustomProgressBar,validateEmail } from '../common/utils';
import { saveSession,getSession,USER_ID,FIRST_NAME,LAST_NAME,EMAIL,ACCESS_TOKEN,PROFILE_IMG,PHONE } from '../common/LocalStorage';
import { Platform } from 'react-native';

var courseCode = "",courseName="";
var timetable = [];

export function EventScreen({route, navigation}) {
  const [isLoading, setLoding] = useState(false);

  console.log("CorseName=>"+route.params.courseName);
  courseCode = route.params.courseCode;
  courseName = route.params.courseName;
  timetable = route.params.timetable;
  
  console.log("CorseName=>"+timetable.length);

  const getDateFormat = (start_date,end_date) => {
    // 2021-05-15 to 14 - 15
    start_date = "2021-05-15";
    end_date = "2021-05-16";

    var date = "";
    // console.log("start_date=>"+start_date);
    if(start_date.includes("-") && end_date.includes("-")){
      // console.log("start_date=>"+start_date.split("-")[2]);
      date = start_date.split("-")[2] +" - "+end_date.split("-")[2];
    } else {
      date = "TBA"
    }

    return date;
  }

  const getMonthFormat = (start_date) => {
    // 2021-05-15 to 14 - 15
    start_date = "2021-05-15";

    var month = "";
    // console.log("start_date=>"+start_date);
    if(start_date.includes("-")){
      // console.log("start_date=>"+start_date.split("-")[1]);

      switch (start_date.split("-")[1]){
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

    return (
        <View style={externalStyles.column_parent}>
          <StatusBar backgroundColor={'transparent'} translucent={true}  />
          <View style={externalStyles.event_row_parent}>
            <Pressable onPress={() => navigation.goBack()}>
              <Image style={externalStyles.back_button2} source={require('../assets/back.png')}/>
            </Pressable>
            <Text style={externalStyles.setting_title_text}>Event List</Text>
            <Pressable  onPress={() => navigation.navigate('NotificationList')}>
              <Image style={externalStyles.top_event_notification} source={require('../assets/home_notification.png')}/>
            </Pressable>
          </View>
          <View style={externalStyles.event_screen_parent}>
            {timetable.length == 0 ?  
            <View style={externalStyles.no_data_parent}>
              <Text style={externalStyles.no_data_text}>No data available</Text>
            </View>
            : <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={timetable}
                renderItem={({item}) => 
                  <Pressable onPress={()=> navigation.navigate('EventDetails',item)}>
                    {/* <View style={externalStyles.event_list_parent}> */}
                    <View>
                        <ImageBackground style={externalStyles.event_list_parent_new} resizeMode="stretch" source={require('../assets/event_back.png')}>
                          <View style={{flexDirection:"row",}}>
                            <View style={{flexDirection:"column",width:'73%'}}>
                              <Text style={externalStyles.event_list_title}>{item.subjectNumber+": "+item.className}</Text>
                              <View style={{flexDirection:"row",alignItems:"center"}}>
                                <Image style={externalStyles.notification_location_icon} source={require('../assets/notification_location.png')}/>
                                <Text style={externalStyles.event_list_location}>{(item.location)?item.location:"NA"}</Text>
                              </View>
                              <View style={{flexDirection:"row",alignItems:"center",marginBottom:16}}>
                                <Image style={externalStyles.notification_location_icon} source={require('../assets/notification_time.png')}/>
                                <Text style={externalStyles.event_list_time}>{(item.timeStart)?item.timeStart:"NA"}</Text>
                              </View>
                            </View>
                            <View style={Platform.OS === 'ios' ? externalStyles.event_list_divider_ios : externalStyles.event_list_divider}/>
                            {
                              item.dateStart!="TBA"?
                              <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",flex:1}}>
                                <Text style={externalStyles.event_list_date}>{(item.dateStart!="TBA")?getDateFormat(item.dateStart,item.dateEnd):"TBA"}</Text>
                                <Text style={externalStyles.event_list_month}>{(item.dateStart!="TBA")?getMonthFormat(item.dateStart):"TBA"}</Text>
                              </View>
                              :
                              <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",flex:1}}>
                                <Text style={externalStyles.event_list_date}>{(item.dateStart!="TBA")?item.dateStart:"TBA"}</Text>
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
                }
              />
            }
          </View>
        </View>
    );
}