const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const nodemailer = require('nodemailer');


const connection = mysql.createConnection({
    host: "localhost",
    database: "logindata",
    user: "root",
    password: ""
})
var transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "shivamvijay543@gmail.com",
        pass: "vijay@2001"
    }
});
var message;



router.get('/register', (req, res) => {
    res.render('register');
   


})
router.get('/login', (req, res) => {
    res.render('login');

})
var userName;
router.post('/register', (req, res) => {

    const {
        name,
        email,
        password,
        password2
    } = req.body;
    let errors = [];
    userName = name;
    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: 'Please fill in all field'
        });
    } else {
        if (password !== '' && password2 !== '') {
            //check passwords matching
            if (password !== password2) {
                errors.push({
                    msg: "passwords do not match"
                });
            }

            //Check pass lengths
            if (password.length < 6) {
                errors.push({
                    msg: "password should be atleast 6 characters"
                });
            }
        }
    }


    connection.query('SELECT * FROM registerdata WHERE email=?', [email], (err, res) => {
        if (err) {
            console.log(err);
        }
        if (res.length > 0) {
            errors.push({
                msg: "This email id is already in use"
            });

        }
    })
    setTimeout(() => {
        if (errors.length > 0) {
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            });
        } else {
            const {
                name,
                email,
                password,
                password2
            } = req.body;





            var tabledata = "INSERT INTO registerdata (name,email,password,confirmpassword) VALUES ?";
            var values = [
                [name, email, password, password2]

            ];
            connection.query(tabledata, [values], function(err, result) {
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
            });

            req.flash('success_msg','You are now registered and can log in');
            res.redirect('/users/login');

        }
    }, 1000)



})
router.post('/login', (req, res) => {
    const {
        email,
        password
    } = req.body;
    let errors = [];

    if (!email || !password) {
        errors.push({
            msg: 'Please fill in all field'
        });
    } else {
        connection.query('SELECT * FROM registerdata WHERE email=? AND password=?', [email, password], (err, res) => {
            if (err) {
                console.log(err);
            }
            if (res.length === 0) {
                errors.push({
                    msg: "This email id is not registered"
                });

            }
        })
    }

    setTimeout(() => {
        if (errors.length > 0) {
            res.render('login', {
                errors,
                email,
                password
            });
        } else {

            message = {
                from: 'shivamvijay543@gmail.com', // Sender address
                to: `${req.body.email}`, // List of recipients
                subject: 'Testing Nodejs mailer', // Subject line
                text: 'Hey!This is Shivam Vijay ,Welcome to nodejs mailer' // Plain text body
            };
            transport.sendMail(message, function(err, info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info);
                }
            });
            res.render('dashboard', {

                name: req.body.email
            })

        }
    }, 1000)
})

module.exports = router;