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
	res.send('This is home page');
	
});

app.get('/register', function (req, res) {	
	res.render('register', { title: 'Form', message: 'Hello there!'});

});

app.get('/login', function (req, res) {	
	res.render('login', { title: 'Form', message: 'Hello there!'});

});
app.listen(3000);

let validation = (req, res) => {
	if (!req.body.email) {
		return res.status(400).end('email isn\'t specified');
		
	};
	if (!req.body.password) {
		return res.status(400).end('password isn\'t specified');
		
	};

	db.any("SELECT email FROM users WHERE email = $1", req.body.email)
		.then(function (emails) {
			if (emails.length != 0) {
				return res.status(400).end('email is used');		
			 }
		})
		.catch(function (error) {
				console.log("ERROR: ", error);
				res.status(401).send(error);
		})		
}
//validation function
app.post('/api/register', function (req, res, next) {
	validation(req, res);	
	next();
});
let registration = (req, res) => {
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
			
};

//add to db function
app.post('/api/register', function (req, res, next) {
	registration(req, res);
		
	next();
});
let showSuccessMess = (req, res) => {
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
}
//profile callback function
app.post('/api/register', function (req, res) {
	showSuccessMess(req, res);			
	
});


let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let cookieParser = require('cookie-parser');
let session = require('express-session');
let flash = require('req-flash');


app.use(cookieParser());
app.use(session({ secret: '123' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },  function (req, username, password, done) {
  	 console.log("Login process:", username);
  	db.any("SELECT * FROM users WHERE email = $1 AND password = $2", [username, password])
      .then((user)=> {      
      	if (user.length == 0) {
      		return done(null, false, { message: 'Incorrect username.' });
      	}
      
      	return done(null, user);

      })
      .catch((err) => {       
        done(null, false, { message: 'Incorrect username or password.' });
      });
   
}));

passport.serializeUser((user, done)=>{
   console.log("serialize ", user);
    done(null, user[0].id);
  });

  passport.deserializeUser((id, done)=>{
    console.log("deserualize ", id);
    db.one("SELECT id, name, email FROM users " +
            "WHERE id = $1", [id])
    .then((user)=>{
      done(null, user);
    })
    .catch((err)=>{
      done(new Error('User with the id ${id} does not exist'));
    })
  });

app.post('/api/login',
  passport.authenticate('login', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true }) 							
);



module.exports = app;

