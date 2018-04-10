"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
// include our packages in our main server file
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var path_1 = __importDefault(require("path"));
var mongoose_1 = __importDefault(require("mongoose"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var morgan_1 = __importDefault(require("morgan"));
var passport_1 = __importDefault(require("passport"));
var io = __importStar(require("socket.io"));
var main_1 = require("./app/config/main");
var routes = __importStar(require("./app/routes/index"));
require('./app/config/passport')(passport_1.default); // Bring in passport Strategy
mongoose_1.default.connect(main_1.config.database); // Connect to db
var app = express_1.default();
var server = http_1.default.createServer(app);
app.set('port', process.env.PORT || 4000);
// Use body-parser to get POST request for API use
app.use(body_parser_1.default.urlencoded({ limit: '3mb', extended: false }));
app.use(body_parser_1.default.json({ limit: '3mb' }));
app.use(cookie_parser_1.default());
app.use(morgan_1.default('dev')); // Log requests to console
app.use(passport_1.default.initialize()); // Initialize Passport for use
var apiRoutes = express_1.default.Router(); // Create API routes
app.use(express_1.default.static(path_1.default.join(__dirname, '/client/build'))); // Serve static files from the React app
apiRoutes.post('/signup', routes.user.register); // Register new users
apiRoutes.post('/login', routes.user.login); // Authenticate the user and get JWT
// Protect dashboard route with JWT
apiRoutes.use(passport_1.default.authenticate('jwt', { session: false }));
apiRoutes.get('/dash', routes.user.dash); //After auth
apiRoutes.get('/me', routes.user.me); // Get User Info
apiRoutes.get('/chat', routes.message.getMessages); // Get chat Info
apiRoutes.post('/update-me', routes.user.updateMe); // Update info
apiRoutes.post('/contact', routes.user.addContact); // Add new contact
apiRoutes.post('/delete-contact', routes.user.deleteContact); // Delete contact
apiRoutes.post('/avatar', routes.user.changeAvatar); // Change avatar
apiRoutes.post('/conv-avatar', routes.conversation.changeAvatar); // Change conv avatar
apiRoutes.post('/message', routes.message.saveMessage); // Add new message
apiRoutes.post('/conversation', routes.conversation.createConv); // create new conversation
apiRoutes.post('/add-to-conv', routes.conversation.AddToConv); // Add a contact to a conversation
apiRoutes.post('/invitation', routes.conversation.invAction); // accept or delete invitations
apiRoutes.get('/logout', routes.user.logout); // Logout route (destroys token)
app.use('/api', apiRoutes); // Set url for API group routes
exports.default = io.listen(server); // using io to listen to the Server
server.listen(app.get('port'), function () {
    console.log('Listening on port: ' + app.get('port'));
}); // Listen port 4000
require('./app/sockets'); // WebSockets module
