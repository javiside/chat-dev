import { CHANGEVIEW, DISPLAY, ONLINE } from '../actions/actions';
import { ViewStore } from '../../store';
import { ViewAction } from '../actions/types';
import { AnyAction } from 'redux';

let initialView: ViewStore = {
  current: 'home',
  display: 'home',
  convName: 'home',
  friend: 'home',
  userOnline: ''
};

const ViewReducer = (
  state: ViewStore = initialView,
  action: ViewAction
): ViewStore => {

  switch (action.type) {
    case CHANGEVIEW:
      return { ...state, current: action.current };
    case DISPLAY:
      return {
        ...state,
        display: action.conversation,
        convName: action.convName,
        friend: action.friend
      };
      case ONLINE:
      return { ...state, userOnline: action.userOnline };
    default:
      return state;
  }
};

export default (state: ViewStore, action: AnyAction) =>
  ViewReducer(state, action as ViewAction);
