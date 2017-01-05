
// app/routes.js
module.exports = function(app, passport, isLoggedIn) {
    var express = require('express');
    var router = express.Router();    
    
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

	router.post('/connections/', isLoggedIn, function(req, res) {
		app.get('mongoClient').connect(app.get('dbConnectUrl'), function(err, db){			
			if(req && req.body){
				if (err){
					res.send(err);
				}else{
					res.json({ message: 'Connection is created!' });
				}            	
			}
		});		
	});

    return router;
};
