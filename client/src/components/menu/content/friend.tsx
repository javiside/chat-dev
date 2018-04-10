import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import Avatar from '../../../images/avatar.png';
import '../../../css/profile.css';
import {
  UserStore,
  ViewStore,
  IntlStore,
  ReceivingUserData
} from '../../../store';
import { MergedStore } from '../../../store/reducers/rootReducer';
import { deleteContact, update, changeView } from '../../../store/actions/actions';

interface FriendState {
  fullName: string;
  email: string;
  avatar: string | undefined;
}

class Friend extends Component<connectedProps, FriendState> {
  constructor(props: connectedProps) {
    super(props);
    this.state = { fullName: '', email: '', avatar: '' };
    this.handleDelete = this.handleDelete.bind(this);
  }
  async handleDelete() {
    const answer = await deleteContact(this.props.viewR.friend);
    if (answer.status === 200) {
      this.props.onReceivedData({ delCont: answer.data.delCont });
      this.props.ondelContact();
    }
  }
  componentWillMount() {
    for (var friend of this.props.userData.contacts) {
      if (friend._id === this.props.viewR.friend) {
        this.setState({ fullName: friend.name, email: friend.email, avatar: friend.avatar });
      }
    }
  }
  render() {
    const intl = this.props.IntlR.messages;
    return (
      <div className="main-profile">
        <fieldset className="menu-fs-profile">
          <div className="profile-data">
            <img className="menu-avatar-profile" src={this.state.avatar || Avatar} alt="avatarr" />

            <hr className="w-80" />

            <strong className="strong-profile"> {intl.fullName}: </strong>
            <input
              type="text"
              disabled={true}
              readOnly={true}
              value={this.state.fullName}
              id="firstname"
              className="input-profile"
            />

            <strong className="strong-profile">{intl.email}:</strong>
            <input
              type="email"
              disabled={true}
              readOnly={true}
              value={this.state.email}
              id="email"
              className="input-profile user-email"
            />

            <strong className="strong-profile" />
            <span onClick={this.handleDelete} className="button b-red">
              {intl.delete}
            </span>
          </div>
        </fieldset>
      </div>
    );
  }
}
type m2p = {
  userData: UserStore;
  viewR: ViewStore;
  IntlR: IntlStore;
};
type d2p = {
  onReceivedData(userData: ReceivingUserData): void;
  ondelContact(): void;
};
type connectedProps = m2p&d2p;
export default connect<m2p, d2p, {}, MergedStore>(
  (store: MergedStore) => ({
    userData: store.UserReducer,
    viewR: store.ViewReducer,
    IntlR: store.IntlReducer
  }),
  { onReceivedData: (userData: ReceivingUserData) => update(userData),
    ondelContact: () => changeView('contacts') }
)(Friend);
