
var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://postgres:123@localhost:5432/test");

//db.query("CREATE DATABASE test");
//db.query("CREATE TABLE users");
/*
db.one("SELECT $1 AS value", 123)
    .then(function (data) {
        console.log("DATA:", data.value);
    })
    .catch(function (error) {
        console.log("ERROR: !!!!!!!!!!!!!!!!!!!!!!1", error);
    });*/
/*db.query("INSERT INTO users (email, password, name) VALUES ('$1', '$2', '$3')",
			    		['qwe', 'rty', 'yui']);*/


/*db.any("INSERT INTO users (email, password, name) VALUES ($1, $2, $3)",
			    		['qwe', 'rty', 'yui'])
.then(function (users) {
    console.log("email:", users);
})
.catch(function (error) {
    console.log("ERROR: ", error);
});*/


db.any("SELECT email FROM users WHERE email = $1", 'sddsdsds')
.then(function (users) {
    console.log("email:", users);
})
.catch(function (error) {
    console.log("ERROR: ", error);
});


 module.exports = db