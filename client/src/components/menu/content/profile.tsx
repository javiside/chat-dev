import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { updateMe, update, changeAvatar } from '../../../store/actions/actions';
import Avatar from '../../../images/avatar.png';
import '../../../css/profile.css';
import { UserStore, ReceivingUserData, IntlStore } from '../../../store';
import { MergedStore } from '../../../store/reducers/rootReducer';

interface ProfileState {
  shouldSave: boolean;
  firstname: string;
  lastname: string;
  msg: string;
}
export interface AvFile extends File {}

class Profile extends Component<connectedProps, ProfileState> {
  constructor(props: connectedProps) {
    super(props);
    this.state = {
      shouldSave: false,
      firstname: '',
      lastname: '',
      msg: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }
  /* Update values if we open the profile After the data has been loaded on the global store */
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ msg: '' });
    if (e.target.id === 'firstname') {
      this.setState({ firstname: e.target.value });
    }
    if (e.target.id === 'lastname') {
      this.setState({ lastname: e.target.value });
    }
    this.setState({ shouldSave: true });
  }
  componentWillMount() {
    let uData = this.props.userData;
    this.setState({
      firstname: uData.firstname,
      lastname: uData.lastname
    });
  }
  async handleSubmit() {
    let uData = this.props.userData;
    let doneMsg: string = this.props.IntlR.messages.infoUpdated;
    if (
      this.state.firstname !== uData.firstname ||
      this.state.lastname !== uData.lastname
    ) {
      var answer = await updateMe(this.state.firstname, this.state.lastname);
      if (answer.status === 200) {
        this.props.onReceivedData({
          firstname: answer.firstname,
          lastname: answer.lastname
        });
        this.setState({ msg: doneMsg, shouldSave: false });
      }
    } else {
      this.setState({ msg: answer });
    }
  }
  handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    let reader = new FileReader();
    let file = e.target.files![0];
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      let answer = await changeAvatar(reader.result);
      if (answer === 200) {
        this.props.onReceivedData({
          avatar: reader.result
        });
        // this.props.onReceivedData({ avatar: reader.result });
      }
    };

    // send file to server here the way you need
  }
  render() {
    const intl = this.props.IntlR.messages;
    return (
      <div className="main-profile">
        <fieldset className="menu-fs-profile">
          <div className="profile-data">
            <img
              className="menu-avatar-profile"
              src={this.props.userData.avatar || Avatar}
              alt="avatarr"
            />
             <label htmlFor="files" className="button b-blue">{intl.selectImage}</label>
            <input id="files" type="file" className="hidden" onChange={this.handleFileUpload}/>
            <hr className="w-80" />

            <strong className="strong-profile"> {intl.fName}: </strong>
            <input
              type="text"
              value={this.state.firstname}
              id="firstname"
              onChange={this.handleChange}
              autoComplete="off"
              className="input-profile"
            />

            <strong className="strong-profile">{intl.lName}:</strong>
            <input
              type="text"
              value={this.state.lastname}
              id="lastname"
              onChange={this.handleChange}
              autoComplete="off"
              className="input-profile"
            />

            <strong className="strong-profile">{intl.email}:</strong>
            <input
              type="email"
              disabled={true}
              readOnly={true}
              value={this.props.userData.email}
              id="email"
              className="input-profile user-email"
            />

            <strong className="strong-profile" />

            <span className="scs-msg">{this.state.msg}</span>
            <button
              disabled={!this.state.shouldSave}
              onClick={this.handleSubmit}
              className="save-profile"
            >
              {intl.save}
            </button>
          </div>
        </fieldset>
      </div>
    );
  }
}
type m2p = {
  userData: UserStore;
  IntlR: IntlStore;
};
type d2p = {
  onReceivedData({  }: ReceivingUserData): void;
};
type connectedProps = m2p & d2p;
export default connect<m2p, d2p, {}, MergedStore>(
  (store: MergedStore) => ({
    userData: store.UserReducer,
    IntlR: store.IntlReducer
  }),
  {
    onReceivedData: (userData: ReceivingUserData) => update(userData)
  }
)(Profile);
