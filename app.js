'use strict';

let express = require('express');
let app = express();

let pgp = require("pg-promise")(/*options*/);
let db = pgp("postgres://postgres:123@localhost:5432/test");

let bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.set('views', './views');
app.set('view engine', 'jade');

app.set('port', 3000);
app.get('/', function (req, res) {
	console.log("Express server listening on port " + app.get('port'));
	
});

app.get('/register', function (req, res) {
	console.log("Express server listening on port " + app.get('port'));
	res.render('register', { title: 'Form', message: 'Hello there!'});
});

app.get('/login', function (req, res) {
	console.log("Express server listening on port " + app.get('port'));
	res.render('login', { title: 'Form', message: 'Hello there!'});
});
app.listen(3000);

app.post('/api/register', function (req, res) {
	console.log("/api/register");
	console.log(req.body);
	
	if (!req.body.email) {
		res.status(400).send('email isn\'t specified');
	} else if (!req.body.password) {
		res.status(400).send('password isn\'t specified');
	} else {
		db.any("SELECT email FROM users WHERE email = $1", req.body.email)
			.then(function (emails) {
			    if (emails.length == 0) {
			    	db.query("INSERT INTO users (email, password, name) VALUES ($1, $2, $3)",
			    		[req.body.email, req.body.password, req.body.username]);

			    	console.log('new user has been added');

			    	db.any("SELECT id FROM users WHERE email = $1", req.body.email)
						.then(function (id) {	
							res.status(201).end('registration succeeded');							   
						});		    	
			    	
			    } else {
			    	res.status(400).end('email is used');
			    }
			})
			.catch(function (error) {
			    console.log("ERROR: ", error);
			    res.status(401).send(error);
			});
	}

} );

app.post('/api/login', function (req, res) {
	console.log("/api/login");
	res.send("200 OK");
} );

/*
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy;

passport.use('local', new LocalStrategy(
    function (username, password, done) {
 
        if (username == "admin" && password == "admin") {
            return done(null, {
                username: "admin",
                
            });
        }
 
        return done(null, false, { 
            message: 'Неверный логин или пароль' 
        });
    }
));
 app.get('/login', function (req, res) {
 
        if (req.isAuthenticated()) {
            res.redirect('/');
            return;
        }
 
        res.render('login', {});
    });

 app.post('/', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true })
    ); */

module.exports = app;

