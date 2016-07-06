'use strict';

let express = require('express');
let app = express();

app.set('views', './views');
 app.set('view engine', 'jade');


app.set('port', 3000);
app.get('/', function (req, res) {
	console.log("Express server listening on port " + app.get('port'));
  	res.render('index', { title: 'Form', message: 'Hello there!'});
})

app.listen(3000);
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
    ); 

module.exports = app;

