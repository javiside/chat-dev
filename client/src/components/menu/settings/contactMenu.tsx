import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { changeView, addContact, update } from '../../../store/actions/actions';
import { MergedStore } from '../../../store/reducers/rootReducer';
import { ReceivingUserData, UserStore, IntlStore } from '../../../store';

interface AddContState {
  email: string;
  msg: string;
}

class AddContactMenu extends Component<connectedProps, AddContState> {
  constructor(props: connectedProps) {
    super(props);
    this.state = { email: '', msg: '' };
    this.onAddContact = this.onAddContact.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.id === 'email') {
      this.setState({ email: e.target.value });
    }
  }
  async onAddContact(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    const intl = this.props.IntlR.messages;
    if (
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        this.state.email
      )
    ) {
      var answer = await addContact(this.state.email);
      if (answer.status === 200) {
        this.props.onReceivedData({ contacts: [answer.newContact] });
        this.setState({ email: '', msg: '' });
      } else {
        this.setState({ msg: answer });
      }
    } else {
      this.setState({ msg: intl.emailNoValid });
    }
  }
  render() {
    const intl = this.props.IntlR.messages;
    return (
      <div className="inner-menu">
        <span
          role="img"
          aria-label="back"
          onClick={this.props.onBack}
          className="back ptr"
        >
          🔙
        </span>
        <div className="close-add" onClick={this.props.onBack} />
        <form action="/api/contact" method="POST">
          <input type="submit" value={intl.add} onClick={this.onAddContact} />
          <span className="error-msg addC-err">{this.state.msg}</span>
          <input
            type="email"
            name="email"
            id="email"
            value={this.state.email}
            onChange={this.handleChange}
            required={true}
            placeholder={intl.name + '@' + intl.email + '.com'}
          />
        </form>
      </div>
    );
  }
}
type m2p = {
  userData: UserStore;
  IntlR: IntlStore;
};
type d2p = {
  onReceivedData({  }: ReceivingUserData): void;
  onBack(): void;
};
type connectedProps = m2p & d2p;
export default connect<m2p, d2p, {}, MergedStore>(
  (store: MergedStore) => ({
    userData: store.UserReducer,
    IntlR: store.IntlReducer
  }),
  {
    onReceivedData: (userData: ReceivingUserData) => update(userData),
    onBack: () => changeView('home')
  }
)(AddContactMenu);
