import * as React from 'react';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  changeView,
  update,
  createConversation,
  display
} from '../../../../store/actions/actions';
import Avatar from '../../../../images/avatar.png';
import {
  ReceivingUserData,
  Conversation,
  Contact,
  ViewStore,
  UserStore,
  IntlStore
} from '../../../../store';
import { MergedStore } from '../../../../store/reducers/rootReducer';

type users = { id: string; name: string };
interface ConvListState {
  onList: Array<users>;
  convName: string;
  msg: string;
  status: boolean;
}

class ConvList extends Component<connectedProps, ConvListState> {
  constructor(props: connectedProps) {
    super(props);
    this.state = {
      onList: [],
      convName: '',
      msg: '',
      status: false
    };
    this.handleAddUser = this.handleAddUser.bind(this);
    this.handleRemoveUser = this.handleRemoveUser.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleOpenConv = this.handleOpenConv.bind(this);
  }
  handleOpenConv(e: React.MouseEvent<HTMLLIElement>) {
    if ((e.target as HTMLLIElement).id) {
      this.props.onOpenConv(
        (e.target as HTMLLIElement).id,
        (e.target as HTMLLIElement).title || (e.target as HTMLLIElement).innerText
      );
    }
  }
  handleAddUser(e: React.MouseEvent<HTMLLIElement>) {
    let newUserId =
      (e.target as HTMLLIElement).id ||
      (e.target as HTMLLIElement).parentElement!.id;
    let newUserName = (e.target as HTMLLIElement).textContent;
    let List = this.state.onList.map(el => el.id);
    if (newUserId) {
      if (List.indexOf(newUserId) < 0) {
        if (newUserId && newUserName) {
          this.setState({
            onList: [...this.state.onList, { id: newUserId, name: newUserName }]
          });
        }
      }
    }
  }
  handleRemoveUser(e: React.MouseEvent<HTMLLIElement>) {
    let delUser =
      (e.target as HTMLLIElement).id ||
      (e.target as HTMLLIElement).parentElement!.id;
    let List = this.state.onList;
    if (delUser) {
      let newList = List.filter(el => el.id !== delUser);
      this.setState({ onList: newList });
    }
  }
  async handleCreate() {
    const intl = this.props.IntlR.messages;
    if (this.state.convName !== '') {
      let answer = await createConversation(
        this.state.onList.map(el => {
          return { _id: el.id, active: false };
        }),
        this.state.convName
      );
      if (answer.status === 200) {
        this.props.onReceivedData({
          conversations: answer.newConversation,
          newConvParts: answer.newConvParts
        });
        this.props.onCreated();
        const {
          newInvitation,
          joinNewConv
        } = require('../../../../store/actions/socketActions');
        newInvitation(
          this.state.convName,
          this.state.onList.map(el => {
            return el.id;
          })
        );
        joinNewConv(...answer.newConversation);
        this.setState({ onList: [], msg: intl.added });
      }
    } else {
      this.setState({ msg: intl.includeName });
    }
  }
  handleChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ convName: e.target.value });
  }
  render() {
    let current = this.props.viewR.current;
    const intl = this.props.IntlR.messages;
    let list: Array<Conversation | Contact> =
      current === 'home' || current === 'profile'
        ? this.props.userData.conversations
        : this.props.userData.contacts;
    return (
      <Fragment>
        {/* Show/Hide the selected Contacts Array List for the conversation */}
        <Fragment>
          {this.state.onList.length > 0 && current === 'conversations' ? (
            <Fragment>
              <li className="create-chat-button">
                <span
                  onClick={this.handleCreate}
                  className={
                    this.state.convName !== '' ? 'create-ready' : 'not-create'
                  }
                >
                  {intl.create}
                </span>
                <input
                  value={this.state.convName}
                  type="text"
                  onChange={this.handleChangeName}
                  placeholder={intl.convName}
                  className="convName"
                />
                <span className={this.state.status ? 'scs-msg' : 'error-msg'}>
                  {this.state.msg}
                </span>
              </li>

              <li className="top-array">
                <ul className="create-chat">
                  {this.state.onList.map((el, idx) => {
                    return (
                      <li key={idx} id={el.id} onClick={this.handleRemoveUser}>
                        {el.name}
                        <span
                          role="img"
                          aria-label="remove"
                          className="to-remove"
                        >
                          ❌
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </Fragment>
          ) : (
            <span className="hidden">.</span>
          )}
        </Fragment>
        {/* Load conversations/contact list */}
        {list.map((el, idx) => {
          return (
            <li
              key={idx}
              id={el._id}
              value={el.email}
              title={el.name}
              onClick={
                current === 'conversations'
                  ? this.handleAddUser
                  : this.handleOpenConv
              }
              className={current === 'home' ? 'convLiWrapper' : 'convLi'}
            >
              <span id={el._id} className="convLi">
                <span id={el._id} className="menu-avatar-conv">
                  <img
                    className="menu-avatar-inner-conv"
                    src={Avatar}
                    alt="avatar"
                  />
                </span>
                <span id={el._id} className="left-conv-name">
                  <span className="left-conv-name-text bold" id={el._id}>
                    <span id={el._id} className="long-text">
                      {current === 'home' || current === 'profile'
                        ? el.name
                        : el.email}
                    </span>
                  </span>
                </span>
              </span>
              {current === 'home' ? (
                <span title={el.name} id={el._id} className="last-msg">
                  {el.lastMessage}
                </span>
              ) : null}
            </li>
          );
        })}
      </Fragment>
    );
  }
}

type m2p = {
  viewR: ViewStore;
  userData: UserStore;
  IntlR: IntlStore;
};
type d2p = {
  onOpenConv(id: string, name: string): void;
  onReceivedData(userData: ReceivingUserData): void;
  onCreated(): void;
};
type connectedProps = m2p & d2p;
export default connect<m2p, d2p, {}, MergedStore>(
  store => ({
    viewR: store.ViewReducer,
    userData: store.UserReducer,
    IntlR: store.IntlReducer
  }),
  {
    onCreated: () => changeView('home'),
    onReceivedData: (userData: ReceivingUserData) => update(userData),
    onOpenConv: (conversation: string, convName: string) =>
      display(conversation, convName, '')
  }
)(ConvList);
