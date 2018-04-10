import axios from 'axios';
import { ChatStore, ReceivingUserData } from '../../store';

// Action type constants
export const UPDATE = 'UPDATE';
export type UPDATE = typeof UPDATE;
export const UPDATECHAT = 'UPDATECHAT';
export type UPDATECHAT = typeof UPDATECHAT;
export const DISPLAY = 'DISPLAY';
export type DISPLAY = typeof DISPLAY;
export const CHANGEVIEW = 'CHANGEVIEW';
export type CHANGEVIEW = typeof CHANGEVIEW;
export const ONLINE = 'ONLINE';
export type ONLINE = typeof ONLINE;
export const LOGOUT = 'LOGOUT';
export type LOGOUT = typeof LOGOUT;

// Actions to be dispatched
export const update = (userData: ReceivingUserData) => {
  return {
    type: UPDATE,
    userData: userData
  };
};
export const updateChat = (chatData: ChatStore) => {
  return {
    type: UPDATECHAT,
    chatData: chatData
  };
};

export const display = (conversation: string, convName: string, friend: string) => {
  return {
    type: DISPLAY,
    conversation: conversation,
    convName: convName,
    friend: friend
  };
};
export const changeView = (current: string) => {
  return {
    type: CHANGEVIEW,
    current: current
  };
};
export const online = (userOnline: string) => {
  return {
    type: ONLINE,
    userOnline: userOnline
  };
};
export const logout = () => {
  return {
    type: LOGOUT
  };
};

// /////Axios//////////Axios/////////Axios///////Axios/////////Axios//////Axios///////
// Axios calls to the server
export async function loginCheck(email: string, password: string) {
  try {
    const res = await axios.post('/api/login', {
      email: email,
      password: password
    });
    if (res.status === 200) {
      return 200;
    }
  } catch (e) {
    return e.response.data.msg;
  }
}
export async function singupCheck(email: string, password: string, firstname: string, lastname: string) {
  try {
    const res = await axios.post('/api/signup', {
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname
    });
    if (res.status === 200) {
      try {
        await loginCheck(email, password);
        if (res.status === 200) {
          return 200;
        }
      } catch (e) {
        return e.response.data.msg;
      }
    }
  } catch (e) {
    return e.response.data.msg;
  }
}

export async function GetDash() {
  try {
    const answer = await axios.get('/api/dash'); // Check for authorization
    // Get user information
    if (answer.status === 200) {
      var user = await axios.get('/api/me');
      if (user.status === 200) {   
        return user.data;
      }
    }
  } catch (e) {
    return e.response.data.msg;
  }
}
export async function GetChat() {
  try {
    const chat = await axios.get('/api/chat'); // Get chat messages
    if (chat.status === 200) {
        return chat.data;
    }
  } catch (e) {
    return e.response.data.msg;
  }
}
type newConvList = { _id: string; active: boolean; };
export async function createConversation(participants: Array<newConvList>, convName: string) {
  try {
    const answer = await axios.post('/api/conversation', {participants: participants, name: convName});
    if (answer.status === 200) {
      let newAnswer = {
        status: 200,
        newConversation: [{_id: answer.data._id, name: answer.data.name}],
        newConvParts: [{[answer.data._id]: answer.data.info}]
      };
      
      return newAnswer;
    }
  } catch (e) {
    return e.response.data.msg;
  }
}

////////////////////////////////////////////////////////
export async function handleInvitation(action: string, invitation: string, name: string) {
  try {
    const answer = await axios.post('/api/invitation', {action: action, invitation: invitation, name: name});
    if (answer.status === 200) {
      let newAnswer = answer.data.action === 'to-accept' ?
        {
          status: 200, 
          newConversation: [{_id: answer.data._id, name: answer.data.name}],
          newConvParts: [{[answer.data._id]: answer.data.info}],
          messages: answer.data.messages,
          lastMessage: { [answer.data._id]: answer.data.lastMessage },
          dropInv: answer.data._id
        }
        :
        { status: 200, dropInv: answer.data._id };
      return newAnswer;
    }
  } catch (e) {
    return e.response.data.msg;
  }
}
/////////////////////////////////////////////////////////////////

export async function updateMe(firstname: string, lastname: string) {
  try {
    const answer = await axios.post('/api/update-me', {firstname: firstname, lastname: lastname});
    if (answer.status === 200) {
      let newAnswer = {
        status: 200, 
        firstname: answer.data.newFirstName, 
        lastname: answer.data.newLastName
      };
      return newAnswer;
    }
  } catch (e) {
    return e.response.data.msg;
  }
}
export async function changeAvatar(avatar: string) {
  try {
    const answer = await axios.post('/api/avatar', {avatar: avatar});
    if (answer.status === 200) {
      return answer.status;
    }
  } catch (e) {
    return e.response.data.msg;
  }
}
export async function changeConvAvatar(conv: string, avatar: string) {
  try {
    const answer = await axios.post('/api/conv-avatar', {conv: conv, avatar: avatar});
    if (answer.status === 200) {
      return answer.status;
    }
  } catch (e) {
    return e.response.data.msg;
  }
}
export async function addContact(email: string) {
  try {
    const answer = await axios.post('/api/contact', { email: email.trim().toLowerCase() });
    if (answer.status === 200) {
      let newAnswer = {
        status: 200, 
        newContact: {_id: answer.data._id, name: answer.data.name, email: answer.data.email, avatar: answer.data.avatar}
      };
      return newAnswer;
    }
  } catch (e) {
    return e.response.data.msg;
  }
}
export async function deleteContact(delContact: string) {
  try {
    const answer = await axios.post('/api/delete-contact', { delContact: delContact });
    if (answer.status === 200) {
      return answer;
    }
  } catch (e) {
    return e.response.data.msg;
  }
}
export async function sendMessage(currentConv: string, messageSent: string, ownerName: string) {
  try {
    const answer = await axios.post('/api/message', { currentConv: currentConv, messageSent: messageSent, ownerName: ownerName });
    if (answer.status === 200) {
      return [answer.data];
    }
  } catch (e) {
    return e.response.data.msg;
  }
}
export async function addToConv(currentConv: string, contactAdded: string) {
  try {
    const answer = await axios.post('/api/add-to-conv', { currentConv: currentConv, contactAdded: contactAdded });
    if (answer.status === 200) {
      return {addedToConv: {[answer.data._id]: answer.data.info}};
    }
  } catch (e) {
    return e.response.data.msg;
  }
}
export async function destroyToken() {
  try {
    // TODO DESTROY IO
    const answer = await axios.get('/api/logout');
    if (answer.status === 200) {
      return 200;
    }
  } catch (e) {
    return e.response.data.msg;
  }
}

// ////////End of Axios////////////End of Axios/////////////End of Axios/////////////