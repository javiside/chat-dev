import { combineReducers } from 'redux';
import ViewReducer from './ViewReducer';
import { UserReducer } from './UserReducer';
import { ChatReducer } from './ChatReducer';
import { IntlReducer } from './IntlReducer';
import { ViewStore, UserStore, ChatStore, IntlStore } from '../../store';

export interface MergedStore {
  ViewReducer: ViewStore;
  UserReducer: UserStore;
  ChatReducer: ChatStore;
  IntlReducer: IntlStore;
}
// Using the combineReducers method to merge the reducers into one
const rootReducer = combineReducers<MergedStore>({
  ViewReducer,
  UserReducer,
  ChatReducer,
  IntlReducer
});

export default rootReducer;
