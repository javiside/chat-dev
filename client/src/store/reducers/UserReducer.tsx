import { UPDATE, LOGOUT } from '../actions/actions';
import { updateObject } from '../utility';
import { UserStore } from '../../store';
import { UserAction } from '../actions/types';

export const initialState: UserStore = {
  _id: '',
  firstname: '',
  lastname: '',
  email: '',
  contacts: [],
  conversations: [],
  invitations: [],
  convParts: [],
  avatar: ''
};
export const UserReducer = (state: UserStore = initialState, action: UserAction): UserStore => {
  switch (action.type) {
    case UPDATE:
      return updateObject(state, action.userData);    
    case LOGOUT:
    return initialState;
    default:
      return state;
  }
};
