import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import HomeMenu from './homeMenu';
import ProfileMenu from './profileMenu';
import NewConvMenu from './newConvMenu';
import InvitationMenu from './invitationMenu';
import ContactMenu from './contactMenu';

import '../../../css/settings.css';
import { ViewRProps } from '../../../store';
import { MergedStore } from '../../../store/reducers/rootReducer';

interface SettingsProps extends ViewRProps {}

class Settings extends Component<SettingsProps> {
  render() {
    let view = this.props.viewR.current;
    return view === 'home' ? (
      <HomeMenu />
    ) : view === 'profile' || view === 'friend' ? (
      <ProfileMenu/>
    ) : view === 'conversations' ? (
      <React.Fragment><NewConvMenu /></React.Fragment>
    ) : view === 'contacts' ? (
      <ContactMenu />
    ) : (
      <InvitationMenu />
    );
  }
}
export default connect((store: MergedStore) => ({
  viewR: store.ViewReducer
}))(Settings);
