// https://reactnavigation.org/docs/bottom-tab-navigator/ 
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useEffect, useState } from 'react';
 import {SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,useColorScheme,View,ImageBackground,Image,TextInput,Pressable, Alert, BackHandler} from 'react-native';

 import { NavigationContainer } from '@react-navigation/native';
 import { createNativeStackNavigator } from '@react-navigation/native-stack';
 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

 import {HomeScreen} from '../components/HomeScreen'
 import {NotificationList} from '../components/NotificationList'

 import {EventScreen} from '../components/EventScreen'
 import {CourseList} from '../components/CourseList'
 import {EventDetails} from '../components/EventDetails'
 
 import {ChatScreen} from '../components/ChatScreen'
 
 import {SettingsScreen} from '../components/SettingsScreen'
 import {ProfileScreen} from '../components/ProfileScreen'
 import {ChangePassword} from '../components/ChangePassword'
 import {AppSettings} from '../components/AppSettings'
 import {HelpScreen} from '../components/HelpScreen'
 import {PrivacyScreen} from '../components/PrivacyScreen'
 import {TermsScreen} from '../components/TermsScreen'
 import {Login} from '../components/Login'
 import { getBoldFont,getRegularFont } from '../common/utils';

 function Dashboard({navigation,route}) {
  console.log("(route.params !== undefined)=>"+(route.params !== undefined));
  if(route.params !== undefined){
    navigation.navigate('EventDetails',{event_id:route.params.id,user_id:route.params.user_id});
  }

  const SettingsStack = createNativeStackNavigator();

  function SettingsStackScreen() {
    return (
      <SettingsStack.Navigator>
        <SettingsStack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }}/>
        <SettingsStack.Screen name="ProfileScreen" component={ProfileScreen}  options={{ headerShown: false }}/>
        <SettingsStack.Screen name="ChangePassword" component={ChangePassword}  options={{ headerShown: false }}/>
        <SettingsStack.Screen name="AppSettings" component={AppSettings}  options={{ headerShown: false }}/>
        <SettingsStack.Screen name="HelpScreen" component={HelpScreen}  options={{ headerShown: false }}/>
        <SettingsStack.Screen name="PrivacyScreen" component={PrivacyScreen}  options={{ headerShown: false }}/>
        <SettingsStack.Screen name="TermsScreen" component={TermsScreen}  options={{ headerShown: false }}/>
      </SettingsStack.Navigator>
    );  
  }

  function HomeStackScreen() {
    return (
      <SettingsStack.Navigator>
        <SettingsStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
        <SettingsStack.Screen name="NotificationList" component={NotificationList}  options={{ headerShown: false }}/>
        <SettingsStack.Screen name="EventDetails" component={EventDetails}  options={{ headerShown: false }}/>
      </SettingsStack.Navigator>
    );  
  }

  function EventsStackScreen() {
    return (
      <SettingsStack.Navigator>
        <SettingsStack.Screen name="CourseList" component={CourseList} options={{ headerShown: false }}/>
        <SettingsStack.Screen name="EventScreen" component={EventScreen} options={{ headerShown: false }}/>
        <SettingsStack.Screen name="NotificationList" component={NotificationList}  options={{ headerShown: false }}/>
        <SettingsStack.Screen name="EventDetails" component={EventDetails}  options={{ headerShown: false }}/>
      </SettingsStack.Navigator>
    );  
  }

  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer name="Dashboard" independent={true}>
      <Tab.Navigator 
        initialRouteName="HomeStackScreen"
        screenOptions={{
          tabBarActiveTintColor:"#00ABE9",
          tabBarInactiveTintColor:"#8098B6"
        }}>
        <Tab.Screen name="HomeStackScreen" component={HomeStackScreen} 
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
                  source={ focused ? require('../assets/bottom_home_active.png') : require('../assets/bottom_home.png')} />
              ),
              headerShown: false 
              }}/>
        <Tab.Screen name="EventsStackScreen" component={EventsStackScreen} 
            options={{ 
              tabBarLabel: 'Events',
              tabBarLabelStyle: {
                fontSize: 11,
                fontFamily:getRegularFont(),
                fontWeight:"300",
                alignSelf:"center"
              },
              tabBarIcon: ({ color, size, focused }) => (
                <Image size={size} 
                  style={{ height:22, width:22, resizeMode:'contain'}}
                  source={focused ? require('../assets/bottom_event_active.png') : require('../assets/bottom_event.png')} />
              ),
              headerShown: false 
              }}/>
        <Tab.Screen name="Chats" component={ChatScreen} 
            options={{ 
              tabBarLabel: 'Chats',
              tabBarLabelStyle: {
                fontSize: 11,
                fontFamily:getRegularFont(),
                fontWeight:"300",
                alignSelf:"center"
              },
              tabBarIcon: ({ color, size, focused }) => (
                <Image size={size} 
                  style={{height:22, width:22, resizeMode:'contain'}}
                  source={focused ? require('../assets/bottom_chat_active.png') : require('../assets/bottom_chat.png')} />
              ),
              headerShown: false 
              }}/>
        <Tab.Screen name="SettingsStackScreen" component={SettingsStackScreen} 
            options={{ 
              tabBarLabel: 'Settings',
              tabBarLabelStyle: {
                fontSize: 11,
                fontFamily:getRegularFont(),
                fontWeight:"300",
                alignSelf:"center"
              },
              tabBarIcon: ({ color, size, focused }) => (
                <Image size={size} 
                  style={{ height:22, width:22, resizeMode:'contain',}}
                  source={focused ? require('../assets/bottom_settings_active.png') : require('../assets/bottom_settings.png')} />
              ),
              headerShown: false 
              }}/>                        
      </Tab.Navigator>
      </NavigationContainer>
   );
 };
 
 export default Dashboard;
 