import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { singupCheck, GetDash } from '../../store/actions/actions';
import Footer from '../../containers/footer';
import logo from '../../images/logo.svg';
import Avatar from '../../images/avatar.png';
import { LoginProps } from './login';
import { IntlStore } from '../../store';
import { connect } from 'react-redux';
import { MergedStore } from '../../store/reducers/rootReducer';

interface SignupProps extends LoginProps {}
interface SignupState {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  msg: string;
}

class Signup extends Component<connectedProps, SignupState> {
  intl = this.props.IntlR.messages;
  constructor(props: connectedProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      msg: ''
    };
    this.onHandleSignup = this.onHandleSignup.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.id === 'email') {
      this.setState({ email: e.target.value });
    }
    if (e.target.id === 'password') {
      this.setState({ password: e.target.value });
    }
    if (e.target.id === 'firstname') {
      this.setState({ firstname: e.target.value });
    }
    if (e.target.id === 'lastname') {
      this.setState({ lastname: e.target.value });
    }
  }
  async onHandleSignup(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    if (
      this.state.firstname.trim() === '' ||
      this.state.lastname.trim() === '' ||
      this.state.email === '' ||
      this.state.password === ''
    ) {
      this.setState({ msg: this.intl.fillAll });
    } else {
      if (
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
          this.state.email
        )
      ) {
        const answer = await singupCheck(
          this.state.email.trim().toLowerCase(),
          this.state.password,
          this.state.firstname.trim(),
          this.state.lastname.trim()
        );
        if (answer === 200) {
          await this.props.history.push('/dash');
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
            <form className="form" action="./api/signup" method="POST">
              {/* <h1>Login</h1> */}
              <img className="profile-img-card" src={Avatar} alt="avatar" />
              <label className="sr-only" htmlFor="firstname">
              {intl.fName}
              </label>
              <input
                className="form-control"
                id="firstname"
                name="firstname"
                type="text"
                required={true}
                placeholder={intl.fName}
                onChange={this.handleChange}
              />
              <label className="sr-only" htmlFor="lastname">
              {intl.lName}
              </label>
              <input
                className="form-control"
                id="lastname"
                name="lastname"
                type="text"
                required={true}
                placeholder={intl.lName}
                onChange={this.handleChange}
              />
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
                onChange={this.handleChange}
              />
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
              <div className="error-msg">{this.state.msg}</div>
              <input
                type="submit"
                value={intl.signUp}
                className="button b-blue"
                onClick={this.onHandleSignup}
              />
              <hr />
              <span className="small-text-under">
                {intl.haveAc}
                <Link
                  to="/login"
                  className="dis-b mt-1 tshadow-3w bold-over no_"
                >
                  {intl.login}
                </Link>
              </span>
            </form>
            <span className="lang-span">{this.props.IntlR.locale}</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
type m2p = { IntlR: IntlStore};
type connectedProps = SignupProps&m2p;
export default connect<m2p, {}, {}, MergedStore>( 
  (store: MergedStore) => ({ IntlR: store.IntlReducer })
)(Signup);