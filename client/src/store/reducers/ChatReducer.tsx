import { UPDATECHAT, LOGOUT } from '../actions/actions';
import { ChatStore } from '../../store';
import { ChatAction } from '../actions/types';

export const initialChatConvs: ChatStore = [];

export const ChatReducer = (state: ChatStore = initialChatConvs, action: ChatAction): ChatStore => { 
  switch (action.type) {
    case UPDATECHAT:
      return [...state, ...action.chatData];
    case LOGOUT:
      return initialChatConvs;
    default:
      return state;
  }
};
