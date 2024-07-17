import { StyleSheet, Dimensions } from 'react-native';
import { getBoldFont, getLightFont, getRegularFont } from '../common/utils';

export const externalStyles = StyleSheet.create({
  // common
  row_parent: {
    flex: 1,
    flexDirection: "row"
  },
  column_parent: {
    flex: 1,
    flexDirection: "column",
  },
  back_button: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginLeft: 20,
    marginTop: 30
  },
  back_button2: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  no_data_parent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  no_data_text: {
    fontSize: 18,
    color: "#231F20",
    fontFamily: getRegularFont(),
  },
  loadingText: {
    fontSize: 20, fontFamily: getBoldFont(), color: "#000000",
  },

  // Login screen
  splash_background: {
    backgroundColor: '#000000',
    flex: 1,
    flexDirection: "column",
  },
  splash_middle_logo: {
    marginTop: 204,
    alignSelf: "center"
  },
  splash_screen: {
    flex: 1,
    resizeMode: "contain"
  },
  splash_bottom_logo: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: undefined,
    marginBottom: -20,
    aspectRatio: 1,
  },
  // resizeMode:'cover',
  login_scrollview: {
    paddingLeft: 32,
    paddingRight: 32
  },
  login_background: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    flexDirection: "column",
  },
  login_welcome_text: {
    color: "#000000",
    fontSize: 26,
    marginTop: 75, // new change
    fontWeight: "600",
    letterSpacing: 0,
    fontFamily: getBoldFont()
  },
  login_welcome_text2: {
    color: "#666666",
    fontSize: 14,
    marginTop: 8,
    letterSpacing: 0,
    fontFamily: getRegularFont()
  },
  login_email_edittext_parent: {
    flexDirection: 'row',
    backgroundColor: "#ffffff",
    marginTop: 24,
    borderRadius: 8,
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: "center",
  },
  login_email_edittext: {
    marginLeft: 8,
    flex: 1,
    color: "#000000",
    fontFamily: getRegularFont()
  },
  edittext_left_icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: "#999999"
  },
  edittext_left_icon_active: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#000000'
  },
  email_login_icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#00ABE9'
  },
  login_password_edittext_parent: {
    flexDirection: 'row',
    backgroundColor: "#ffffff",
    marginTop: 12,
    borderRadius: 8,
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: "center",
  },
  login_forgot_password: {
    color: "#00ABE9",
    marginTop: 21,
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    letterSpacing: 0,
    fontFamily: getRegularFont()
  },
  login_btn_background: {
    backgroundColor: "#00ABE9",
    marginTop: 25,
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  login_btn_text: {
    color: "#ffffff",
    flex: 1,
    fontSize: 14,
    letterSpacing: 0,
    textAlignVertical: "center",
    textAlign: "center",
    fontFamily: getBoldFont()
  },
  login_or_text_parent: {
    marginTop: 210,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
    textTransform: 'uppercase',
  },
  login_or_text_parent2: {
    marginTop: 310,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
    textTransform: 'uppercase',
  },
  login_or_text: {
    fontSize: 10,
    color: "#666666",
    flexDirection: 'row',
    textTransform: 'uppercase',
    fontFamily: getRegularFont()
  },
  login_or_text_divider: {
    backgroundColor: "#13231F20",
    marginRight: 10,
    marginLeft: 10,
    height: 1,
    flex: 1
  },
  login_with_email_parent: {
    backgroundColor: "#ffffff",
    paddingBottom: 16,
    paddingTop: 16,
    borderRadius: 28,
    borderColor: "#E2E8ED",
    borderWidth: 1,
    marginTop: 23,
    flexDirection: "row",
    paddingLeft: 20,
  },
  login_with_email_text: {
    color: "#231F20",
    fontSize: 14,
    alignSelf: "center",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    fontFamily: getRegularFont()
  },
  login_with_google_icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },

  // Forgot Password

  forgot_header_text: {
    color: "#000000",
    fontSize: 20,
    marginTop: 23,
    fontWeight: "600",
    letterSpacing: 0,
    textAlign: "center",
    fontFamily: getBoldFont()
  },
  forgot_header_text2: {
    color: "#666666",
    fontSize: 14,
    marginTop: 8,
    letterSpacing: 0,
    textAlign: "center",
    fontFamily: getRegularFont()
  },

  // OTP screen
  otp_textinput: {
    flex: 1,
    height: 65,
    width: 75,
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginLeft: 4,
    marginRight: 4,
    fontSize: 18,
    marginTop: 24,
    marginBottom: 24,
    fontSize: 20,
    color: "#231F20",
    fontFamily: getBoldFont()
  },
  otp_textinput_active: {
    flex: 1,
    height: 65,
    width: 75,
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginLeft: 4,
    marginRight: 4,
    fontSize: 18,
    marginTop: 24,
    marginBottom: 24,
    borderColor: "#8098B6",
    borderWidth: 1,
    fontSize: 20,
    color: "#231F20",
    fontFamily: getBoldFont()
  },
  forgot_resend_text: {
    color: "#666666",
    fontSize: 14,
    textAlign: 'center',
    fontFamily: getRegularFont(),
  },

  // Home Screen
  top_header_parent_card: {
    height: 252,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  top_header_data_parent: {
    flex: 1,
    marginTop: 64,
    marginLeft: 32,
    marginRight: 32,
    flexDirection: "row"
  },
  top_header_data_parent2: {
    height: 88,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center"
  },
  top_header_data_profile_image: {
    height: 88,
    width: 88,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    borderRadius: 88 / 2,
  },
  top_header_data_user_name: {
    marginLeft: 16,
    color: "#231F20",
    fontSize: 20,
    fontWeight: '500',
    fontFamily: getBoldFont(),
  },
  top_header_data_user_joined: {
    marginLeft: 16,
    color: "#4F4C4D",
    marginTop: 2,
    fontSize: 14,
    fontWeight: '300',
    fontFamily: getRegularFont(),
  },
  top_header_notification: {
    height: 32,
    width: 32,
  },
  top_header_notification_1: {
    marginRight: 16,
    marginTop: 49,
    height: 32,
    width: 32,
    position: "absolute",
    right: 0,
  },
  home_list_container: {
    // marginTop:-67,
    marginTop: -60,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10
    // flex:1,
  },
  home_empty_text: {
    height: 485,
    textAlign: "center",
    color: "#000000",
    fontSize: 16,
    paddingTop: 200,
    fontFamily: getBoldFont(),
  },
  home_list_items: {
    flexDirection: "row",
    marginTop: 20,
  },
  home_list_items_icon: {
    height: 40,
    width: 40,
  },
  home_list_items_text1: {
    // fontSize: 13,
    // color: "#231F20",
    // marginLeft: 12,
    // marginRight: 25,
    // fontFamily: getRegularFont()
    fontFamily: getBoldFont(),
    fontSize: 14,
    color: "#231F20",
    flex: 1,
    lineHeight: 16,
    marginLeft: 12,
    marginRight: 25,
  },
  home_list_items_text2: {
    fontSize: 13,
    color: "#666666",
    marginLeft: 12,
    marginRight: 25,
    fontWeight: '300',
    fontFamily: getLightFont()
  },
  home_list_divider: {
    backgroundColor: "#EBEDF0",
    height: 1,
    flex: 1,
    marginTop: 15,
  },
  home_list_arrow: {
    height: 13,
    width: 8,
    position: "absolute",
    right: 0,
    marginTop: 14,
  },
  //Setting screen
  setting_row_parent: {
    paddingTop: 50,
    paddingBottom: 24,//new change
    paddingHorizontal: 15,
    backgroundColor: 'white',
    flexDirection: "row",
    alignItems: "center",
  },
  setting_row_parent1: {
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 15,
    backgroundColor: 'white',
    flexDirection: "row",
    alignItems: "center",
  },
  setting_title_text: {
    color: '#231F20',
    fontFamily: getBoldFont(),
    paddingHorizontal: -16,
    fontSize: 14,
    flex: 1,
    textAlign: "center",
  },
  setting_title_text1: {
    color: '#231F20',
    fontFamily: getBoldFont(),
    paddingHorizontal: -16,
    fontSize: 14,
    flex: 1,
    textAlign: "center",
    marginRight: 25
  },
  setting_divider: {
    height: 1,
    backgroundColor: "#E6E8EA",
  },
  setting_menu_title: {
    color: "#231F20",
    fontSize: 14,
    marginLeft: 14,
    fontFamily: getRegularFont(),
  },
  setting_menu_icon: {
    height: 40,
    width: 40
  },
  setting_company_title: {
    color: "#231F20",
    fontSize: 16,
    fontFamily: getBoldFont(),
  },
  setting_list_arrow: {
    height: 13,
    width: 8,
    position: "absolute",
    right: 0,
    marginRight: 15,
  },
  setting_logout: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 40,
    paddingRight: 50,
    paddingLeft: 50,
    alignSelf: "center",
    fontFamily: getRegularFont(),
  },
  //App Settings
  appsetting_title_text: {
    color: '#231F20',
    fontFamily: getBoldFont(),
    marginLeft: 15,
    fontSize: 16,
    marginTop: 35,
    marginBottom: 18,
  },
  appsetting_row_parent: {
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 8,
    backgroundColor: 'white',
    flexDirection: "column",
  },
  appsetting_row_subparent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 23,
    paddingBottom: 23,
    paddingLeft: 20,
    paddingRight: 17,
  },
  appsetting_text_1: {
    color: "#231F20",
    fontSize: 14,
    fontFamily: getRegularFont(),
    flex: 1,
  },
  appsetting_text_2: {
    color: '#999999',
    fontFamily: getRegularFont(),
    fontSize: 13,
    marginTop: 2,
  },
  appsetting_list_switch: {
    position: "absolute",
    right: 0,
    marginRight: 15,
  },
  // transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }]
  // Help screen
  help_row_parent: {
    marginLeft: 15,
    marginTop: 17,
    marginRight: 15,
    borderRadius: 8,
    paddingRight: 5,
    paddingLeft: 10,
    backgroundColor: 'white',
    flexDirection: "column",
  },
  help_menu_icon: {
    height: 40,
    width: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },
  help_row_subparent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 23,
    paddingBottom: 23,
    paddingLeft: 5,
    paddingRight: 5,
  },

  // Privacy

  privacy_row_parent: {
    paddingRight: 16,
    paddingLeft: 16,
    flex: 1,
    flexDirection: "column",
    backgroundColor: 'white',
  },
  privacy_text: {
    flex: 1,
    fontSize: 14,
    paddingTop: 16,
    paddingBottom: 16,
    color: "#000000",
    fontFamily: getRegularFont(),
  },

  //Notification List
  notification_list_parent: {
    flex: 1,
    backgroundColor: "white"
  },
  notification_list_raw_parent: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
  },
  notification_list_divider: {
    backgroundColor: "#EBEDF0",
    height: 1,
    flex: 1,
  },
  notification_list_items_icon: {
    height: 28,
    width: 28,
  },
  notification_list_time: {
    position: "absolute",
    right: 0,
    fontSize: 10,
    color: "#999999",
    fontFamily: getRegularFont()
  },
  // Course List
  course_list_parent: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E8EA',
    marginLeft: 16,
    marginRight: 16,
    padding: 20,
    marginTop: 6,
    marginBottom: 6,
  },
  course_list_title: {
    color: "#4F4C4D",
    fontSize: 14,
    fontFamily: getRegularFont(),
  },
  // Event screen
  event_list_items: {
    flexDirection: "row",
  },
  event_row_parent: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingLeft: 15,
    backgroundColor: '#F5F7FA',
    flexDirection: "row",
    alignItems: "center",
  },
  event_screen_parent: {
    backgroundColor: '#F5F7FA',
    flexDirection: "row",
    flex: 1,
  },
  event_list_parent: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E8EA',
    marginLeft: 16,
    marginRight: 16,
    paddingLeft: 20,
    marginTop: 6,
    marginBottom: 6,
  },
  event_list_parent_new: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    paddingLeft: 20,
    marginTop: 6,
    marginBottom: 6,
  },
  event_list_title: {
    color: "#4F4C4D",
    fontSize: 16,
    fontFamily: getRegularFont(),
    fontWeight: '600',
    marginTop: 14,
  },
  event_list_sub_title: {
    color: "#4F4C4D",
    fontSize: 13,
    fontWeight: '300',
    fontFamily: getRegularFont(),
    marginTop: 5,
  },
  event_list_location: {
    color: "#666666",
    fontSize: 12,
    fontFamily: getRegularFont(),
    marginTop: 8,
  },
  event_list_time: {
    color: "#666666",
    fontSize: 12,
    fontFamily: getRegularFont(),
    marginTop: 8,
  },
  event_list_alert: {
    height: 14,
    width: 16,
  },
  event_list_alert_parent: {
    height: 24,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#FF3B30",
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    right: 0,
  },
  event_list_divider_ios: {
    borderColor: "#E6E8EA",
    borderStyle: 'dashed',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10
  },
  event_list_divider: {
    borderColor: "#E6E8EA",
    borderStyle: 'dashed',
    borderLeftWidth: 1,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
    marginBottom: 10
  },
  event_list_date: {
    color: "#E76E1C",
    fontSize: 18,
    fontFamily: getBoldFont(),
  },
  event_list_month: {
    color: "#F9B98B",
    fontSize: 13,
    fontFamily: getRegularFont(),
  },
  notification_location_icon: {
    height: 14,
    width: 12,
    resizeMode: 'contain',
    marginTop: 8,
    alignItems: "center",
    marginRight: 8
  },
  top_event_notification: {
    height: 32,
    width: 32,
    right: 0,
    marginRight: 16,
    resizeMode: "contain",
  },
  // Event details
  event_details_titlebar: {
    backgroundColor: "#00ABE9",
    paddingTop: 50,
    // paddingBottom:20,
    paddingLeft: 16,
    flexDirection: "row",
    width: "50%"
  },
  event_details_titlebar2: {
    backgroundColor: "#00ABE9",
    paddingTop: 50,
    // paddingBottom:20,
    paddingLeft: 16,
    width: "50%",
    alignItems: "flex-end",
  },
  event_details_titlebar3: {
    backgroundColor: "#00ABE9",
    // paddingTop:16,
    paddingBottom: 20,
    paddingLeft: 16,
    flexDirection: "column",
  },
  event_back_button: {
    width: 25,
    height: 25,
    tintColor: "white",
    resizeMode: 'contain',
  },
  event_details_header_notification: {
    height: 32,
    width: 32,
    marginRight: 16,
    tintColor: "white",
    resizeMode: "contain",
  },
  event_details_title_text: {
    fontSize: 24,
    fontFamily: getBoldFont(),
    color: "white",
    paddingBottom: 5,
    paddingLeft: 32,
  },
  event_details_subtitle_text: {
    fontSize: 15,
    fontFamily: getBoldFont(),
    color: "white",
    paddingBottom: 20,
    paddingLeft: 32,
  },
  event_details_session_details_parent: {
    marginLeft: 32,
    marginRight: 32,
    paddingTop: 24,
  },
  event_details_session_details: {
    fontSize: 14,
    fontFamily: getBoldFont(),
    color: "#231F20",
    marginBottom: 20,
  },
  event_details_session_details_child: {
    marginTop: 4,
    marginBottom: 4,
    flexDirection: "row",
  },
  event_details_session_details_data: {
    fontSize: 14,
    fontFamily: getRegularFont(),
    color: "#231F20",
  },
  event_details_session_img: {
    height: 20,
    width: 20,
    marginRight: 16,
    resizeMode: "contain",
  },
  event_details_options_parent: {
    marginTop: 40,
    paddingLeft: 32,
    paddingRight: 32,
    paddingBottom: 42,
    paddingTop: 42,
    alignItems: "center",
    backgroundColor: "rgba(1,50,110,0.04)",
  },
  event_details_session_option_title: {
    fontSize: 14,
    fontFamily: getRegularFont(),
    color: "#231F20",
    marginRight: 20,
  },
  event_details_session_option1: {
    fontSize: 12,
    fontFamily: getBoldFont(),
    color: "#231F20",
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 4,
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: "#EBEDF0",
    borderWidth: 1,
    marginRight: 8
  },
  event_details_session_option_Y: {
    fontSize: 12,
    fontFamily: getBoldFont(),
    color: "white",
    backgroundColor: "#19D860",
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 4,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 8,
  },
  event_details_session_option_N: {
    fontSize: 12,
    fontFamily: getBoldFont(),
    color: "white",
    backgroundColor: "#FF3B30",
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 4,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 8,
  },
  event_details_note: {
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 32,
    width: 310,
    height: 110,
    textAlignVertical: 'top',
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 17,
    paddingTop: 17,
    fontFamily: getRegularFont(),
    color: "#999999",
    fontSize: 14,
  },
  event_details_note_submit: {
    fontSize: 14,
    fontFamily: getBoldFont(),
    color: "#00ABE9",
    width: 310,
    backgroundColor: "white",
    borderColor: "#00ABE9",
    borderWidth: 1,
    borderRadius: 28,
    paddingBottom: 18,
    paddingTop: 18,
    textAlign: "center",
    marginTop: 45,
  },
  event_details_divider: {
    width: 1,
    height: 34,
    flex: 1,
    borderRadius: 0.5,
    marginLeft: 10,
    backgroundColor: "#EBEDF0"
  },

  // Profile
  profile_column_parent: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  profile_text_input: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F4F7F7",
    marginRight: 32,
    marginLeft: 32,
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ECF0F0",
    color: "#231F20",
    fontFamily: getRegularFont(),
    fontSize: 14
  },
  profile_password_input: {
    color: "#231F20",
    fontFamily: getRegularFont(),
    fontSize: 14
  },
  profile_change_password: {
    color: "#00ABE9",
    position: "absolute",
    right: 0,
    alignSelf: "center",
    fontFamily: getRegularFont(),
    fontSize: 14,
    marginRight: 16,
  },
  update_profile_img_parent: {
    marginBottom: 24,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  update_profile_image: {
    height: 96,
    width: 96,
    alignSelf: "center",
    backgroundColor: "#bdbdbd",
    flexDirection: "row",
    borderRadius: 96 / 2,
  },
  update_profile_edit_img: {
    width: 40,
    height: 40,
    position: "absolute",
    bottom: 0,
    marginLeft: 65
  },
  profile_submit: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#00ABE9",
    marginRight: 32,
    marginLeft: 32,
    marginTop: 24,
    padding: 16,
    borderRadius: 28,
    color: "white",
    fontFamily: getBoldFont(),
    fontSize: 14,
    paddingBottom: 16,
    paddingTop: 16,
    textAlign: "center"
  },
  bottom_custom_dialog_parent: {
    position: "absolute",
    bottom: 0,
    flex: 1,
    marginBottom: 30,
    width: "100%",
  },
  bottom_custom_camera_parent: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#F8F8F8",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingTop: 17,
    paddingBottom: 17,
    flex: 1,
    flexDirection: "row"
  },
  bottom_custom_gallery_parent: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#F8F8F8",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingTop: 17,
    paddingBottom: 17,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  bottom_custom_camera_text: {
    color: "#00ABE9",
    fontSize: 20,
    fontFamily: getRegularFont()
  },
  bottom_custom_cancel_parent: {
    color: "#00ABE9",
    fontSize: 20,
    fontFamily: getBoldFont(),
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    textAlign: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 14,
    paddingTop: 17,
    paddingBottom: 17,
    flex: 1,
    flexDirection: "row"
  },
  bottom_custom_image: {
    height: 20,
    width: 20,
    marginLeft: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  // Reset password
  change_password_background: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    flexDirection: "column",
  },


  // Chat
  chat_row_parent: {
    paddingTop: 50,
    paddingBottom: 18,
    backgroundColor: 'white',
    flexDirection: "row",
    alignItems: "center",
  },
  chat_title_text: {
    color: '#231F20',
    // marginLeft:-40,
    fontFamily: getBoldFont(),
    fontSize: 14,
    flex: 1,
    textAlign: "center",
    lineHeight: 20
  },
  chat_back_button: {
    width: 25,
    height: 25,
    marginLeft: 15,
    marginTop: 3,
    resizeMode: 'contain',
  },
  chat_list_parent_background: {
    backgroundColor: "#ffffff",
    flex: 1,
    flexDirection: "column"
  },
  chat_search_parent: {
    marginLeft: 17,
    marginRight: 17,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(35,31,32,0.06)",
    color: "#000000",
    flexDirection: "row",
    alignItems: 'center',
    height: 36
  },
  chat_search_edittext: {
    color: "#000000",
    fontSize: 14,
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: getRegularFont()
  },
  chat_search_icon: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
    marginLeft: 10,
    marginRight: 7
  },
  chat_close_icon: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: "#999999"
  },
  chat_close_button: {
    padding: 10
  },
  chat_mic_icon: {
    height: 19,
    width: 19,
    resizeMode: 'contain',
    marginRight: 10,
    marginLeft: 7
  },
  chat_list_container: {
    backgroundColor: 'white',
    flex: 1,
  },
  chat_list_parent: {
    // marginTop: 20,
  },
  chat_list_item: {
    paddingLeft: 16,//
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#ffffff",
    alignItems: "center"
  },
  chat_list_item2: {
    flexDirection: "column",
    marginLeft: 12,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E8EA",
    paddingVertical: 16,
    paddingRight: 16,
  },
  chat_list_item3: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    marginTop: 4
  },
  chat_profile_image1: {
    height: 45,
    width: 45,
    backgroundColor: "#bdbdbd",
    flexDirection: "row",
    borderRadius: 45 / 2,
  },
  chat_profile_name1: {
    fontFamily: getBoldFont(),
    fontSize: 14,
    color: "#231F20",
    flex: 1,
    lineHeight: 16
  },
  chat_profile_time1: {
    fontFamily: getLightFont(),
    fontSize: 12,
    color: "#999999",
    fontWeight: "300",
    marginRight: 16
  },
  chat_profile_count1: {
    marginTop: 6,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: "#00ABE9",
    borderRadius: 8,
    borderColor: "#19D860",
    fontFamily: getBoldFont(),
    fontSize: 10,
    color: "#FFFFFF",
  },
  chat_profile_msg1: {
    fontFamily: getBoldFont(),
    fontSize: 12,
    marginTop: 4,
    flex: 1,
    color: "#231F20",
    fontWeight: "500"
  },
  chat_profile_msg1_deactive: {
    fontFamily: getRegularFont(),
    fontSize: 12,
    // marginTop: 4,
    marginRight: 10,
    flex: 1,
    color: "#999999",
    lineHeight: 16,
    // fontWeight: "500"
  },
  chat_list_arrow: {
    height: 13,
    width: 8,
    position: "absolute",
    right: 0,
    marginTop: 14,
    marginLeft: 12,
    tintColor: "#D1D1D6"
  },
  // Chat Swipe listview styles
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#FF3B30',
    right: 0,
  },
  backTextWhite: {
    fontFamily: getRegularFont(),
    fontSize: 14,
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: '#ffffff',
    borderBottomColor: 'black',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },


  // Chatting screen
  chating_row_parent: {
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#EBF2F7',
    flexDirection: "row",
    alignItems: "center",
  },
  chating_menu_row_parent: {
    paddingTop: 55,
    backgroundColor: '#EBF2F7',
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 0,
    right: 0,
  },
  chating_row_parent_title: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    marginRight: 40,
  },
  chating_profile_image: {
    height: 40,
    width: 40,
    backgroundColor: "#bdbdbd",
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 40 / 2,
  },
  chating_profile_name: {
    color: '#231F20',
    fontFamily: getBoldFont(),
    fontSize: 14,
    textAlign: "center",
  },
  chating_more_button: {
    width: 25,
    height: 25,
    marginRight: 15,
    resizeMode: 'contain',
  },
  chating_list: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 10
  },
  chating_bottom_parent: {
    paddingLeft: 30.34,
    paddingRight: 28.22,
    paddingTop: 21.5,
    alignItems: "center",
    paddingBottom: 27.5,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  chating_add_media_button: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  chating_camera_button: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  chating_text_area: {
    backgroundColor: "#FAFAFA",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 14,
    color: "#231F20",
    paddingRight: 14,
    flex: 1,
    fontFamily: getRegularFont(),
    borderRadius: 100,
    borderColor: "#EBEDF0",
    borderWidth: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  chating_text_area_2: {
    backgroundColor: "#FAFAFA",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 14,
    color: "#231F20",
    paddingRight: 14,
    flex: 1,
    fontFamily: getRegularFont(),
    borderRadius: 100,
    borderColor: "#EBEDF0",
    borderWidth: 1,
    marginLeft: 15,
    marginRight: 15,
    maxHeight: 60,
  },

  chat_bubble_1_parent: {
    marginRight: 16,
    marginTop: 10,
    flexDirection: "column"
  },
  chat_bubble_1: {
    borderRadius: 18,
  },
  chat_bubble_1_text: {
    fontSize: 14,
    color: "#000000",
    backgroundColor: "#bdbdbd",
    paddingBottom: 7,
    paddingTop: 7,
    paddingLeft: 13,
    paddingRight: 13,
    fontFamily: getRegularFont()
  },
  chat_daytime_parent: {
    flex: 1,
    marginTop: 9,
    marginBottom: 9,
    justifyContent: "center",
    flexDirection: "row"
  },
  chat_day_title: {
    color: "#999999",
    fontSize: 11,
    alignSelf: "center",
    fontFamily: getBoldFont(),
  },
  chat_time_title: {
    color: "#8A8A8F",
    fontSize: 11,
    alignSelf: "center",
    fontFamily: getRegularFont(),
  },
  chat_read_title: {
    color: "#999999",
    fontSize: 11,
    flex: 1,
    textAlign: "right",
    marginRight: "7%",
    marginTop: 10,
    fontFamily: getBoldFont(),
  },
  chat_menu_text: {
    fontFamily: getRegularFont(),
    fontSize: 14,
    color: "#231F20",
  },
  bottomMenuView: {
    flex: 1,
    justifyContent: "flex-end",
    marginLeft: 10,
    marginRight: 10,
  },
  bottomMenuParent: {
    margin: 20,
    flexDirection: "column",
    backgroundColor: "#F8F8F8",
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  bottomMenuParent2: {
    marginLeft: 20,
    marginBottom: 20,
    marginRight: 20,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  bottomMenuChild: {
    padding: 20,
    flexDirection: "row",
    width: "100%",
  },
  bottomMenuText: {
    color: "#00ABE9",
    width: "100%",
    alignSelf: "center",
    fontFamily: getRegularFont(),
    fontSize: 15,
  },
  bottomDeleteMenuText: {
    color: "#FF3B30",
    width: "100%",
    alignSelf: "center",
    textAlign: "center",
    fontFamily: getRegularFont(),
    fontSize: 15,
  },
  bottomMenuIcon: {
    height: 20,
    width: 20,
    marginRight: 15,
    alignSelf: "center",
    resizeMode: 'contain',
  },
  chat_bottom_divider: {
    backgroundColor: "#3F3F3F",
    height: 1,
    width: "100%"
  },
  bottomMenuCancelText: {
    color: "#00ABE9",
    width: "100%",
    flex: 1,
    textAlign: "center",
    fontFamily: getBoldFont(),
    fontSize: 15,
  },
  chat_receive_msg: {
    fontSize: 11, color: "#231F20", justifyContent: "center", fontFamily: getRegularFont(),
  },
  chat_receive_msg_emoji: {
    fontSize: 48, color: "#231F20", justifyContent: "center", fontFamily: getRegularFont(),
  },
  chat_send_msg: {
    fontSize: 11, color: "#fff", fontFamily: getRegularFont(),
  },
  chat_send_msg_emoji: {
    fontSize: 48, color: "#fff", fontFamily: getRegularFont(),
  },
  clear_chat_parent: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center"
  },
  clear_checkbox: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginLeft: 11,
  },
  delete_message_btn: {
    height: 36,
    width: 36,
    resizeMode: 'contain',
  },
  delete_message_text: {
    fontSize: 14,
    flex: 1,
    color: "#999999",
    fontFamily: getRegularFont(),

  },
  chating_bottom_delete_parent: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 7,
    alignItems: "center",
    paddingBottom: 7,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.9)"
  },

  // Group Details
  group_profile_image: {
    height: 86,
    width: 86,
    marginTop: 45,
    alignSelf: "center",
    backgroundColor: "#bdbdbd",
    flexDirection: "row",
    borderRadius: 86 / 2,
  },
  group_profile_name: {
    color: '#000000',
    fontFamily: getBoldFont(),
    fontSize: 28,
    marginTop: 4,
    marginBottom: 45,
    textAlign: "center",
  },
  group_row_parent: {
    paddingTop: 37,
    paddingBottom: 25,
    backgroundColor: '#EBF2F7',
    flexDirection: "row",
  },
  group_back_button: {
    width: 25,
    height: 25,
    marginLeft: 17,
    marginTop: 25,
    resizeMode: 'contain',
  },
  group_list_image_icon: {
    height: 45,
    width: 45,
    backgroundColor: "#bdbdbd",
    borderRadius: 45 / 2,
  },
  group_list_name_text: {
    fontSize: 14,
    color: "#231F20",
    marginLeft: 12,
    marginRight: 25,
    flex: 1,
    fontFamily: getBoldFont(),
  },
  group_list_role_text: {
    fontSize: 12,
    color: "#231F20",
    marginLeft: 12,
    marginRight: 0,
    color: "#F47920",
    fontFamily: getRegularFont(),
    borderWidth: 1,
    paddingRight: 8,
    paddingLeft: 8,
    paddingTop: 6,
    paddingBottom: 6,
    borderColor: "#F47920",
    borderRadius: 8
  },
  group_user_list_raw_parent: {
    flexDirection: "row",
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center"
  },
  chat_image_back: {
    height: 125,
    width: 180,
    borderWidth: 0,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 15,
    right: 0,
    marginLeft: "5%",
    borderColor: "#454545",
    borderWidth: 0.5
  },
  chat_image_loading: {
    height: 125,
    width: 180,
    borderWidth: 0,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 15,
    right: 0,
    marginLeft: "5%",
    borderColor: "#454545",
    paddingTop: 50,
    fontFamily: getRegularFont(),
    textAlign: "center",
    borderWidth: 0.5
  },
  chat_image_back_hide: {
    height: 0,
    width: 0,
  },
  chat_video_back: {
    height: 125,
    width: 180,
    borderWidth: 0,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 15,
    right: 0,
    marginLeft: "8%",
    backgroundColor: "black"
  },
  chat_image_sender_back: {
    height: 125,
    width: 180,
    borderWidth: 0,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 15,
    marginLeft: '50%',
    marginRight: "5%",
    borderColor: "#454545",
    borderWidth: 0.5
  },
  chat_image_sender_loading: {
    height: 125,
    width: 180,
    borderWidth: 0,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 15,
    marginLeft: '50%',
    marginRight: "5%",
    borderColor: "#454545",
    paddingTop: 50,
    fontFamily: getRegularFont(),
    textAlign: "center",
    borderWidth: 0.5
  },
  chat_image_sender_back_hide: {
    height: 0,
    width: 0,
  },
  chat_video_sender_back: {
    height: 125,
    width: 180,
    borderWidth: 0,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 15,
    marginLeft: '50%',
    marginRight: "5%",
    backgroundColor: "black"
  },
  fullscreen_back_button: {
    width: 25,
    height: 25,
    marginLeft: 15,
    marginTop: 50,
    resizeMode: 'contain',
  },
  fullscreen_chat_image_back: {
    height: "90%",
    width: "100%",
    resizeMode: 'contain',
  },
  play_button_icon: {
    height: 32,
    width: 32,
    position: "absolute",
    right: 0,
    marginTop: 55,
    marginRight: Dimensions.get("window").width * 0.23,
  },
  play_sender_button_icon: {
    height: 32,
    width: 32,
    position: "absolute",
    right: 0,
    marginTop: 55,
    // marginRight:60,//new change
  },
  // New Changes
  red_dot: {
    height: 10,
    width: 10,
    backgroundColor: "#F44336",
    borderRadius: 10 / 2,
    position: "absolute",
    right: 0,
  },
  edit_profile_pic: {
    height: 15,
    width: 15,
    position: "absolute",
    right: 0,
    bottom: 0,
    marginBottom: 110,
    marginRight: 3,
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center"
  },
  // PinBoard
  pin_board_item: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 25,
    flex: 1,
    flexDirection: "column",
  },
  pin_user_profile: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
  },
  pin_user_name: {
    fontSize: 15,
    fontFamily: getBoldFont(),
    color: "black",
    marginLeft: 10,
    marginTop: 8
  },
  pin_created_date: {
    fontSize: 11,
    fontFamily: getLightFont(),
    color: "#bdbdbd",
    marginTop: 2,
    marginLeft: 10
  },
  pins_images: {
    height: 200,
    marginTop: 10,
    marginBottom: 20,
  },
  pin_content: {
    fontSize: 14,
    fontFamily: getRegularFont(),
    color: "black",
    marginHorizontal: 0,
    marginTop: 10,
    marginBottom: 10,
  },
  pin_Action_parent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 35,
    marginVertical: 10 //
  },
  comment_top_image: {
    height: 25,
    width: 25,
    // tintColor:"#bdbdbd"
  },
  pin_action_icon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    // tintColor:"#bdbdbd"
  },
  pin_action_image: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
    // tintColor:"#bdbdbd"
  },
  pin_action_image1: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    // tintColor:"#E74856"
  },
  pin_action_image2: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    // tintColor:"#F1C40F"
  },
  pin_action_image3: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    // tintColor:"#F1C40F"
  },
  pin_action_image4: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    // tintColor:"#F1C40F"
  },
  pin_action_image5: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    // tintColor:"#F1C40F"
  },
  pin_action_count: {
    fontSize: 17,
    fontFamily: getRegularFont(),
    color: "#bdbdbd",
    marginLeft: 5,
    marginRight: 25,
  },
  pin_reaction_parent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Comment screen
  comment_user_image: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    backgroundColor: "#bdbdbd"
  },
  comment_parent: {
    backgroundColor: "rgba(0, 171, 233, 0.15)",
    flexDirection: "column",
    flex: 1,
    borderRadius: 15,
    marginHorizontal: 10,
    padding: 5
  },
  comment_action_parent: {
    flexDirection: "row",
    flex: 1,
    marginLeft: 90,
  },
  comment_edit_action_parent: {
    marginRight: 40,
    fontFamily: getRegularFont(),
    fontSize: 15,
    color: "#454545"
  },
  comment_datetime_parent: {
    position: "absolute",
    marginTop: 5,
    marginRight: 10,
    right: 0,
    fontSize: 10,
    color: "#999999",
    fontFamily: getRegularFont()
  },
  edit_text_area: {
    backgroundColor: "#FAFAFA",
    width: "100%",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 14,
    color: "#231F20",
    paddingRight: 14,
    fontFamily: getRegularFont(),
    borderRadius: 100,
    borderColor: "#EBEDF0",
    borderWidth: 1,
  },
  bottomEditMenuParent2: {
    marginLeft: 20,
    marginBottom: 20,
    marginRight: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  bottomEditCancelText: {
    color: "#bdbdbd",
    textAlign: "center",
    fontFamily: getRegularFont(),
    fontSize: 15,
    width: 200,
    padding: 15,
  },
  bottomEditSaveText: {
    color: "#00ABE9",
    textAlign: "center",
    fontFamily: getBoldFont(),
    fontSize: 15,
    width: 200,
    padding: 15,
  },
  bottomEditMenuChild: {
    padding: 20,
    flex: 1
  },
  reaction_row_parent: {
    paddingBottom: 15,
    paddingLeft: 15,
    backgroundColor: 'white',
    flexDirection: "row",
    alignItems: "center",
  },
  topCountText: {
    color: "#454545",
    fontFamily: getBoldFont(),
    fontSize: 15,
    marginLeft: 5,
    textAlign: "center"
  },
  topCounterArrow: {
    width: 15,
    height: 15,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  reaction_list_image: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    marginLeft: 10,
    marginTop: 5,
    // tintColor:"#bdbdbd"
  },
  // Resources
  resource_time: {
    // fontSize: 12,
    // color: "#999999",
    // fontFamily: getLightFont(),
    marginLeft: 12,
    fontFamily: getRegularFont(),
    fontSize: 12,
    // marginRight: 10,
    flex: 1,
    color: "#999999",
    lineHeight: 16,
  },
  dynamic_list_parent: {
    flex: 1,
    height: "100%",
    backgroundColor: "white"
  },
  resource_search_parent: {
    marginLeft: 17,
    marginRight: 17,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#0F231F20",
    color: "#000000",
    flexDirection: "row",
    alignItems: 'center',
  },
  resource_search_edittext: {
    color: "#000000",
    fontSize: 14,
    flex: 1,
    fontFamily: getRegularFont()
  },
  resource_search_icon: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
    marginLeft: 10,
    marginRight: 7
  },
  resource_title_text: {
    // marginLeft:25,
    color: '#231F20',
    fontFamily: getBoldFont(),
    textAlign: "center",
    flex: 1,
    lineHeight: 20,
    fontSize: 14,
  },
  // resource_title_text:{
  //   color:'#231F20',
  //   fontFamily:getBoldFont(),
  //   marginRight:25,
  //   fontSize:14,
  //   textAlign:"center",
  //   flex:1
  // },//double declation
  resource_row_parent: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingLeft: 15,
    backgroundColor: 'white',
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    elevation: 1
  },
  // Logout Modal
  logout_title_text: {
    marginTop: 10,
    color: '#231F20',
    fontFamily: getBoldFont(),
    fontSize: 18,
    flex: 1
  },
  logout_subtitle_text: {
    color: '#231F20',
    fontFamily: getRegularFont(),
    fontSize: 15,
    flex: 1
  },
  logout_yes_view: {
    flex: 1,
    height: 50,
    justifyContent: "center"
  },
  logout_yes_text: {
    color: '#8098B6',
    fontFamily: getBoldFont(),
    fontSize: 15,
    textAlign: "center"
  },
  logout_no_text: {
    color: '#00ABE9',
    fontFamily: getBoldFont(),
    fontSize: 15,
    textAlign: "center"
  },
  logout_no_view: {
    flex: 1,
    borderLeftWidth: 1,
    height: 50,
    justifyContent: "center",
    borderLeftColor: "#E6E8EA"
  },
  logout_bottom_view: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E6E8EA"
  },
  logoutCenteredView: {
    flex: 1,
    backgroundColor: "rgba(45, 45, 45, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutModalView: {
    height: "20%",
    width: "70%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  //new changes
  toastParent: {
    margin: 20,
    flexDirection: "column",
    backgroundColor: "black",
    borderRadius: 14,
    overflow: "hidden",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  toastParent2: {
    padding: 10,
  },
  toastTextMessage: {
    color: "white",
    fontSize: 17,
    textAlign: "center"
  },
  tabTitleText: {
    color: "#454545",
    fontFamily: getRegularFont(),
    fontSize: 15,
    // marginLeft: 5,
    textAlign: "center"
  },
  tabParentView: {
    flexDirection: "row", alignItems: "center"
  },
  reactionViewDesign: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  comment_list_container: {
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
    // flex:1,
  },
});
