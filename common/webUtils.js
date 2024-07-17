// export const LOCAL_BASE_URL = 'http://138.197.230.78/api';
export const LOCAL_BASE_URL = 'http://157.230.203.199/api';
export const BASE_URL = 'https://www.evolvecollege.com/api';
// export const BASE_URL = 'https://www.evolvecollege.com/api/auth/token';
// export const BASE_URL_2 = 'https://www.evolvecollege.com/api';

export const LOGIN = BASE_URL+"/auth/token";
export const COURSE_LIST = BASE_URL+"/student/timetable?token=";
// https://www.evolvecollege.com/api/student/timetable?token=[full bearer token]

export const UPDATE_EVENTS_BY_APP = LOCAL_BASE_URL+"/auth/update/event/student";
// http://138.197.230.78/api/auth/update/event/student

export const EDIT_RSVP = LOCAL_BASE_URL+"/auth/rsvp/update";
// http://138.197.230.78/api/auth/rsvp/update

export const NOTIFICATION_LIST = LOCAL_BASE_URL+"/auth/notification";
// http://138.197.230.78/api/auth/notification

export const APP_SETTINGS = LOCAL_BASE_URL+"/auth/noti_setting";
// http://138.197.230.78/api/auth/noti_setting

export const NOTIFICATION_READ = LOCAL_BASE_URL+"/auth/noti_update";
// http://138.197.230.78/api/auth/noti_update

export const UPDATE_APP_SETTINGS = LOCAL_BASE_URL+"/auth/setting_update";
// http://138.197.230.78/api/auth/setting_update

export const EVENT_DETAILS = LOCAL_BASE_URL+"/auth/event_details";
// http://138.197.230.78/api/auth/event_details

export const FORGOT_PASSWORD = BASE_URL+'/auth/forgot/password';
export const RESET_PASSWORD = BASE_URL+'/auth/update/password';

export const GROUP_LIST = LOCAL_BASE_URL+'/auth/get_list';
export const GET_GROUP_MESSAGES = LOCAL_BASE_URL+'/auth/get_group_messages';
export const DELETE_GROUP = LOCAL_BASE_URL+'/auth/group_left';
export const DELETE_CHAT = LOCAL_BASE_URL+'/auth/message_left';
export const GROUP_INFO = LOCAL_BASE_URL+'/auth/group_info';
export const CLEAR_CHAT = LOCAL_BASE_URL+'/auth/all_messages_delete';
export const FILE_SEND = LOCAL_BASE_URL+'/auth/file_upload_msg';

export const IMAGE_THUMB_URL = "http://157.230.203.199/storage/group_profile_image/thumb/";
export const CHAT_FILE_URL = "http://157.230.203.199/storage/group_message_file/";
// export const PROFILE_IMAGE_URL = "http://127.0.0.1:8000/storage/user_profile_image/";
export const PROFILE_IMAGE_URL = "http://157.230.203.199/storage/user_profile_image/thumb/";
export const PINBOARD_IMAGE_URL = "http://157.230.203.199/storage/pinboard_image/";
export const PINBOARD_THUMB_IMAGE_URL = "http://157.230.203.199/storage/pinboard_image/thumb/";
export const RESOURCE_URL = "http://157.230.203.199/storage/resource_files/";

// http://157.230.203.199/storage/group_profile_image/thumb/
// http://157.230.203.199/storage/group_message_file/

export const PROFILE_UPDATE = LOCAL_BASE_URL+'/auth/profileUpload';

export const PINBOARD_LIST = LOCAL_BASE_URL+'/auth/allPinboards';

export const LIKE_PIN_LIST = LOCAL_BASE_URL+'/auth/likePinboards';

export const REACT_PIN_LIST = LOCAL_BASE_URL+'/auth/reactPinboards';

export const GET_PIN_LIST = LOCAL_BASE_URL+'/auth/getPinboard';

export const COMMENT_PIN_LIST = LOCAL_BASE_URL+'/auth/commentPinboards';

export const REMOVE_COMMENT_PIN_LIST = LOCAL_BASE_URL+'/auth/removeComment';

export const UPDATE_COMMENT_PIN_LIST = LOCAL_BASE_URL+'/auth/updateComment';

export const RESOURCE_LIST = LOCAL_BASE_URL+'/auth/allResource';

export const LOGOUT_API = LOCAL_BASE_URL+'/auth/logout';