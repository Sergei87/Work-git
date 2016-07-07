'use strict';

let express = require('express');
let app = express();

let db = require('./db');
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

//validation function
app.post('/api/register', function (req, res, next) {
	if (!req.body.email) {
		res.status(400).end('email isn\'t specified');
		
	};
	if (!req.body.password) {
		res.status(400).end('password isn\'t specified');
		
	};

	db.any("SELECT email FROM users WHERE email = $1", req.body.email)
		.then(function (emails) {
			if (emails.length != 0) {
				res.status(400).end('email is used');		
			 }
		})
		.catch(function (error) {
				console.log("ERROR: ", error);
				res.status(401).send(error);
		})		
	next();
});
//add to db function
app.post('/api/register', function (req, res, next) {

		db.any("SELECT email FROM users WHERE email = $1", req.body.email)
		.then(function (emails) {
			if (emails.length == 0) {

				db.query("INSERT INTO users (email, password, name) VALUES ($1, $2, $3)",
					[req.body.email, req.body.password, req.body.username]);
			 }
		})
		.catch(function (error) {
				console.log("ERROR: ", error);
				res.status(401).send(error);
		})		
			
	next();
});
//profile callback function
app.post('/api/register', function (req, res) {

		db.any("SELECT * FROM users WHERE email = $1", req.body.email)
		.then(function (users) {
			console.log(users);
			res.status(201).end('Registration succeed:' + '\n' + 'username: ' + req.body.username
								+ '\n' + 'login: ' +req.body.email);			
		})
		.catch(function (error) {
			console.log("ERROR: ", error);
			res.status(401).send(error);
		})					
	
});
	
app.post('/api/login', function (req, res) {
	console.log("/api/login");
	res.send("200 OK");
});


module.exports = app;

