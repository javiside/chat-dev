import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { display } from '../../store/actions/actions';
import Avatar from '../../images/avatar.png';
import { MergedStore } from '../../store/reducers/rootReducer';
import { ViewStore } from '../../store';

class ChatMenu extends Component<connectedProps, {}> {
  constructor(props: connectedProps) {
    super(props);
    this.handleCloseChat = this.handleCloseChat.bind(this);
  }
  handleCloseChat() {
    this.props.onCloseChat();
  }
  render() {
    return (
      <div className="top-chat">
        <div className="chat-avatar">
          <img className="chat-avatar-img" src={Avatar} alt="avatar" />
        </div>
        <span className="chat-top-name">{this.props.viewR.convName}</span>
        <div className="chat-ops">
          <span
            role="img"
            aria-label="Invitations"
            onClick={this.handleCloseChat}
            className="ptr chat-top-close"
          >
            ❌
          </span>
          <span onClick={this.props.infoClick} role="img" aria-label="newConv" className="ptr chat-top-conv">
          📑
          </span>
        </div>
        <div />
      </div>
    );
  }
}
type m2p = {viewR: ViewStore};
type d2p = { onCloseChat(): void};
type ownProps = { infoClick: () => void};
type connectedProps = m2p&d2p&ownProps;

export default connect<m2p, d2p, ownProps, MergedStore>(
  (store: MergedStore) => ({ viewR: store.ViewReducer }), 
  { onCloseChat: () => display('home', 'home', '') }
)(ChatMenu);