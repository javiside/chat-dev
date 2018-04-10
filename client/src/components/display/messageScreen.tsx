import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import Keyboard from './keyboard';
import { MergedStore } from '../../store/reducers/rootReducer';
import { ViewStore, UserStore, IntlStore, ChatStore } from '../../store';

class MessageScreen extends Component<m2p, {}> {
  protected comp: HTMLSpanElement;
  scrollToBottom = () => {
    this.comp.scrollIntoView();
  }
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  render() {
    return (
      <div className="messages-chat">
        <div className="messages-window">
          {this.props.chatR.map((msg, idx) => {
            return msg.conversation === this.props.viewR.display ? (
              <li
                key={idx}
                className={
                  'message bubbles ' +
                  (msg.owner === this.props.userData._id ? 'mine' : 'them')
                }
              >
                {msg.text}
                <hr/>
                <div className="bubble-date">
                  <span className="bubble-name">{msg.ownerName + ' '}</span>{msg.date
                    .toLocaleString()
                    .substr(2, 14)
                    .replace('T', ' ')}
                </div>
              </li>
            ) : null;
          })}
          <span
            ref={el => {
              if (el) {
                this.comp = el;
              }
            }}
            className="date-span"
          >
            {new Date().toLocaleString()}
          </span>
        </div>
        <Keyboard />
      </div>
    );
  }
}

type m2p = {
  viewR: ViewStore;
  userData: UserStore;
  chatR: ChatStore;
  IntlR: IntlStore;
  isInfoOpen: boolean;
};
export default connect((store: MergedStore) => ({
  viewR: store.ViewReducer,
  userData: store.UserReducer,
  chatR: store.ChatReducer,
  IntlR: store.IntlReducer
}))(MessageScreen);
