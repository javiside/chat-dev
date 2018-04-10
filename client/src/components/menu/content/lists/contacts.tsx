import * as React from 'react';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { display, changeView } from '../../../../store/actions/actions';
import Avatar from '../../../../images/avatar.png';
import { MergedStore } from '../../../../store/reducers/rootReducer';
import { UserStore, ViewStore } from '../../../../store';

// interface ContactListProps {
//   handleClick(e: React.MouseEvent<HTMLLIElement>): void;

// }

class ContactList extends Component<connectedProps, {}> {
  constructor(props: connectedProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e: React.MouseEvent<HTMLLIElement>) {
    this.props.showFriendProfile(this.props.viewR.display, this.props.viewR.convName, (e.target as HTMLLIElement).id );
    this.props.onOpenProfile();
  }
  render() {
    return (
      <Fragment>
        {/* Load contacts */}
        {this.props.userData.contacts.map((el, idx) => {
          return (
            <li
              key={idx}
              id={el._id}
              value={el.email}
              onClick={this.handleClick}
              className="convLi"
            >
              <span id={el._id} className="menu-avatar-c">
                <img
                  className="menu-avatar-inner-conv"
                  src={Avatar}
                  alt="avatar"
                  id={el._id}
                />
              </span>
              <div id={el._id} className="left-info">
                <span className="left-conv-name-text bold" id={el._id}>
                  <span id={el._id} className="long-text"> {el.email}</span>
                </span>
              </div>
            </li>
          );
        })}
      </Fragment>
    );
  }
}

type m2p = {  
  userData: UserStore;
  viewR: ViewStore;
};
type d2p = {
  showFriendProfile(display: string, convName: string, contId: string): void;
  onOpenProfile(): void;
};
type connectedProps = m2p&d2p;

export default connect<m2p, d2p, {}, MergedStore>(
  (store: MergedStore) => ({
    userData: store.UserReducer,
    viewR: store.ViewReducer
  }),
  {
    showFriendProfile: (disp: string, convN: string, friendId: string) => display(disp, convN, friendId),
    onOpenProfile: () => changeView('friend')
  }
)(ContactList);
