import * as constants from './actions';
import { ChatStore, UserStore } from '../../store';
import { LOCALE_SELECTED } from './intlActions';
// ///////////VIEW REDUCER ////////////////
export interface Display {
  type: constants.DISPLAY;
  conversation: string;
  convName: string;
  friend: string;

}
export interface ChangeView {
  type: constants.CHANGEVIEW;
  current: string;
}
export interface UserOnline {
  type: constants.ONLINE;
  userOnline: string;
}
export type ViewAction = Display | ChangeView | UserOnline;

// ///////////END OF VIEW REDUCER ////////////////

// ///////////CHAT REDUCER////////////////
export interface UpdateChat {
  type: constants.UPDATECHAT;
  chatData: ChatStore;
}
export interface Logout {
  type: constants.LOGOUT;
}
export type ChatAction = UpdateChat | Logout;
// ///////////END OF CHAT REDUCER ////////////////

// ///////////CHAT REDUCER + Logout////////////////
export interface UpdateUser {
  type: constants.UPDATE;
  userData: UserStore;
}
export type UserAction = UpdateUser | Logout;
// ///////////END OF CHAT REDUCER ////////////////

// ///////////INTL REDUCER///////////
export interface SelectedLocale {
  type: LOCALE_SELECTED;
  locale: string;
}
export type IntlAction = SelectedLocale;
// /////////END OF INTL REDUCER//////