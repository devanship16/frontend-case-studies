/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, ImageBackground, Image, Alert } from 'react-native';

import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { externalStyles } from './common/styles';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import OTP from './components/OTP';
import ResetPassword from './components/ResetPassword';
import SuccessResetPassword from './components/SuccessResetPassword';
import LinearGradient from 'react-native-linear-gradient';
import { saveSession, getSession, USER_ID, FCM_TOKEN, NOTI_USER_ID, NOTI_EVENT_ID, NOTI_TYPE, NOTI_GROUP_ID, NOTI_GROUP_TYPE, NOTI_GROUP_NAME, NOTI_GROUP_PIC } from './common/LocalStorage';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getBoldFont, getLightFont, getRegularFont, getWidth } from './common/utils';

import { HomeScreen } from './components/HomeScreen'
import { NotificationList } from './components/NotificationList'

import { Resources } from './components/Resources'

import { EventScreen } from './components/EventScreen'
import { CourseList } from './components/CourseList'
import { EventDetails } from './components/EventDetails'

import { ChatScreen } from './components/ChatScreen'
import { GroupDetails } from './components/GroupDetails'
import { FullScreenImg } from './components/FullScreenImg'
import { ChatingScreen } from './components/ChatingScreen'

import { SettingsScreen } from './components/SettingsScreen'
import { AppSettings } from './components/AppSettings'
import { ProfileScreen } from './components/ProfileScreen'
import { ChangePassword } from './components/ChangePassword'
import { HelpScreen } from './components/HelpScreen'
import { PrivacyScreen } from './components/PrivacyScreen'
import { TermsScreen } from './components/TermsScreen'
import { IMAGE_THUMB_URL, PROFILE_IMAGE_URL } from './common/webUtils';

import { PinBoard } from './components/PinBoard';
import { CommentScreen } from './components/CommentScreen'

var type = "", id = "", user_id = "";
var group_type = "", group_name = "", group_pic = "";
export var currentRouteName = "";

