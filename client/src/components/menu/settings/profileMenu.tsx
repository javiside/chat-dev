import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { changeView } from '../../../store/actions/actions';
import { ViewStore, IntlStore } from '../../../store';
import { MergedStore } from '../../../store/reducers/rootReducer';

class ProfileMenu extends Component<connectedProps> {
  constructor(props: connectedProps) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
  }
  handleBack() {
    this.props.onBack(
      this.props.viewR.current === 'profile' ?
      'home' : 'contacts'
    );
  }
  render() {  
    const intl = this.props.IntlR.messages;
    return (
      <div className="inner-menu">
        <span role="img" aria-label="back" onClick={this.handleBack} className="back ptr">🔙</span>
        <span 
          className="profile-text"
        >
          <strong>
            {this.props.viewR.current === 'profile' ? intl.profile : intl.friendProf}
          </strong>
        </span>
      </div>
    );
  }
}
type m2p = { 
  viewR: ViewStore,
  IntlR: IntlStore
};
type d2p = { onBack(to: string): void};
type connectedProps = m2p&d2p;

export default connect<m2p, d2p, {}, MergedStore>(
  store => ({
    viewR: store.ViewReducer,
    IntlR: store.IntlReducer
  }),  
  { onBack: (to) => changeView(to) }
)(ProfileMenu);