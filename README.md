# Whatsapp-like Chat #
### *Development version 1.0.0*
See the deployed (heroku) version here: [https://javiside.herokuapp.com](https://javiside.herokuapp.com)
![chatDash](https://raw.githubusercontent.com/javiside/site-template/master/app/assets/images/testimonial-cat.jpg)

1. Initial commit; Created testing endpoints and a mongoose collection and schema for users **2018-03-14**
2. Added signup page, fixed css responsiveness **2018-03-15**
3. Added dashboard window (mock data for now), redirection to dashboard on successful login
4. Changed to axios POST instead of form POST, refactored files; working on dashboard (display states)
5. fixed dashboard views states
6. Moved login and signup to components/index folder, instead of containers
7. Refactored and Redesigned project structure; also folders and files
8. Added AddContact functionality TODO: check if the email is on the db before pushing it
9. Server now checks if the user is on the db before pushing
10. Added change name and lastname from Profile **2018-03-17**
11. Implemented add conversations (TODO send notification to the users with invitation pending and be able to accept or delete invitation) **2018-03-18**
12. Added action creators and constants action types **2018-03-18**
13. Participants conversations and invitations are updated when creating new conversation; added show invitations menu **2018-03-18**
14. Moved addContact to action creators (async thunk), added emojis on homeMenu **2018-03-19**
15. Displaying names instead of _id or emails **2018-03-19**
16. Changed to display email for contacts instead of name **2018-03-19**
17. Invitations can be accepted or removed **2018-03-19**
18. Removed last axios call from components **2018-03-19**
19. Added messages model, and chat display window **2018-03-20**
20. Testing chat bubbles, mocking data and adapting the style **2018-03-20**
21. Added Loading Screen **2018-03-20**
22. Fixed inconsistencies with redux when moving from plain strings to onjects with id and name **2018-03-21**
23. included immutability-helper and implemented new redux management **2018-03-21**
24. detached add contact from settings and added a new icon on the top menu, added some transitions with react-transition-group **2018-03-21**
25. changed .send to .json responses **2018-03-21**
26. removed unnecessary transitions, added notification badge for invitations **2018-03-21**
27. mocking data using conversations array instead of defaulted elements (TODO: change to messages array, and implement websockets communication) **2018-03-21**
28. Changed server folders structure **2018-03-21**
29. Implemented Socket communication; showing message from the server when Dashboard loads **2018-03-22**
30. triggering events, saving the message and updating the owner conversation on new messages, using ws **2018-03-23**
31. Refactored/Decoupled Lists, TODO finish messages websocket, implement ws event for new invitation and new contact notifications **2018-03-24**
32. Changed files/folders names **2018-03-24**
33. Fixed/Switched conversations and contacts concern actions **2018-03-24**
34. Real-time notification for new invitations **2018-03-24**
35. Fixed user schema **2018-03-24**
36. Finished real-time notifications for new messages and invitations **2018-03-25**
37. Added friend profile **2018-03-25**
38. Joining rooms when creating and accepting conversations **2018-03-25**
39. Added show/hide conversation info **2018-03-25**
40. Initial Commit, create react app with typescript, added axios, react-router-dom, react-transition-group, redux-thunk, socket.io-client and their types **2018-03-26**
41. Implemented Typescript; TODO check incongruencies **2018-03-27**
42. Login/Signup redirect to dash if the user already logged in **2018-03-29**
43. Fixed messages width **2018-03-29**
44. Added react-intl and 11 different languagues support **2018-03-31**
45. Added change lenguage on welcome, login and signup screens **2018-03-31**
46. Added delete contact from friend profile **2018-03-31**
47. On adding participant to conversation **2018-04-02**
48. Added last message on conversations list **2018-04-02**
49. Added time to last message **2018-04-02**
50. Added on login notification **2018-04-03**
51. Adding testing with enzyme jest mocha and chai **2018-04-03**
52. Added mocha, chai, sinon, enzyme, moxios and tested keyboard component, user and chat reducers and axios calls **2018-04-04**
53. Fixed socket io duplicated listeners problem **2018-04-05**
54. Added Klingon language **2018-04-06**
#### TODO:
- Fix Css
  - Implement Sass or Bootstrap to improve readability
  - Improve usability for Small screen devices
  - Update/change chat info screen design
- Implement websockets when changing images
