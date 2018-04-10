import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { sendMessage, updateChat } from '../../store/actions/actions';
import sendButton from '../../images/send.png';
import { ViewStore, ChatStore, UserStore } from '../../store';
import { MergedStore } from '../../store/reducers/rootReducer';

interface KeyboardState {
  text: string;
  placeholder: string;
}

class Keyboard extends Component<connectedProps, KeyboardState> {
  constructor(props: connectedProps) {
    super(props);
    this.state = { text: '', placeholder: 'Type a message' };
    this.onChange = this.onChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }
  async handleSendMessage() {
    if (this.state.text !== '') {
      let currentConv = this.props.viewR.display;
      let messageSent = this.state.text;
      let owner = this.props.userData.firstname;

      let answer: ChatStore = await sendMessage(currentConv, messageSent, owner);
      if (answer) {
        this.props.onReceivedChatData(answer);

        const { addMessage } = require('../../store/actions/socketActions');
        addMessage(currentConv, messageSent);
        this.setState({ text: '', placeholder: 'Type a message' });
      }
    } else {
      this.setState({ placeholder: 'Please type some text' });
    }
  }
  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ text: e.target.value });
  }
  handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      this.handleSendMessage();
    }
  }
  render() {
    return (
      <div className="chat-bottom">
        <span role="img" aria-label="more" className="kb-emojis ptr">
          ➕
        </span>
        <span role="img" aria-label="emojis" className="kb-emojis ptr">
          😃
        </span>
        <input
          type="text"
          onChange={this.onChange}
          onKeyDown={this.handleKeyDown}
          value={this.state.text}
          className="keyboard"
          placeholder={this.state.placeholder}
        />
        <img
          onClick={this.handleSendMessage}
          src={sendButton}
          alt="sendButton"
          className="send-button ptr"
        />
      </div>
    );
  }
}
export const TestKeyboard = Keyboard as React.ComponentClass<{}>;

type m2p = { viewR: ViewStore; userData: UserStore };
type d2p = { onReceivedChatData(chatData: ChatStore): void };
type connectedProps = m2p & d2p;

export default connect<m2p, d2p, {}, MergedStore>(
  (store: MergedStore) => ({
    viewR: store.ViewReducer,
    userData: store.UserReducer
  }),
  { onReceivedChatData: (chatData: ChatStore) => updateChat(chatData) }
)(Keyboard);
