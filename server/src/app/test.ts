import { expect } from 'chai';
import { User } from './models/user';
import { Message } from './models/message';
import mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;

describe('Testing User model', () => {
  it('should be an error if the first name is empty', () => {
    let user = new User({
      email: 'a@a.a',
      password: 'a',
      firstname: '',
      lastname: 'Smith'
    });
    user.validate((err: Error) => {    
      expect(err).to.exist;
    });
  });

  it('should be an error if the last name is not passed', () => {
    let user = new User({
      email: 'a@a.a',
      password: 'a',
      firstname: 'Jhon'
    });
    user.validate((err: Error) => {
      expect(err).to.exist;
    });
  });

  it('should be an error if the email is empty', () => {
    let user = new User({
      email: '',
      password: 'a',
      firstname: 'Jhon',
      lastname: 'Smith'
    });
    user.validate((err: Error) => {
      expect(err).to.exist;
    });
  });

  it('should be an error if the password is not passed', () => {
    let user = new User({
      email: 'a@a.a',
      firstname: 'Jhon',
      lastname: 'Smith'
    });
    user.validate((err: Error) => {
      expect(err).to.exist;
    });
  });

  it('should continue if the four elements are passed', () => {
    let user = new User({
      email: 'a@a.a',
      password: 'a',
      firstname: 'Jhon',
      lastname: 'Smith'
    });
    user.validate((err: Error) => {
      expect(err).to.not.exist;
    });
  });
});

describe('Testing the save message function', () => {

  it('should be an error if the conversation Id is empty', () => {
    let newMsg = new Message({
      text: 'new message',
      owner: new ObjectId('5ac2c914bbfebd5bf07b4fb1'),
      conversation: ''
    });
    newMsg.validate((err: Error) => {     
      expect(err.name).equal('ValidationError');
    });
  });

  it('should continue if text, owner (id) and conv (id) are passed', () => {
    let newMsg = new Message({
      text: 'new message',
      owner: new ObjectId('5ac2c914bbfebd5bf07b4fb1'),
      conversation: new ObjectId('6ac2c914bbfebd5bf07b4fb2')
    });
    newMsg.validate((err: Error) => {     
      expect(err).to.not.exist;
    });
  });

})