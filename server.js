// server.js

// set up ======================================================================
// get all the tools we need
var express  		= require('express');
var app      		= express();
var path 	 		= require('path');
var port     		= process.env.PORT || 8080;
var mongoose 		= require('mongoose');
var passport 		= require('passport');
var flash    		= require('connect-flash');
var logger 			= require('express-logger');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var session 		= require('express-session');
var MongoClient 	= require('mongodb').MongoClient;
var assert 			= require('assert');
var validator       = require('express-validator');
var configDB        = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use(logger({path: 'logfile.txt'})); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(validator());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'Gvu8sLb2F4f6CmNgtsWX3rx4cDhLDqdA' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

/* Load static */
app.use(express.static(path.join(__dirname, 'public')));
app.set('db', require('./db')(MongoClient, configDB.url));

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
