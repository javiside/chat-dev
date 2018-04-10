import * as React from 'react';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// import { TransitionGroup } from 'react-transition-group';
import Settings from '../settings/index';
import Profile from './profile';
import Friend from './friend';
import GetList from './getList';
// import { Fade } from '../../transitions';
import '../../../css/main.css';
import '../../../css/transitions.css';
import { ViewStore, UserStore, IntlStore } from '../../../store';
import { MergedStore } from '../../../store/reducers/rootReducer';

interface MainDashProps {
  viewR: ViewStore;
  userData: UserStore;
  intlR: IntlStore;
}
class MainDash extends Component <MainDashProps, {}> {
  
  render() {    
    return (
      <div className="main">
        <div className="main-top">
          <Settings />
        </div>
            {this.props.viewR.current === 'profile' ?
              <Fragment><Profile /><GetList /></Fragment>
              :
              this.props.viewR.current === 'friend' ?
                <Fragment><Friend /><GetList /></Fragment>
                :
              <GetList />
            }
      </div>
    );
  }
}
export default connect((store: MergedStore) => ({
  viewR: store.ViewReducer,
  userData: store.UserReducer,
  intlR: store.IntlReducer
}))(MainDash);