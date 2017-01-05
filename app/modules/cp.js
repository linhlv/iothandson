
// app/routes.js
module.exports = function(app, passport, isLoggedIn) {
    var express = require('express');
    var router 	= express.Router();   
	var util 	= require('util'); 
	var db 		= app.get('db');
    
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
		db.findDocuments('connections', {createdBy: req.user._id}, function(result){			
			res.json(result);
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

				var connections = [{
					clientID: req.body.clientID,
					server: req.body.server,
					port: req.body.port,
					username: req.body.username,
					password: req.body.password,
					createdBy: req.user._id,
					createdOn: new Date()
				}];
				db.insertDocuments('connections', connections, function(result){
					res.json(result);
				});
			});       	
		}
	});

    return router;
};
