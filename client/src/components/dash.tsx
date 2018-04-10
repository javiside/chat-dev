import * as React from 'react';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Main from './menu/content/main';
import Display from './display/display';
import { GetDash, GetChat, update, updateChat, display } from '../store/actions/actions';
import { ChatStore, ReceivingUserData, UserStore, IntlStore } from '../store';
import { LoginProps } from './index/login';
import { MergedStore } from '../store/reducers/rootReducer';
import '../css/dash.css';

interface DashState {
  loaded: boolean;
}
class Dash extends Component<connectedProps, DashState> {
  constructor(props: connectedProps) {
    super(props);
    this.state = { loaded: false };
  }
  async componentWillMount() {
    this.setState({ loaded: false });
    const user = await GetDash();
    if (user) {
      this.props.onReceivedData({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        contacts: user.contacts,
        conversations: user.conversations,
        invitations: user.invitations,
        convParts: user.convParts,
        avatar: user.avatar
      });
      const chatConvs = await GetChat();
      if (chatConvs) {
        this.props.onReceivedChatData(chatConvs);
        this.props.onLoadDash();
        this.setState({ loaded: true });
      }
    } else {
      this.props.history.push('/login');
    }
  }
  componentDidMount() {
    const { startIO } = require('../store/actions/socketActions');
    startIO();
  }
  render() {
    return (
      <div className="dash">
        {this.state.loaded ? (
          <Fragment>
            <Main />
            <Display />
          </Fragment>
        ) : (
          <div className="loading-container bold">
            <div className="dash-loader" />{this.props.IntlR.messages.loading}
          </div>
        )}
      </div>
    );
  }
}
type m2p = { IntlR: IntlStore};
type d2p = {
  onReceivedData(userData: ReceivingUserData): void;
  onReceivedChatData(chatData: ChatStore): void;
  onLoadDash(): void;
};
type connectedProps = m2p&d2p&LoginProps;

export default connect<m2p, d2p, connectedProps, MergedStore>(
  (store: MergedStore) => ({ IntlR: store.IntlReducer }), {
  onReceivedData: (userData: UserStore) => update(userData),
  onReceivedChatData: (chatData: ChatStore) => updateChat(chatData),
  onLoadDash: () => display('home', 'home', '')
})(Dash);
