# Whatsapp-like Chat #
### *Development version 1.0.0*
![chatDash](https://raw.githubusercontent.com/javiside/site-template/master/app/assets/images/testimonial-cat.jpg)

1. Initial commit; Created testing endpoints and a mongoose collection and schema for users
2. Added signup page, fixed css responsiveness
3. Added dashboard window (mock data for now), redirection to dashboard on successful login
4. Changed to axios POST instead of form POST, refactored files; working on dashboard (display states)
5. fixed dashboard views states
6. Moved login and signup to components/index folder, instead of containers
7. Refactored and Redesigned project structure; also folders and files
8. Added AddContact functionality TODO: check if the email is on the db before pushing it
9. Server now checks if the user is on the db before pushing
10. Added change name and lastname from Profile
11. Implemented add conversations (TODO send notification to the users with invitation pending and be able to accept or delete invitation)
12. Added action creators and constants action types
13. Participants conversations and invitations are updated when creating new conversation; added show invitations menu
14. Moved addContact to action creators (async thunk), added emojis on homeMenu
15. Displaying names instead of _id or emails
16. Changed to display email for contacts instead of name 
17. Invitations can be accepted or removed 
18. Removed last axios call from components
19. Added messages model, and chat display window
20. Testing chat bubbles, mocking data and adapting the style
21. Added Loading Screen
22. Fixed inconsistencies with redux when moving from plain strings to onjects with id and name
23. included immutability-helper and implemented new redux management
24. detached add contact from settings and added a new icon on the top menu, added some transitions with react-transition-group
25. changed .send to .json responses
26. removed unnecessary transitions, added notification badge for invitations
27. mocking data using conversations array instead of defaulted elements (TODO: change to messages array, and implement websockets communication)
28. Changed server folders structure
29. Implemented Socket communication; showing message from the server when Dashboard loads
30. triggering events, saving the message and updating the owner conversation on new messages, using ws
31. Refactored/Decoupled Lists, TODO finish messages websocket, implement ws event for new invitation and new contact notifications
32. Changed files/folders names 
33. Fixed/Switched conversations and contacts concern actions
34. Real-time notification for new invitations
35. Fixed user schema
36. Finished real-time notifications for new messages and invitations
37. Added friend profile
38. Joining rooms when creating and accepting conversations
39. Added show/hide conversation info
40. Initial Commit, create react app with typescript, added axios, react-router-dom, react-transition-group, redux-thunk, socket.io-client and their types
41. Implemented Typescript; TODO check incongruencies
42. Login/Signup redirect to dash if the user already logged in
43. Fixed messages width
44. Added react-intl and 11 different languagues support
45. Added change lenguage on welcome, login and signup screens
46. Added delete contact from friend profile
47. On adding participant to conversation
48. Added last message on conversations list
49. Added time to last message
50. Added on login notification
51. Adding testing with enzyme jest mocha and chai
52. Added mocha, chai, sinon, enzyme, moxios and tested keyboard component, user and chat reducers and axios calls
53. Fixed socket io duplicated listeners problem
54. Added Klingon language
#### TODO:
- Fix Css
  - Implement Sass or Bootstrap to improve readability
  - Improve usability for Small screen devices
  - Update/change chat info screen design
- Implement websockets when changing images
- Refactor the code
