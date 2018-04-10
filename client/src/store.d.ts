export interface Contact{
  _id: string,
  name: string,
  email: string,
  lastMessage?: string,
  avatar?: string
}
export interface Contacts extends Array<Contact>{}

export interface Conversation {
  _id: string,
  name: string,
  info?: any,
  email?: string,
  lastMessage?: string,
  avatar?: string
}
export interface Conversations extends Array<Conversation>{}

interface Invitation {
  _id: string,
  name: string
}
interface Invitations extends Array<Invitation>{}

export interface Message {
  text: string,
  owner: string,
  ownerName: string,
  conversation: string,
  date: Date
}

interface Participant {
  firstname: string;
  lastname: string;
  email: string;
  admin: boolean;
}
export interface Participants {
  [_id: string]: Array<Participant>
}
export interface UserStore {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  contacts: Contacts;
  conversations: Conversations;
  invitations: Invitations;
  convParts: Array<Participants>;
  avatar?: string;
}

export interface ViewStore {
  current: string,
  display: string,
  convName: string,
  friend: string,
  userOnline: string
}

interface ChatStore extends Array<Message>{}

export interface StoreState {
  ViewReducer: ViewStore,
  UserReducer: UserStore,
  ChatReducer: ChatStore
}

export interface ReceivingUserData {
  _id?: string;
  firstname?: string,
  lastname?: string,
  email?: string,
  contacts?: Contacts,
  conversations?: Conversations,
  invitations?: Invitations,
  convParts?: Array<Participants>,
  newConvParts?: Array<Participants>,
  addedToConv?: Array<Participants>,
  lastMessage?: {[conv:string] : string};
  delCont?: Contacts;
  avatar?: string;
}

export interface ViewRProps{
  viewR: ViewStore;
}
export interface UserDataProps{
  userData: UserStore;
}
export interface ChatRProps{
  chatR: ChatStore;
}
export interface UserViewProps{
  userData: UserStore;
  viewR: ViewStore;
}
export interface UserViewChatProps{
  userData: UserStore;
  viewR: ViewStore;
  chatR: ChatStore;
}

interface IntlStore {
  locale: string
  messages: any
}