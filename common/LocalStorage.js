// https://react-native-async-storage.github.io/async-storage/docs/usage/
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveSession = async (key,value) => {
    try {
        await AsyncStorage.setItem(key, value);
        console.log("Key=>"+key+":"+"Value=>"+value);
    } catch (e) {
    // saving error
    }
}

export const clearAsyncStorage = async() => {
    // AsyncStorage.clear();
    AsyncStorage.removeItem(USER_ID);
}

export const getSession = async (key) => {
    var value = "";
    try {
        value = await AsyncStorage.getItem(key)
        console.log("Key=>"+key+":"+"Value=>"+value);
    } catch(e) {
    // error reading value
    console.log("Error=>"+e);
    }
    return value;
}

// User Data
export const USER_ID = "id";
export const LOCAL_USER_ID = "local_user_id";
export const FIRST_NAME = "fname";
export const LAST_NAME = "lname";
export const EMAIL = "email";
export const PHONE = "phone";
export const PROFILE_IMG = "profile_pic";
export const ACCESS_TOKEN = "access_token";
export const FCM_TOKEN = "fcm_token";
export const LOGIN_TIME = "login_time";

export const NOTI_TYPE = "notification_type";
export const NOTI_EVENT_ID = "notification_event_id";
export const NOTI_USER_ID = "notification_user_id";

export const NOTI_GROUP_ID = "notification_group_id";
export const NOTI_GROUP_NAME = "notification_group_name";
export const NOTI_GROUP_PIC = "notification_group_pic";
export const NOTI_GROUP_TYPE = "notification_group_type";