function Splash({ navigation }) {
  var isCall = true;

  // Register the device with FCM

  useEffect(() => {
    console.log("Call firebase");
    checkToken();

    messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      console.log("remoteMessage789=>" + JSON.stringify(remoteMessage));

      // type = remoteMessage.data.type;
      // id = remoteMessage.data.event_title;
      // user_id = remoteMessage.data.user_id;
      if (remoteMessage.data.type == "message") {
        type = remoteMessage.data.type;
        id = remoteMessage.data.id;
        user_id = remoteMessage.data.user_id;

        group_type = remoteMessage.data.group_type;
        // group_pic = IMAGE_THUMB_URL + remoteMessage.data.group_pic;
        if (group_type == "1") {
          group_pic = PROFILE_IMAGE_URL + remoteMessage.data.profile_pic;
          group_name = remoteMessage.data.profile_name;
        } else {
          group_pic = IMAGE_THUMB_URL + remoteMessage.data.group_pic;
          group_name = remoteMessage.data.event_title;
        }
        console.log(group_pic)
        if (currentRouteName) {
          console.log('current screen', currentRouteName);
          if (currentRouteName == "Chats") {
            // navigation.goBack();
            // navigation.push('Chats');
          }
        }
      } else {
        type = remoteMessage.data.type;
        id = remoteMessage.data.event_title;
        user_id = remoteMessage.data.user_id;
      }

      PushNotification.configure({
        largeIcon: "new_message",
        smallIcon: "new_message",
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
          // console.log('TOKEN:', token);
        },
        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);
          if (type == "event") {
            navigation.navigate('EventDetails', { event_title: id, user_id: user_id });
          } else if (type == "message") {
            // navigation.navigate('ChatingScreen', { group_id: remoteMessage.data.id, group_type: group_type, name: remoteMessage.data.event_title, group_pic: group_pic });
            navigation.navigate('ChatingScreen', { group_id: remoteMessage.data.id, group_type: group_type, name: group_name, group_pic: group_pic });

            // navigation.navigate('Chats');
          }
          // notification.finish(PushNotificationIOS.FetchResult.NoData);
        },
        popInitialNotification: true,
        requestPermissions: true,
        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: false,
          sound: false,
        },
      });

      PushNotification.createChannel(
        {
          channelId: 'reminders', // (required)
          channelName: 'Task reminder notifications', // (required)
          channelDescription: 'Reminder for any tasks',
        },
        () => { },
      );

      PushNotification.getScheduledLocalNotifications(rn => {
        // console.log('SN --- ', rn);
      });

      PushNotification.localNotification({
        // channelId: "channel-id", // (required)
        // channelName: "My channel", // (required)
        message: remoteMessage.data.body,
        title: remoteMessage.data.title,
        actions: type,
        id: id,
        user_id: user_id
      });
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);

      // type = remoteMessage.data.type;
      // id = remoteMessage.data.event_title;
      // user_id = remoteMessage.data.user_id;
      if (remoteMessage.data.type == "message") {
        type = remoteMessage.data.type;
        id = remoteMessage.data.id;
        user_id = remoteMessage.data.user_id;

        group_type = remoteMessage.data.group_type;
        // group_name = remoteMessage.data.event_title;
        // group_pic = IMAGE_THUMB_URL + remoteMessage.data.group_pic;
        if (group_type == "1") {
          group_pic = PROFILE_IMAGE_URL + remoteMessage.data.profile_pic;
          group_name = remoteMessage.data.profile_name;
        } else {
          group_pic = IMAGE_THUMB_URL + remoteMessage.data.group_pic;
          group_name = remoteMessage.data.event_title;
        }
      } else {
        type = remoteMessage.data.type;
        id = remoteMessage.data.event_title;
        user_id = remoteMessage.data.user_id;
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage.notification,);

      // type = remoteMessage.data.type;
      // id = remoteMessage.data.event_title;
      // user_id = remoteMessage.data.user_id;
      if (remoteMessage.data.type == "message") {
        type = remoteMessage.data.type;
        id = remoteMessage.data.id;
        user_id = remoteMessage.data.user_id;

        group_type = remoteMessage.data.group_type;
        // group_name = remoteMessage.data.event_title;
        // group_pic = IMAGE_THUMB_URL + remoteMessage.data.group_pic;
        if (group_type == "1") {
          group_pic = PROFILE_IMAGE_URL + remoteMessage.data.profile_pic;
          group_name = remoteMessage.data.profile_name;
        } else {
          group_pic = IMAGE_THUMB_URL + remoteMessage.data.group_pic;
          group_name = remoteMessage.data.event_title;
        }
      } else {
        type = remoteMessage.data.type;
        id = remoteMessage.data.event_title;
        user_id = remoteMessage.data.user_id;
      }
      //new change
      if (type == "event") {
        navigation.navigate('EventDetails', { event_title: id, user_id: user_id });
      } else if (type == "message") {
        // navigation.navigate('ChatingScreen', { group_id: remoteMessage.data.id, group_type: group_type, name: remoteMessage.data.event_title, group_pic: group_pic });
        navigation.navigate('ChatingScreen', { group_id: remoteMessage.data.id, group_type: group_type, name: group_name, group_pic: group_pic });

        // navigation.navigate('Chats');
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);

          if (remoteMessage.data.type == "message") {
            type = remoteMessage.data.type;
            id = remoteMessage.data.id;
            user_id = remoteMessage.data.user_id;

            group_type = remoteMessage.data.group_type;
            // group_pic = IMAGE_THUMB_URL + remoteMessage.data.group_pic;
            if (group_type == "1") {
              group_pic = PROFILE_IMAGE_URL + remoteMessage.data.profile_pic;
              group_name = remoteMessage.data.profile_name;
            } else {
              group_pic = IMAGE_THUMB_URL + remoteMessage.data.group_pic;
              group_name = remoteMessage.data.event_title;
            }
            //profile_name
            console.log("fcmToken=>" + type);
            console.log("fcmToken=>" + id);
            console.log("fcmToken=>" + user_id);

            saveSession(NOTI_TYPE, type);
            saveSession(NOTI_GROUP_ID, id);
            saveSession(NOTI_USER_ID, user_id);

            saveSession(NOTI_GROUP_TYPE, remoteMessage.data.group_type);
            // saveSession(NOTI_GROUP_PIC, IMAGE_THUMB_URL + remoteMessage.data.group_pic);
            if (remoteMessage.data.group_type == "1") {
              saveSession(NOTI_GROUP_PIC, PROFILE_IMAGE_URL + remoteMessage.data.profile_pic);
              saveSession(NOTI_GROUP_NAME, remoteMessage.data.profile_name);
            } else {
              saveSession(NOTI_GROUP_PIC, IMAGE_THUMB_URL + remoteMessage.data.group_pic);
              saveSession(NOTI_GROUP_NAME, remoteMessage.data.event_title);
            }
          } else {
            type = remoteMessage.data.type;
            id = remoteMessage.data.event_title;
            user_id = remoteMessage.data.user_id;

            console.log("fcmToken=>" + type);
            console.log("fcmToken=>" + id);
            console.log("fcmToken=>" + user_id);

            saveSession(NOTI_TYPE, type);
            saveSession(NOTI_EVENT_ID, id);
            saveSession(NOTI_USER_ID, user_id);
          }
        }
      });

  }, []);


  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("fcmToken=>" + fcmToken);

      console.log("fcmToken=>" + type);
      console.log("fcmToken=>" + id);
      console.log("fcmToken=>" + user_id);

      saveSession(FCM_TOKEN, fcmToken);

      if (type == "message") {
        saveSession(NOTI_TYPE, type);
        saveSession(NOTI_GROUP_ID, id);
        saveSession(NOTI_USER_ID, user_id);

        saveSession(NOTI_GROUP_TYPE, remoteMessage.data.group_type);
        // saveSession(NOTI_GROUP_PIC, IMAGE_THUMB_URL + remoteMessage.data.group_pic);
        if (remoteMessage.data.group_type == "1") {
          saveSession(NOTI_GROUP_PIC, PROFILE_IMAGE_URL + remoteMessage.data.profile_pic);
          saveSession(NOTI_GROUP_NAME, remoteMessage.data.profile_name);
        } else {
          saveSession(NOTI_GROUP_PIC, IMAGE_THUMB_URL + remoteMessage.data.group_pic);
          saveSession(NOTI_GROUP_NAME, remoteMessage.data.event_title);
        }
      } else {
        saveSession(NOTI_TYPE, type);
        saveSession(NOTI_EVENT_ID, id);
        saveSession(NOTI_USER_ID, user_id);
      }
      //  saveSession(NOTI_TYPE,type);
      //  saveSession(NOTI_EVENT_ID,id);
      //  saveSession(NOTI_USER_ID,user_id);

      //  type = "";
      //  id = "";
      //  user_id = "";

      //  Alert.alert('FCM Token', fcmToken);
    } else {
      checkToken();
    }
  }

  setTimeout(() => {
    {
      async function checkData() {
        const userId = await getSession(USER_ID);
        console.log("SplashScreen2=>" + (userId === null));
        console.log("SplashScreen2=>" + (userId));
        console.log("SplashScreen2=>" + (isCall));
        if (isCall) {
          if (userId === null) {
            navigation.navigate('Login')
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
            isCall = false;
          } else {
            navigation.navigate('Dashboard')
            navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            });
            isCall = false;
          }
        }
      }
      checkData();
    }
  }, 3000);

  return (
    <View style={externalStyles.splash_background}>
      {/* <NotificationController /> */}
      <StatusBar backgroundColor={'transparent'} translucent={true} />
      {/* <LinearGradient style={{flex: 1,flexDirection: "column",}}
          colors={['rgba(35,31,32,1)','rgba(36,87,105,1)']}> */}
      {/* <View style={{ flex:1}}> */}
      <ImageBackground source={require('./assets/splash_background.png')} resizeMode="stretch" style={externalStyles.splash_screen} />
      {/* <Image source={require('./assets/splash_header.png')} style={externalStyles.splash_middle_logo}/>
              <Image source={require('./assets/splash_bottom.png')} resizeMode="contain" style={externalStyles.splash_bottom_logo}/> */}
      {/* </View> */}
      {/* </LinearGradient>           */}
    </View>
  );
};

