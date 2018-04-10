import * as React from 'react';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { shallow, configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as moxios from 'moxios';
import { TestKeyboard } from '../components/display/keyboard';
import axios from 'axios';
import {
  update,
  updateChat,
  UPDATE,
  UPDATECHAT
} from '../store/actions/actions';
configure({ adapter: new Adapter() });

describe('Testing the keyboard component', () => {
  it('should update the input value/innerText when changing the state', () => {
    // Expect the value of the input element to be empty before typing
    const wrapper = shallow(<TestKeyboard />);
    expect(wrapper.find('.keyboard').prop('value')).equal('');

    // Expect the function onChange to be called when we trigger the change event
    const handleChangeSpy = sinon.spy(TestKeyboard.prototype, 'onChange');
    const event = { target: { text: 'Hi! change event!' } };
    const wrap = shallow(<TestKeyboard />);
    wrap.find('.keyboard').simulate('change', event);
    expect(handleChangeSpy.calledOnce).equal(true);

    // Expect the value of the input element to change when we change the state
    wrapper.setState({ text: 'Hi!, this is a new message' });
    expect(wrapper.find('.keyboard').prop('value')).equal(
      'Hi!, this is a new message'
    );
  });

  it('should trigger the onClick event when clicking the image button', () => {
    const handleClickSpy = sinon.spy(
      TestKeyboard.prototype,
      'handleSendMessage'
    );
    const wrapper = shallow(<TestKeyboard />);
    wrapper.find('.send-button').simulate('click');
    expect(handleClickSpy.called).equal(true);
  });
});

// Test redux stores (user and chat reducers)
describe('Updating user data/store, using user reducer', () => {
  it('should create an action to update the user first name string', () => {
    const newData = { firstname: 'Javier' };
    const action = {
      type: UPDATE,
      userData: newData
    };

    // Expect the new object to have the same props/values that we passed (==)
    expect(update(newData)).eql(action);

    // But also expect a NEW object (with the same props/values) (===)
    expect(update(newData)).not.equal(action);
  });

  it('should create an action to update the user contacts array', () => {
    const newData = {
      contacts: [
        {
          _id: '5ac2c914bbfebd5bf07b4fb1',
          name: 'a a',
          email: 'a@a.a'
        },
        {
          _id: '5ac356e7e14d9a414c589e69',
          name: 'w w',
          email: 'w@w.w'
        }
      ]
    };
    const action = {
      type: UPDATE,
      userData: newData
    };

    // Expect the new object to have the same props/values that we passed (==)
    expect(update(newData)).eql(action);

    // But also expect a NEW object (with the same props/values) (===)
    expect(update(newData)).not.equal(action);
  });
});

describe('Updating Chat data/store, using chat reducer', () => {
  it('should create an action to update the chat when receiving new messages', () => {
    // newData interface is already checked with typescript (must be an array of <Messages>)
    const newData = [
      {
        text: 'new Message',
        owner: '5ac356e7e14d9a414c589e70',
        ownerName: 'Jhon',
        conversation: '5ac356e7e14d9a414c589e85',
        date: new Date()
      },
      {
        text: 'Second Message',
        owner: '5ac356e7e14d9a414c589e90',
        ownerName: 'Juan',
        conversation: '5ac356e7e14d9a414c589e56',
        date: new Date()
      }
    ];
    const action = {
      type: UPDATECHAT,
      chatData: newData
    };

    // Expect the new object to have the same props/values that we passed (==)
    expect(updateChat(newData)).eql(action);

    // But also expect a NEW object (with the same props/values) (===)
    expect(updateChat(newData)).not.equal(action);
  });
});

describe('Testing axios calls', () => {
  describe('Using moxios', () => {
    beforeEach(() => {
      moxios.install();
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it('responds with status 200 if a valid email and password are passed (loginCheck())', (done: MochaDone) => {
      moxios.withMock(() => {
        let onFulfilled = sinon.spy();
        axios
          .post('/api/login', { email: 'a@a.a', password: 'a' })
          .then(onFulfilled);

        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.respondWith({ status: 200 }).then(() => {
            expect(onFulfilled.called).equal(true);
            done();
          });
        });
      });
    });

    it('responds with status 401 if an invalid email or password are passed (loginCheck())', (done: MochaDone) => {
      moxios.withMock(() => {
        let onFulfilled = sinon.spy();
        let onRejected = sinon.spy();
        axios
          .post('/api/login', { email: 'a@a.a', password: '' })
          .then(onFulfilled, onRejected);

        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.respondWith({ status: 401 })
          .then(
            () => {
              expect(onFulfilled.called).equal(false);
              expect(onRejected.called).equal(true);
              done();
            }
          );
        });
      });
    });

    it('responds with status 200 if a valid email is passed (addContact())', (done: MochaDone) => {
      moxios.withMock(() => {
        let onFulfilled = sinon.spy();
        axios
          .post('/api/contact', { email: 'friend@mail.com' })
          .then(onFulfilled);

        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.respondWith({ status: 200 }).then(() => {
            expect(onFulfilled.called).equal(true);
            done();
          });
        });
      });
    });
    it('responds with status 200 if a valid convId and text are passed (sendMessage())', (done: MochaDone) => {
      moxios.withMock(() => {
        let onFulfilled = sinon.spy();
        axios
          .post('/api/message', { currentConv: '5ac2ca2e81c3e33090cc176c', messageSent: 'Hi' })
          .then(onFulfilled);

        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.respondWith({ status: 200 }).then(() => {
            expect(onFulfilled.called).equal(true);
            done();
          });
        });
      });
    });
    
    it('responds with status 200 on logout (destroyToken())', (done: MochaDone) => {
      moxios.withMock(() => {
        let onFulfilled = sinon.spy();
        axios
          .get('/api/logout')
          .then(onFulfilled);

        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.respondWith({ status: 200 }).then(() => {
            expect(onFulfilled.called).equal(true);
            done();
          });
        });
      });
    });

  });
});
