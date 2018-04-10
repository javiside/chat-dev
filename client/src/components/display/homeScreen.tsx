import * as React from 'react';
import logo from '../../images/logo.svg';
import { connect } from 'react-redux';
import { MergedStore } from '../../store/reducers/rootReducer';
import { IntlStore } from '../../store';

const HomeScreen = (props: m2p) => {
  return (
    <div className="home-screen">
      <div className="home-content">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">{props.IntlR.messages.welcome}</h1>
      </div>
    </div>
  );
};
type m2p = { IntlR: IntlStore};
export default connect<m2p, {}, {}, MergedStore>( 
  (store: MergedStore) => ({ IntlR: store.IntlReducer })
)(HomeScreen);