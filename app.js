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




module.exports = app;

