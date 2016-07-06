var pgp = require('pg-promise')();

var db = pgp('postgres://postgres:123@localhost:5432/db');

module.exports = db

db.one("select name from users where id=$1", 123)
    .then(function (user) {
        console.log(user.name); // print user name;
    })
    .catch(function (error) {
        console.log(error); // print why failed;
    });