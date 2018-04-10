import * as React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';
import '../css/wrapper.css';
import Footer from './footer';
import { IntlStore } from '../store';
import { connect } from 'react-redux';
import { MergedStore } from '../store/reducers/rootReducer';

const Index = (props: m2p) => {
  const intl = props.IntlR.messages;
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">{intl.welcome}</h1>
      </header>
      <div className="wrapper">
        <div className="card card-container">
          <h1 className="m-0 pd-0 tshadow-3w">{intl.plsLogin}</h1>
          <Link to="/login" className="button b-blue">{intl.login}</Link>
          <Link to="/signup" className="dis-b mt-2 tshadow-3w">{intl.orSignUp}</Link>
        </div>
      </div>
      <Footer/>
    </div>
  );
};
type m2p = { IntlR: IntlStore};
export default connect<m2p, {}, {}, MergedStore>( 
  (store: MergedStore) => ({ IntlR: store.IntlReducer })
)(Index);