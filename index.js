const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
//DB Setup
mongoose.connect('mongodb://localhost:auth/auth');
//2nd auth = <dbname>

//App Setup
//1. Wiring middleware
app.use(morgan('combined')); // logging service
app.use(cors()); // allow access for cors
app.use(bodyParser.json({type:'*/*'})); // parse request
router(app); //Pass express to router


// Server Setup - get express to talk to outside world
//

const port = process.env.PORT || 3090;
const server = http.createServer(app); // Create server and forward to express
server.listen(port);
console.log('server listening to port', port);
