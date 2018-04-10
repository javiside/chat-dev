import * as openSocket from 'socket.io-client';
import { store } from '../../index';
import { update, updateChat, online } from './actions';
import { Message, Conversation, Invitations } from '../../store';

const io = openSocket('http://localhost:4000');
// Receiving events
export const startIO = () => {
  io.open();
  io.on('invSent', (newInv: Invitations) => {
    store.dispatch(update({ invitations: newInv }));
  });

  io.on('acceptedConv', (convMsgs: Array<Message>) => {
    console.log(convMsgs);
    // store.dispatch(updateChat(convMsgs));
  });

  io.on('msgSent', (newMsg: Message) => {
    store.dispatch(updateChat([newMsg]));
  });

  io.on('userOnline', (user: string, email: string) => {
    store.dispatch(online(user + '(' + email + ')'));
  });

  io.on('updateLastMsg', (conv: string, lastMessage: string) => {
    store.dispatch(
      update({
        lastMessage: {
          [conv]:
            new Date().toLocaleTimeString().replace(/:\d{2}\s/, ' ') +
            ': ' +
            lastMessage
        }
      })
    );
  });

  io.emit('login');
};
// Trigger events
export const joinNewConv = (conv: Conversation) => {
  io.emit('newConv', conv._id);
};
export const addMessage = (conver: string, text: string) => {
  io.emit('newMessage', conver, text);
};
export const newInvitation = (convName: string, userList: Array<string>) => {
  io.emit('newInv', convName, userList);
};

export const endIO = () => {
  io.emit('logout');
  io.removeAllListeners();
  io.emit('disconnect');
};
