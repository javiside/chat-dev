import * as React from 'react';
import { Component, Fragment } from 'react';
import ChatMenu from './chatMenu';
import ConvInfo from './convInfo';
import MessageScreen from './messageScreen';
import '../../css/display.css';

interface ChatState {
  conversation: string;
  messages: Array<string>;
  isInfoOpen: boolean;
}

export class Chat extends Component<{}, ChatState> {
  constructor(props: {}) {
    super(props);
    this.state = { conversation: '', messages: [], isInfoOpen: false };
    this.handleInfoClick = this.handleInfoClick.bind(this);
  }

  handleInfoClick() {
    this.setState({ isInfoOpen: !this.state.isInfoOpen });
  }
  render() {
    return (
      <Fragment>
        <ChatMenu infoClick={this.handleInfoClick} />
        {!this.state.isInfoOpen ?
          <MessageScreen isInfoOpen={this.state.isInfoOpen}/>
          : 
          <div className="divided-screen">
            <div className="messages-chat w-70"><MessageScreen isInfoOpen={this.state.isInfoOpen}/></div>
            <ConvInfo/>
          </div>
        }
      </Fragment>
    );
  }
}
