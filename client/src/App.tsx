import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Index from './containers/index';
import Login from './components/index/login';
import Signup from './components/index/signup';
import Dash from './components/dash';
import './css/App.css';
import { MergedStore } from './store/reducers/rootReducer';

class App extends React.Component<{}, MergedStore> {
  constructor(props: {}) {
    super(props);

    this.onUnload = this.onUnload.bind(this);
  }
  onUnload(event: BeforeUnloadEvent) {
    event.returnValue = 'Are you sure to leave this page?';
  }
  componentDidMount() {
    window.addEventListener('beforeunload', this.onUnload);
  }
  componentWillUnmount() {
    const {endIO} = require('./store/actions/socketActions');
    endIO();
    window.removeEventListener('beforeunload', this.onUnload);

  }
  render() {
    return (
      <Router>
        <React.Fragment>
          <Route exact={true} path="/" component={Index} />
          <Route exact={true} path="/login" component={Login} />
          <Route exact={true} path="/signup" component={Signup} />
          <Route path="/dash" component={Dash} />
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
