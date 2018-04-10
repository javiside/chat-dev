import io from '../server';
import mongoose from 'mongoose';
import SocketIO from 'socket.io';
import jwt from 'jsonwebtoken';
import { IUserModel } from './models/user';
import { IConvModel } from './models/conversation';
import { config } from './config/main';
import { User } from './models/user';
import { Conversation } from './models/conversation';
import { Message, IMessageModel } from './models/message';
let ObjectId = mongoose.Types.ObjectId;

interface IMyToken {
  id: string;
}

const getCookie = (str: string | null) => {
  if (str === null || str === undefined || str.indexOf('token=') < 0) {
    return null;
  } else {
    const cookie = str.split('token=')[1].split(';')[0];
    return cookie;
  }
};
interface allClientsList {
  [client: string]: SocketIO.Socket;
}
let allClients: allClientsList = {};
io.on('connection', (socket: SocketIO.Socket) => {
  socket.on('login', async () => {
    // extract the token from the cookie
    const cookie = await getCookie(socket.request.headers.cookie);
    if (cookie !== null) {
      // Decrypt the cookie
      const userId = await (jwt.verify(await cookie, config.secret) as IMyToken)
        .id;

      // Find the users conversations/rooms (id was in the encrypted token)
      User.findById(await userId, (err: Error, user: IUserModel) => {
        if (err) return new Error('Authentication Error');
        for (let room of user.conversations) {
          socket.join(room._id);
        }
        allClients[userId] = socket; // Attach the socket to the user id

        // Notify all contacts that have you as contact/friend, on login
        for (let client in allClients) {
          if (client && client !== userId) {
            User.findById(client, (err, c) => {
              for (let f of c!.contacts) {
                if (f._id.toString() === userId) {
                  allClients[client].emit(
                    'userOnline',
                    user.fullName,
                    user.email
                  );
                }
              }
            });
          }
        }
      });

      // Join the new conversation when creating or accepting new convs
      socket.on('newConv', convId => {
        socket.join(convId);
      });

      //Emit an event for every user on the invitation
      socket.on('newInv', (convName, userList) => {
        for (let id of userList)
          User.findById(id, (err: Error, invUser: IUserModel) => {
            if (err) return err;
            allClients[id].emit('invSent', invUser.invitations);
          });
      });

      // when receiving a message emmit a room event and update the db (conversations and msgs)
      socket.on('newMessage', (conv, text) => {
        Conversation.findByIdAndUpdate(
          conv,
          { new: true },
          (err: any, foundConv: IConvModel | null) => {
            if (err) {
              return err;
            }
            foundConv!.lastMessage =
              new Date().toLocaleTimeString('en-US').replace(/:\d{2}\s/, ' ') +
              ': ' +
              text;
            foundConv!.save();

            User.findByIdAndUpdate(
              userId,
              { new: true },
              (err: any, updated: IUserModel | null) => {
                if (err) {
                  return err;
                }
                for (var c of updated!.conversations) {
                  if (c._id.toString() === conv) {
                    c.lastMessage =
                      new Date()
                        .toLocaleTimeString('en-US')
                        .replace(/:\d{2}\s/, ' ') +
                      ': ' +
                      text;
                    updated!.save();
                  }
                }
              }
            );
          }
        );
        Conversation.findById(conv)
          .populate({
            path: 'messages',
            select: '-_id -__v'
          })
          .exec((err: Error, popConv: IConvModel) => {
            socket
              .to(conv)
              .emit('msgSent', popConv.messages[popConv.messages.length - 1]);
            io.in(conv).emit('updateLastMsg', conv, text);
          });
      });
    }
  });
  //End the socket connection
  socket.on('logout', () => {
    socket.removeAllListeners();
    socket.leaveAll();
    delete socket.rooms;
    socket.disconnect();
    // var i = allClients.indexOf(socket);
    // allClients.splice(i, 1);
    // console.log(allClients.length);
  });

  socket.on('disconnect', function() {
	
    console.log('Got FULL disconnect!');
  });
});
