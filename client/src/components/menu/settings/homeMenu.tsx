import * as React from 'react';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  changeView,
  destroyToken,
  logout
} from '../../../store/actions/actions';
import { Link } from 'react-router-dom';
import Avatar from '../../../images/avatar.png';
// import { endIO } from '../../../store/actions/socketActions';
import { MergedStore } from '../../../store/reducers/rootReducer';
import { UserStore, IntlStore } from '../../../store';
import * as flags from '../../../images/flags/index';
import { selectedLocale } from '../../../store/actions/intlActions';

interface HomeMenuState {
  opsActive: boolean;
}

class HomeMenu extends Component<connectedProps, HomeMenuState> {
  constructor(props: connectedProps) {
    super(props);
    this.state = { opsActive: false };
    this.onToggle = this.onToggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.onChangeLocale = this.onChangeLocale.bind(this);
  }
  onToggle() {
    this.setState({ opsActive: !this.state.opsActive });
  }
  async handleLogout() {
    const answer = await destroyToken();
    if (answer === 200) {
      const { endIO } = require('../../../store/actions/socketActions');
      endIO();
      this.props.onLogout();
    }
  }
  onChangeLocale(e: React.MouseEvent<HTMLImageElement>) {
    this.props.onChangeLocale((e.target as HTMLImageElement).id);
    this.setState({ opsActive: false });
  }
  render() {
    const intl = this.props.IntlR.messages;
    let notiNum = this.props.userData.invitations.length;
    return (
      <Fragment>
        <img
          className="menu-avatar"
          onClick={this.props.onOpenProfile}
          src={this.props.userData.avatar || Avatar}
          alt="avatar"
        />
        <span
          onClick={this.props.onNewConv}
          role="img"
          aria-label="newConv"
          className="ptr tooltip"
        >
          💭
          <span className="tooltiptext">{intl.conversations}</span>
        </span>
        <span
          onClick={this.props.onOpenInv}
          role="img"
          aria-label="Invitations"
          className="ptr tooltip"
        >
          {notiNum > 0 ? '⭐️❗️' : '✔️'}
          <span className={notiNum > 0 ? 'noti-badge' : 'hidden'}>
            {notiNum > 99 ? '99+' : notiNum > 0 ? notiNum : ''}
          </span>
          <span className="tooltiptext">{intl.invitations}</span>
        </span>

        <div className="settings-contact">
          <Fragment>
            <span
              role="img"
              aria-label="settings"
              className={
                'tooltip settings ' + (this.state.opsActive ? 'active' : '')
              }
              tabIndex={0}
              onClick={this.onToggle}
            >
              ⚙️
              <span className="tooltiptext t-sett">{intl.settings}</span>
            </span>
            <span
              role="img"
              aria-label="friends"
              className="tooltip friends"
              tabIndex={0}
              onClick={this.props.onNewContact}
            >
              👥
              <span className="tooltiptext">{intl.friends}</span>
            </span>
            <ul className="settings-list">
              <li onClick={this.props.onOpenProfile}>{intl.changeProf}</li>
              <li>
                <Link
                  to="/login"
                  className="no_ c-red w-all dis-lineb"
                  onClick={this.handleLogout}
                >
                  {intl.logout}
                </Link>
              </li>
              <hr />
              <li className="flags-li">
                <img
                  src={flags.cn}
                  alt="cn"
                  id="cn"
                  onClick={this.onChangeLocale}
                  className="flag-icon"
                />
                <img
                  src={flags.en}
                  alt="en"
                  id="en"
                  onClick={this.onChangeLocale}
                  className="flag-icon"
                />
                <img
                  src={flags.es}
                  alt="es"
                  id="es"
                  onClick={this.onChangeLocale}
                  className="flag-icon"
                />
                <img
                  src={flags.fr}
                  alt="fr"
                  id="fr"
                  onClick={this.onChangeLocale}
                  className="flag-icon"
                />
                <img
                  src={flags.ge}
                  alt="ge"
                  id="ge"
                  onClick={this.onChangeLocale}
                  className="flag-icon"
                />
                <img
                  src={flags.in}
                  alt="in"
                  id="in"
                  onClick={this.onChangeLocale}
                  className="flag-icon"
                />
                <img
                  src={flags.it}
                  alt="it"
                  id="it"
                  onClick={this.onChangeLocale}
                  className="flag-icon"
                />
                <img
                  src={flags.jp}
                  alt="jp"
                  id="jp"
                  onClick={this.onChangeLocale}
                  className="flag-icon"
                />
                <img
                  src={flags.kl}
                  alt="kl"
                  id="kl"
                  onClick={this.onChangeLocale}
                  className="flag-icon"
                />
                <img
                  src={flags.kr}
                  alt="kr"
                  id="kr"
                  onClick={this.onChangeLocale}
                  className="flag-icon"
                />
                <img
                  src={flags.pt}
                  alt="pt"
                  id="pt"
                  onClick={this.onChangeLocale}
                  className="flag-icon"
                />
                <img
                  src={flags.ru}
                  alt="ru"
                  id="ru"
                  onClick={this.onChangeLocale}
                  className="flag-icon"
                />
              </li>
            </ul>
          </Fragment>
        </div>
      </Fragment>
    );
  }
}
type m2p = {
  userData: UserStore;
  IntlR: IntlStore;
};
type d2p = {
  onNewContact(): void;
  onNewConv(): void;
  onOpenInv(): void;
  onOpenProfile(): void;
  onLogout(): void;
  onChangeLocale(locale: string): void;
};
type connectedProps = m2p & d2p;
export default connect<m2p, d2p, {}, MergedStore>(
  (store: MergedStore) => ({
    userData: store.UserReducer,
    IntlR: store.IntlReducer
  }),
  {
    onOpenProfile: () => changeView('profile'),
    onNewConv: () => changeView('conversations'),
    onOpenInv: () => changeView('invitations'),
    onNewContact: () => changeView('contacts'),
    onLogout: () => logout(),
    onChangeLocale: locale => selectedLocale(locale)
  }
)(HomeMenu);
