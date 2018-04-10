// include our packages in our main server file
import express from 'express';
import http from 'http';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from 'passport';
import * as io from 'socket.io';

import { config } from './app/config/main';
import * as routes from './app/routes/index';
require('./app/config/passport')(passport); // Bring in passport Strategy

mongoose.connect(config.database); // Connect to db
const app = express();
const server = http.createServer(app);

app.set('port', process.env.PORT || 4000);

// Use body-parser to get POST request for API use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger('dev')); // Log requests to console
app.use(passport.initialize()); // Initialize Passport for use

const apiRoutes = express.Router(); // Create API routes

app.use(express.static(path.join(__dirname, '/client/build'))); // Serve static files from the React app
apiRoutes.post('/signup', routes.user.register); // Register new users
apiRoutes.post('/login', routes.user.login); // Authenticate the user and get JWT

// Protect dashboard route with JWT
apiRoutes.use(passport.authenticate('jwt', { session: false }));

apiRoutes.get('/dash', routes.user.dash); //After auth
apiRoutes.get('/me', routes.user.me); // Get User Info
apiRoutes.get('/chat', routes.message.getMessages); // Get chat Info
apiRoutes.post('/update-me', routes.user.updateMe); // Update info
apiRoutes.post('/contact', routes.user.addContact); // Add new contact
apiRoutes.post('/delete-contact', routes.user.deleteContact); // Delete contact
apiRoutes.post('/message', routes.message.saveMessage); // Add new message
apiRoutes.post('/conversation', routes.conversation.createConv); // create new conversation
apiRoutes.post('/add-to-conv', routes.conversation.AddToConv); // Add a contact to a conversation
apiRoutes.post('/invitation', routes.conversation.invAction); // accept or delete invitations
apiRoutes.get('/logout', routes.user.logout); // Logout route (destroys token)

app.use('/api', apiRoutes); // Set url for API group routes
export default io.listen(server); // using io to listen to the Server
server.listen(app.get('port'), () => {
  console.log('Listening on port: ' + app.get('port'));
}); // Listen port 4000

require('./app/sockets'); // WebSockets module
