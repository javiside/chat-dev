import * as React from 'react';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ConvList from './lists/conversations';
import InvList from './lists/invitations';
import ContactList from './lists/contacts';
import '../../../css/array.css';
import { MergedStore } from '../../../store/reducers/rootReducer';
import { ViewStore } from '../../../store';

interface GetListProps {
  viewR: ViewStore;
}

class GetList extends Component<GetListProps, {}> {
  /* If the current view is home or profile, load conversations,
   * else load the invitations or contacts list
  */
  render() {
    let current = this.props.viewR.current;
    return (
      <ul className="array-list">
        {current === 'contacts' ?
          <ContactList />
          : 
          <Fragment>
            {current === 'invitations' ? 
              <InvList /> 
              : 
              <ConvList />
            }
          </Fragment>
        }
      </ul>
    );
  }
}
export default connect((store: MergedStore) => ({
  viewR: store.ViewReducer
}))(GetList);
