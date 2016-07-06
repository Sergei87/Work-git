
var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://postgres:123@localhost:5432/db");

db.one("SELECT $1 AS value", 123)
    .then(function (data) {
        console.log("DATA:", data.value);
    })
    .catch(function (error) {
        console.log("ERROR:", error);
    });


 module.exports = db