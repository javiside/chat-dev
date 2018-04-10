import * as React from 'react';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { update, handleInvitation, updateChat } from '../../../../store/actions/actions';
import Avatar from '../../../../images/avatar.png';
import '../../../../css/array.css';
import {
  ReceivingUserData,
  UserStore,
  ViewStore,
  Invitation,
  IntlStore,
  ChatStore
} from '../../../../store';
import { MergedStore } from '../../../../store/reducers/rootReducer';

interface InvListState {
  msg: string;
}

class InvList extends Component<connectedProps, InvListState> {
  constructor(props: connectedProps) {
    super(props);
    this.state = { msg: '' };
    this.handleInv = this.handleInv.bind(this);
  }
  async handleInv(e: React.MouseEvent<HTMLSpanElement>) {
    if (
      (e.target as HTMLSpanElement).className === 'to-accept' ||
      (e.target as HTMLSpanElement).className === 'to-delete'
    ) {
      let answer = await handleInvitation(
        (e.target as HTMLSpanElement).className,
        (e.target as HTMLSpanElement).id,
        (e.target as HTMLSpanElement).parentElement!.id
      );
      if (answer.status === 200) {
        // Inv accepted
        if (answer.newConversation) {
          console.log(answer.newConversation);
          this.props.onReceivedData({
            conversations: answer.newConversation,
            newConvParts: answer.newConvParts,
            lastMessage: answer.lastMessage
          });
          this.props.onReceivedChatData(answer.messages);
          const {
            joinNewConv
          } = require('../../../../store/actions/socketActions');
          joinNewConv(...answer.newConversation);
        }
        // Inv ignored
        this.props.onReceivedData({
          invitations: this.props.userData.invitations.filter(
            el => el._id !== answer.dropInv
          )
        });
      } else {
        this.setState({ msg: answer });
      }
    }
  }
  render() {
    const intl = this.props.IntlR.messages;
    return (
      <Fragment>
        {/* Load Invitations */}
        {this.props.userData.invitations.map((el: Invitation, idx: number) => {
          return (
            <li key={idx} id={el._id} value={el.name} className="invLi">
              <span className="menu-avatar-c">
                <img
                  className="menu-avatar-inner"
                  src={Avatar}
                  alt="avatar"
                  id={el._id}
                />
              </span>
              <div className="left-info">
                <span id={el.name} className="left-conv-name">
                  <span
                    role="img"
                    aria-label="accept"
                    id={el._id}
                    onClick={this.handleInv}
                    className="to-accept"
                  >
                    {intl.ok}✔️
                  </span>
                  <span className="left-conv-name-text bold" id={el._id}>
                    <span className="long-text">{el.name}</span>
                  </span>
                  <span
                    role="img"
                    aria-label="delete"
                    id={el._id}
                    onClick={this.handleInv}
                    className="to-delete"
                  >
                    {intl.no}❌
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </Fragment>
    );
  }
}

type m2p = {
  userData: UserStore;
  viewR: ViewStore;
  IntlR: IntlStore;
};
type d2p = {
  onReceivedData({  }: ReceivingUserData): void;
  onReceivedChatData(chatData: ChatStore): void;
};
type connectedProps = m2p & d2p;
export default connect<m2p, d2p, {}, MergedStore>(
  (store: MergedStore) => ({
    userData: store.UserReducer,
    viewR: store.ViewReducer,
    IntlR: store.IntlReducer
  }),
  {
    onReceivedData: (userData: ReceivingUserData) => update(userData),
    onReceivedChatData: (chatData: ChatStore) => updateChat(chatData),

  }
)(InvList);
