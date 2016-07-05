'use strict';

let express = require('express');
let app = express();


app.set('port', 3000);
app.get('/', function (req, res) {
	console.log("Express server listening on port " + app.get('port'));
  	res.send('Hello World');
})

app.listen(3000);

module.exports = app;