const Stack = createNativeStackNavigator();

function App() {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  return (
    <NavigationContainer independent={true}
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
      }
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          // The line below uses the expo-firebase-analytics tracker
          // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
          // Change this line to use another Mobile analytics SDK
          // Analytics.setCurrentScreen(currentRouteName, currentRouteName);
          // alert(`The route changed to ${currentRouteName}`);
        }

        // Save the current route name for later comparision
        routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen name="OTP" component={OTP} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="SuccessResetPassword" component={SuccessResetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardTabs} options={{ headerShown: false }} />
        <Stack.Screen name="ChatingScreen" component={ChatingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GroupDetails" component={GroupDetails} options={{ headerShown: false }} />
        <Stack.Screen name="FullScreenImg" component={FullScreenImg} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// Dashboard Tab
function DashboardTabs() {
  return (
    <Tab.Navigator
      initialRouteName="PinboardScreen"
      screenOptions={{
        tabBarActiveTintColor: "#00ABE9",
        tabBarInactiveTintColor: "#8098B6",
        tabBarStyle: { paddingBottom: 7, height: 60, paddingTop: 9, paddingLeft: getWidth() * 0.03, paddingRight: getWidth() * 0.03 },//new change,
      }}>
      <Tab.Screen name="ResourcesScreen" component={ResourcesScreen}
        options={{
          tabBarLabel: 'Resources',
          tabBarLabelStyle: {
            fontSize: 11,
            fontFamily: getLightFont(),//new change
            marginBottom: 5,
            fontWeight: "300",
            alignSelf: "center",
            marginTop: 3,//new change
            lineHeight: 13 //new change
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Image name="home" color={color} size={size}
              style={{ height: 22, width: 22, resizeMode: 'contain' }}
              source={focused ? require('./assets/resources_active.png') : require('./assets/resources_inactive.png')} />
          ),
          headerShown: false
        }} />
      {/* <Tab.Screen name="HomeStackScreen" component={HomeStackScreen} 
            options={{ 
              tabBarLabel: 'Home',
              tabBarLabelStyle: {
                fontSize: 11,
                fontFamily:getRegularFont(),
                fontWeight:"300",
                alignSelf:"center"
              },
              tabBarIcon: ({ color, size, focused }) => (
                <Image name="home" color={color} size={size} 
                  style={{ height:22, width:22, resizeMode:'contain'}}
                  source={ focused ? require('./assets/bottom_home_active.png') : require('./assets/bottom_home.png')} />
              ),
              headerShown: false 
              }}/> */}
      <Tab.Screen name="EventsStackScreen" component={EventsStackScreen}
        options={{
          tabBarLabel: 'Events',
          tabBarLabelStyle: {
            fontSize: 11,
            fontFamily: getLightFont(),//new change
            marginBottom: 5,
            fontWeight: "300",
            alignSelf: "center",
            marginTop: 3,//new change
            lineHeight: 13 //new change
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Image size={size}
              style={{ height: 22, width: 22, resizeMode: 'contain' }}
              source={focused ? require('./assets/bottom_event_active.png') : require('./assets/bottom_event.png')} />
          ),
          headerShown: false
        }} />
      <Tab.Screen name="PinboardScreen" component={PinboardScreen}
        options={{
          tabBarLabel: 'PinBoard',
          tabBarLabelStyle: {
            fontSize: 11,
            fontFamily: getLightFont(),//new change
            marginBottom: 5,
            fontWeight: "300",
            alignSelf: "center",
            marginTop: 3,//new change
            lineHeight: 13 //new change
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Image size={size}
              style={{ height: 22, width: 22, resizeMode: 'contain' }}
              source={focused ? require('./assets/pin_board_active.png') : require('./assets/pin_board_inactive.png')} />
          ),
          headerShown: false
        }} />
      <Tab.Screen name="ChatStackScreen" component={ChatStackScreen}
        options={{
          tabBarLabel: 'Chats',
          tabBarLabelStyle: {
            fontSize: 11,
            fontFamily: getLightFont(),//new change
            marginBottom: 5,
            fontWeight: "300",
            alignSelf: "center",
            marginTop: 3,//new change
            lineHeight: 13 //new change
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Image size={size}
              style={{ height: 22, width: 22, resizeMode: 'contain' }}
              source={focused ? require('./assets/bottom_chat_active.png') : require('./assets/bottom_chat.png')} />
          ),
          headerShown: false
        }} />
      <Tab.Screen name="SettingsStackScreen" component={SettingsStackScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarLabelStyle: {
            fontSize: 11,
            fontFamily: getLightFont(),//new change
            marginBottom: 5,
            fontWeight: "300",
            alignSelf: "center",
            marginTop: 3,//new change
            lineHeight: 13 //new change
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Image size={size}
              style={{ height: 22, width: 22, resizeMode: 'contain', }}
              source={focused ? require('./assets/bottom_settings_active.png') : require('./assets/bottom_settings.png')} />
          ),
          headerShown: false
        }} />
    </Tab.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <SettingsStack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
      <SettingsStack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
      <SettingsStack.Screen name="AppSettings" component={AppSettings} options={{ headerShown: false }} />
      <SettingsStack.Screen name="HelpScreen" component={HelpScreen} options={{ headerShown: false }} />
      <SettingsStack.Screen name="PrivacyScreen" component={PrivacyScreen} options={{ headerShown: false }} />
      <SettingsStack.Screen name="TermsScreen" component={TermsScreen} options={{ headerShown: false }} />
    </SettingsStack.Navigator>
  );
}

function ChatStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Chats" component={ChatScreen} options={{ headerShown: false }} />
    </SettingsStack.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <SettingsStack.Screen name="NotificationList" component={NotificationList} options={{ headerShown: false }} />
      <SettingsStack.Screen name="EventDetails" component={EventDetails} options={{ headerShown: false }} />
      <SettingsStack.Screen name="Chats" component={ChatScreen} options={{ headerShown: false }} />
    </SettingsStack.Navigator>
  );
}

function ResourcesScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Resources" component={Resources} options={{ headerShown: false }} />
    </SettingsStack.Navigator>
  );
}

function PinboardScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="PinBoard" component={PinBoard} options={{ headerShown: false }} />
      <SettingsStack.Screen name="NotificationList" component={NotificationList} options={{ headerShown: false }} />
      <SettingsStack.Screen name="EventDetails" component={EventDetails} options={{ headerShown: false }} />
      <SettingsStack.Screen name="Chats" component={ChatScreen} options={{ headerShown: false }} />
      <SettingsStack.Screen name="CommentScreen" component={CommentScreen} options={{ headerShown: false }} />
    </SettingsStack.Navigator>
  );
}

function EventsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="CourseList" component={CourseList} options={{ headerShown: false }} />
      <SettingsStack.Screen name="EventScreen" component={EventScreen} options={{ headerShown: false }} />
      <SettingsStack.Screen name="NotificationList" component={NotificationList} options={{ headerShown: false }} />
      <SettingsStack.Screen name="EventDetails" component={EventDetails} options={{ headerShown: false }} />
    </SettingsStack.Navigator>
  );
}

export default App;
