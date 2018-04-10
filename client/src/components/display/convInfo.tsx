import * as React from 'react';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Avatar from '../../images/avatar.png';
import { MergedStore } from '../../store/reducers/rootReducer';
import {
  ViewStore,
  ReceivingUserData,
  IntlStore,
  Participants,
  Contact,
  UserStore
} from '../../store';
import { addToConv, update , addContact } from '../../store/actions/actions';
// import { addToConv } from '../../store/actions/actions';

type ConvInfoState = { addCont: string };

class ConvInfo extends Component<connectedProps, ConvInfoState> {
  constructor(props: connectedProps) {
    super(props);
    this.state = { addCont: 'select' };
    this.onAddChange = this.onAddChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleAddContact = this.handleAddContact.bind(this);
  }
  onAddChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ addCont: e.target.value });
  }
  async handleAdd(e: React.MouseEvent<HTMLDivElement>) {
    if (this.state.addCont !== 'select') {
      let answer: ReceivingUserData = await addToConv(
        this.props.viewR.display,
        this.state.addCont
      );
      if (answer) {
        this.props.onReceivedData({ addedToConv: answer.addedToConv });
      }
    }
  }
  async handleAddContact(e: React.MouseEvent<HTMLDivElement>) {
    let email = (e.target as HTMLDivElement).id;
    let answer = await addContact(email);
    if (answer.status === 200) {
      this.props.onReceivedData({ contacts: [answer.newContact] });
    } 
  }

  render() {
    let conv = this.props.viewR.display;
    let cParts: Array<Participants> = this.props.userData.convParts;
    let myCont: Array<string> = this.props.userData.contacts.map(
      (c: Contact) => c.email
    );
    const intl = this.props.IntlR.messages;
    return (
      <div className="conv-info w-30">
        <div className="info-avatar-wrap">
          <img className="menu-avatar-info" src={Avatar} alt="avatarr" />
        </div>
        <span className="info-text">
          <strong>{this.props.viewR.convName}</strong>
        </span>
        <hr className="w-80" />
        <ul className="parts-ul">
          <li className="parts-li c-red">{intl.participants}</li>
          {cParts.map((par, idx) => {
            if (par[conv]) {
              let alreadyInConv = par[conv].map(p => p.email);
              let canAdd: Array<string> = myCont.filter(
                myC => alreadyInConv.indexOf(myC) < 0
              );
              let notMyC = par[conv]
                .map(allC => allC.email)
                .filter(
                  not =>
                    myCont.indexOf(not) < 0 && not !== this.props.userData.email
                );
              return (
                <Fragment key={idx}>
                  {par[conv].map((user, idxx) => (
                    <li key={idxx}>
                      <div key={idxx} className="all-parts">
                        {
                          <div className="participants">
                            {user.admin ? '⭐️' : ''}
                            <span>{user.firstname + ' ' + user.lastname}</span>
                            <div>{user.email}</div>
                          </div>
                        }
                        {notMyC.indexOf(user.email) >= 0 ? (
                          <div
                            id={user.email}
                            onClick={this.handleAddContact}
                            className="button b-blue"
                          >
                            Add
                          </div>
                        ) : null}
                      </div>
                    </li>
                  ))}
                  {canAdd.length > 0 ? (
                    <li className="parts-li c-cyan">
                      {intl.add}:
                      <select
                        onChange={this.onAddChange}
                        value={this.state.addCont}
                        className="add-select"
                      >
                        <option value="select" />
                        {canAdd.map((addCont, addId) => (
                          <option key={addId} value={addCont} className="ptr">
                            {addCont}
                          </option>
                        ))}
                      </select>
                      <div onClick={this.handleAdd} className="button b-blue">
                        {intl.add}
                      </div>
                    </li>
                  ) : null}
                </Fragment>
              );
            }
            return null;
          })}
        </ul>
      </div>
    );
  }
}
type m2p = {
  viewR: ViewStore;
  userData: UserStore;
  IntlR: IntlStore;
};
type d2p = {
  onReceivedData(userData: ReceivingUserData): void;
};
type connectedProps = m2p & d2p;
export default connect<m2p, d2p, {}, MergedStore>(
  (store: MergedStore) => ({
    viewR: store.ViewReducer,
    userData: store.UserReducer,
    IntlR: store.IntlReducer
  }),
  { onReceivedData: (userData: ReceivingUserData) => update(userData) }
)(ConvInfo);
