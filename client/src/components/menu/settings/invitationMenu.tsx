import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { changeView } from '../../../store/actions/actions';
import { MergedStore } from '../../../store/reducers/rootReducer';
import { IntlStore } from '../../../store';

class InvitationMenu extends Component<connectedProps> {
  render() {
    return (
      <div className="inner-menu">
        <span role="img" aria-label="back" onClick={this.props.onBack} className="back ptr">🔙</span>
        <span className="profile-text"><strong>{this.props.IntlR.messages.invitations}</strong></span>
      </div>
    );
  }
}
type m2p = { IntlR: IntlStore };
type d2p = { onBack(): void };
type connectedProps = m2p&d2p;
export default connect<m2p, d2p, {}, MergedStore>(
  (store: MergedStore) => ({
    IntlR: store.IntlReducer
  }),  
  { onBack: () => changeView('home') }
)(InvitationMenu);