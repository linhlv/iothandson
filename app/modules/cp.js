
// app/routes.js
module.exports = function(app, passport, isLoggedIn) {
    var express 	= require('express');
    var router 		= express.Router();   
	var util 		= require('util'); 
	var Connection  = require('../models/connection');
    
	// =====================================
	// CP SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	router.get('/', isLoggedIn, function(req, res) {		
		res.render('cp.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	router.get('/connections/', isLoggedIn, function(req, res) {
		Connection.find(function(err, items) {
            if (err)
                res.send(err);

            res.json(items);
        });		
	});

	router.get('/connections/:id', isLoggedIn, function(req, res) {
		Connection.findById(req.params.id, function(err, item) {
            if (err)
                res.send(err);
            res.json(item);
        });
	});

	router.post('/connections/', isLoggedIn, function(req, res) {
		if(req && req.body){
			req.checkBody('clientID', 'Client ID is required').notEmpty();
			req.checkBody('server', 'Server is required').notEmpty();
			req.checkBody('port', 'Port is required as an integer').notEmpty().isInt();
			req.checkBody('username', 'Username is required').notEmpty();
			req.checkBody('password', 'Password is required').notEmpty();

			req.getValidationResult().then(function(result) {
				if (!result.isEmpty()) {
					res.send(
						{
							message: 'There have been validation errors',
							errors: result.array()
						}, 400
					);
					return;
				}			

				var connection = new Connection();

				connection.clientID = req.body.clientID;
				connection.server = req.body.server;
				connection.port = req.body.port;
				connection.username = req.body.username;
				connection.password = req.body.password;
				connection.createdBy = req.user._id;
				connection.createdOn = new Date();

				// save the connection and check for errors
				connection.save(function(err) {
					if (err)
						res.send(err);

					res.json({ message: 'Connection is created!' });
				});
			});       	
		}
	});

    return router;
};
