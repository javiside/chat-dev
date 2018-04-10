import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import HomeScreen from './homeScreen';
import { Chat } from './chat';
import '../../css/display.css';
import { ViewStore, IntlStore } from '../../store';
import { MergedStore } from '../../store/reducers/rootReducer';
import { online } from '../../store/actions/actions';

class Display extends Component<mergedProps> {
  render() {
    let uOnline = this.props.viewR.userOnline;
    const intl = this.props.Intl.messages;
    return (
      <div className="display">
        <span className={'online-notif ' + (uOnline !== '' ? 'h-4per' : 'h-0')}>
          <span
            role="img"
            aria-label="delete"
            onClick={this.props.onClosedNoti}
            className="close-noti"
          >
            ❌
          </span>
          {uOnline + (uOnline !== '' ? intl.online : '')}
        </span>
        {this.props.viewR.display === 'home' ? <HomeScreen /> : <Chat />}
      </div>
    );
  }
}
type m2p = { viewR: ViewStore; Intl: IntlStore };
type d2p = { onClosedNoti: () => void };
type mergedProps = m2p&d2p;
export default connect<m2p, d2p, {}, MergedStore>(
  (store: MergedStore) => ({
    viewR: store.ViewReducer,
    Intl: store.IntlReducer
  }),
  { onClosedNoti: () => online('') }
)(Display);
