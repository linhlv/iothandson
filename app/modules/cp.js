
// app/routes.js
module.exports = function(app, passport, isLoggedIn) {
    var express 	= require('express');
    var router 		= express.Router();   
	var util 		= require('util'); 
	var Connection  = require('../models/connection');
	var Publication  = require('../models/publication');
    
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

				var model = new Connection();

				model.clientID = req.body.clientID;
				model.server = req.body.server;
				model.port = req.body.port;
				model.username = req.body.username;
				model.password = req.body.password;
				model.createdBy = req.user._id;
				model.createdOn = new Date();

				// save the connection and check for errors
				model.save(function(err) {
					if (err)
						res.send(err);

					res.json({ message: 'Connection is created!' });
				});
			});       	
		}
	});

	router.get('/publications/:connectionId', isLoggedIn, function(req, res) {		
		Publication.find({ connectionId : req.params.connectionId}, function(err, items) {
            if (err)
                res.send(err);

            res.json(items);
        });		
	});

	router.get('/publications/:connectionId/:id', isLoggedIn, function(req, res) {
		Publication.findById(req.params.id, function(err, item) {
            if (err)
                res.send(err);
            res.json(item);
        });	
	});

	router.post('/publications/', isLoggedIn, function(req, res) {
		if(req && req.body){
			req.checkBody('friendlyName', 'Friendly name is required').notEmpty();
			req.checkBody('topic', 'Topic is required').notEmpty();
			req.checkBody('textOn', 'Text (on) is required as an integer').notEmpty();
			req.checkBody('textOff', 'Text (off) is required').notEmpty();
			req.checkBody('textAuto', 'Text (auto) is required').notEmpty();
			req.checkBody('valueOn', 'Value (on) is required').notEmpty();
			req.checkBody('valueOff', 'Value (off) is required').notEmpty();
			req.checkBody('valueAuto', 'Value (auto) is required').notEmpty();
			req.checkBody('connectionId', 'Connection Id is required').notEmpty();

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

				var model = new Publication();

				model.friendlyName = req.body.friendlyName;
				model.topic = req.body.topic;
				model.description = req.body.description;
				model.textOn = req.body.textOn;
				model.textOff = req.body.textOff;
				model.textAuto = req.body.textAuto;
				model.valueOn = req.body.valueOn;
				model.valueOff = req.body.valueOff;
				model.valueAuto = req.body.valueAuto;
				model.connectionId = req.body.connectionId;
				model.createdBy = req.user._id;
				model.createdOn = new Date();

				// save the connection and check for errors
				model.save(function(err) {
					if (err)
						res.send(err);

					res.json({ message: 'Publication is created!' });
				});
			});       	
		}
	});

    return router;
};
