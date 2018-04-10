import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { loginCheck, GetDash } from '../../store/actions/actions';
import Footer from '../../containers/footer';
import logo from '../../images/logo.svg';
import Avatar from '../../images/avatar.png';
import { LocationState, Path } from 'history';
import { IntlStore } from '../../store';
import { connect } from 'react-redux';
import { MergedStore } from '../../store/reducers/rootReducer';

export interface History {
  push(path: Path, state?: LocationState): void;
}
export interface LoginProps extends History {
  history: History;
}

interface LoginState {
  email: string;
  password: string;
  msg: string;
}

class Login extends Component<connectedProps, LoginState> {
  intl = this.props.IntlR.messages;
  constructor(props: connectedProps) {
    super(props);
    this.state = { email: '', password: '', msg: '' };
    this.onHandleLogin = this.onHandleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.id === 'email') {
      this.setState({ email: e.target.value });
    }
    if (e.target.id === 'password') {
      this.setState({ password: e.target.value });
    }
  }
  async onHandleLogin(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    if (this.state.email === '' || this.state.password === '') {
      this.setState({ msg: this.intl.fillAll });
    } else {
      if (
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        .test(
          this.state.email
        )
      ) {
        const answer = await loginCheck(this.state.email, this.state.password);
        if (answer === 200) {
          this.props.history.push('/dash');
        } else {
          this.setState({ msg: answer });
        }
      } else {
        this.setState({ msg: this.intl.entValEmail });
      }
    }
  }
  async componentWillMount() {
    const user = await GetDash();
    if (user) {
      this.props.history.push('/dash');
    }
  }
  componentWillUpdate(nextProps: connectedProps) {
    this.intl = nextProps.IntlR.messages;
    if (this.state.msg !== '') {
      this.setState({msg: ''});
    }
  }
  render() {
    const intl = this.intl;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{intl.welcome}</h1>
        </header>
        <div className="wrapper">
          <div className="card card-container">
            <form className="form" action="./api/login" method="POST">
              <img className="profile-img-card" src={Avatar} alt="avatar" />
              <label className="sr-only" htmlFor="email">
                {intl.email}
              </label>
              <input
                className="form-control"
                id="email"
                name="email"
                type="email"
                required={true}
                placeholder={intl.email}
                value={this.state.email}
                onChange={this.handleChange}
              />
              <br />
              <label className="sr-only" htmlFor="password">
                {intl.password}
              </label>
              <input
                className="form-control"
                id="password"
                name="password"
                type="password"
                required={true}
                placeholder={intl.password}
                onChange={this.handleChange}
              />
              <div className="error-msg tshadow-1b">{this.state.msg} </div>
              <input
                type="submit"
                className="button b-blue"
                onClick={this.onHandleLogin}
                value={intl.submit}
              />
              <hr />
              <span className="small-text-under">
                {intl.dontHaveAc}
                <Link
                  to="/signup"
                  className="dis-b mt-1 tshadow-3w bold-over no_"
                >
                  {intl.signUp}
                </Link>
              </span>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
type m2p = { IntlR: IntlStore};
type connectedProps = LoginProps&m2p;
export default connect<m2p, {}, {}, MergedStore>( 
  (store: MergedStore) => ({ IntlR: store.IntlReducer })
)(Login);