import update from 'immutability-helper';
import { UserStore, ReceivingUserData } from '../store';

export const updateObject = (
  oldObject: UserStore,
  updatedValues: ReceivingUserData
) => {
  let newData = oldObject;
  for (let key in updatedValues) {
    if (typeof updatedValues[key] === 'string') {
      newData = update(newData, { $merge: { [key]: updatedValues[key] } });
    } else {
      if (key === 'invitations' || key === 'convParts') {
        newData = update(newData, { [key]: { $set: updatedValues[key] } });
      } else {
        if (key === 'delCont') {
          newData = update(newData, { contacts: { $set: updatedValues[key] } });
        } else {
          if (key === 'newConvParts') {
            newData = update(newData, {
              convParts: { $push: updatedValues[key] }
            });
          } else {
            if (key === 'addedToConv') {
              for (let c in newData.convParts) {
                if (
                  Object.keys(newData.convParts[c])[0] ===
                  Object.keys(updatedValues[key]!)[0]
                ) {
                  newData = update(newData, {
                    convParts: { [c]: { $set: updatedValues[key] } }
                  });
                }
              }
            } else {
              if (key === 'lastMessage') {
                for (let c in newData.conversations) {
                  if (
                    newData.conversations[c]._id ===
                    Object.keys(updatedValues[key]!)[0]
                  ) {
                    let cId = newData.conversations[c]._id;
                    newData = update(newData, {
                      conversations: {
                        [c]: { lastMessage: { $set: updatedValues[key]![cId] } }
                      }
                    });
                  }
                }
              } else {
                newData = update(newData, {
                  [key]: { $push: updatedValues[key] }
                });
              }
            }
          }
        }
      }
    }
  }
  return newData;
};
