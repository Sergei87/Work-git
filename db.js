
let pgp = require("pg-promise")(/*options*/);
let db = pgp("postgres://postgres:123@localhost:5432/test");


db.any("SELECT * FROM users")
.then(function (users) {
    console.log("email:", users);
})
.catch(function (error) {
    console.log("ERROR: ", error);
});


 module.exports = db;