import React, { useEffect, useState } from 'react';
import {SafeAreaView,ScrollView,Modal,PermissionsAndroid,StatusBar,StyleSheet,Text,useColorScheme,View,ImageBackground,Image,TextInput,Pressable, Alert, Switch} from 'react-native';
import {externalStyles} from '../common/styles';
import { LOGIN } from '../common/webUtils';
import { APP_NAME } from '../common/strings';
import { CustomProgressBar,validateEmail } from '../common/utils';
import { saveSession,USER_ID,FIRST_NAME,LAST_NAME,EMAIL,ACCESS_TOKEN,PROFILE_IMG,PHONE } from '../common/LocalStorage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-picker';

export function ProfileScreen({navigation}) {
  const [isLoading, setLoding] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [imageUri, setImageUri] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const updateProfile = async () => {    
    try{
      if (firstName.trim().length == 0){
        Alert.alert(APP_NAME,"Enter first name");
        return;
      }else if (lastName.trim().length == 0){
        Alert.alert(APP_NAME,"Enter last name");
        return;
      }else if (email.trim().length == 0){
        Alert.alert(APP_NAME,"Enter email");
        return;
      }else if (!validateEmail(email.trim())){
        Alert.alert(APP_NAME,"Invalide email");
        return;
      }else if (phone.trim().length == 0){
        Alert.alert(APP_NAME,"Enter phone");
        return;
      }

    //   var myHeaders = new Headers();
    //   myHeaders.append("Accept", "application/json");

    //   var formdata = new FormData();
    //   formdata.append("email", emailId);
    //   formdata.append("email_otp", otp);
    //   formdata.append("new_password", newPassword);
    //   formdata.append("new_password_confirmation", confirmPassword);

    //   var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: formdata,
    //     redirect: 'follow'
    //   };
    //   console.log("Request=>"+emailId+","+otp+","+newPassword+","+confirmPassword);
    //   setLoding(true);
    //   fetch(RESET_PASSWORD, requestOptions)
    //     .then(response => response.json())
    //     .then((json) => {
    //       console.log(json);
          
    //       setLoding(false);

    //       if (json.status == 1){
    //         // navigation.navigate('OTP',{
    //         //   emailId:loginEmail
    //         // });
    //         // Alert.alert(APP_NAME,json.message);
    //         navigation.navigate('SuccessResetPassword');
    //       }else{
    //         Alert.alert(APP_NAME,json.message);
    //       }
    //     })
    //     .catch((error) => {
    //       setLoding(false);
    //       console.log("Error=>"+error);
    //       Alert.alert(APP_NAME,error+"");
    //     });
    }catch(e){
      setLoding(false);
      console.log("Exception=>"+error+"");
      Alert.alert(APP_NAME,error);
    }
  }

  const requestCameraPermission = async () => {
    try {
      PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.CAMERA, 
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
        ).then((result) => {
          if (result['android.permission.CAMERA']
          && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
            setModalVisible(true);
          } else if (result['android.permission.CAMERA']
          || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
            console.log("Camera permission denied");
          }
        });
    } catch (err) {
      console.warn(err);
    }
  };

  const launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // const source = { uri: response.uri };
        console.log('response', JSON.stringify(response));
        // this.setState({
        //   filePath: response,
        //   fileData: response.data,
        //   fileUri: response.uri
        // });
        // setImageUri({ uri: response.uri });
        setImageUri({ uri:response.assets[0].uri});
        console.log('response', response.assets[0].uri);
      }
    });

  }

  const launchGallery = () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    
        /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        // this.setState({
        // filePath: response,
        // fileData: response.data,
        // fileUri: response.uri
        // });
        console.log('response', JSON.stringify(response));
        setImageUri({ uri:response.assets[0].uri});
      }
    });
  }

  return (
    <ScrollView style={{backgroundColor:"white"}} keyboardShouldPersistTaps={'handled'}>
      <StatusBar translucentbarStyle="light-content" backgroundColor='#F5FCFF'/>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
        <View style={{flex:1, backgroundColor:"rgba(4,4,15,0.4)"}}>
          <View style={externalStyles.bottom_custom_dialog_parent}>
            <Pressable onPress={()=>{
                  setModalVisible(false);
                  launchCamera();
                }}>
              <View style={externalStyles.bottom_custom_camera_parent}>
                <Image style={externalStyles.bottom_custom_image} source={require('../assets/bottom_chat.png')}/>
                <Text style={externalStyles.bottom_custom_camera_text}>Camera</Text>
              </View>
            </Pressable>
            <View style={{height:1,backgroundColor:"#3F3F3F",flex:1,marginLeft:10,marginRight:10}}/>
            <Pressable onPress={()=>{
                  setModalVisible(false);
                  launchGallery();
                }}>
              <View style={externalStyles.bottom_custom_gallery_parent}>
                <Image style={externalStyles.bottom_custom_image} source={require('../assets/bottom_chat.png')}/>
                <Text style={externalStyles.bottom_custom_camera_text}>Gallery</Text>
              </View>
            </Pressable>
            
            <Pressable onPress={()=>setModalVisible(false)}>
              <Text style={externalStyles.bottom_custom_cancel_parent}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={externalStyles.profile_column_parent}>
        <View style={externalStyles.setting_row_parent}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image style={externalStyles.back_button2} source={require('../assets/back.png')}/>
          </Pressable>
        </View>
        <View style={externalStyles.update_profile_img_parent}>
          <Pressable onPress={() => {requestCameraPermission()}}>
            <View style={{height:96,width:96}}>
              <Image  source={imageUri} 
                style={externalStyles.update_profile_image}/>
              <Image style={externalStyles.update_profile_edit_img} source={require('../assets/profile_edit_icon.png')}/>
            </View>
          </Pressable>
        </View>
        <TextInput style={externalStyles.profile_text_input} placeholder="First name" keyboardType="default"
            onChangeText={text => setFirstName(text)} 
            value={firstName}/>
        <TextInput style={externalStyles.profile_text_input} placeholder="Last name" keyboardType="default"
            onChangeText={text => setLastName(text)} 
            value={lastName}/>
        <TextInput style={externalStyles.profile_text_input} placeholder="Email" keyboardType="email-address"
            onChangeText={text => setEmail(text)} 
            value={email}/>
        <TextInput style={externalStyles.profile_text_input} placeholder="Phone" keyboardType="phone-pad"
            onChangeText={text => setPhone(text)} 
            value={phone}/>
        <Pressable onPress= {() => navigation.navigate('ChangePassword')}>
          <View style={externalStyles.profile_text_input}>
            <Text style={externalStyles.profile_password_input}>******</Text>
              <Text style={externalStyles.profile_change_password}>Change Password</Text>
          </View>
        </Pressable>
        <Pressable  onPress={() => updateProfile()}>
          <Text style={externalStyles.profile_submit}>SAVE CHANGES</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
  }
