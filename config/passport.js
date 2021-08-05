const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "localhost",
    database: "logindata",
    user: "root",
    password: ""
})