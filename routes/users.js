// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}
const { check, validationResult } = require('express-validator');


router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    

router.post('/registered', [
    // Validate fields
    check('first').notEmpty().withMessage('First name is required'),
    check('last').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('A valid email is required'),
    check('username').notEmpty().withMessage('Username is required'),
    check('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number'),], function (req, res, next) {

    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('./register'); }
        else { 

    //Retrieve data from form
    const plainPassword = req.body.password;
    const username = req.sanitize(req.body.username);
    const firstName = req.sanitize(req.body.first);
    const lastName = req.sanitize(req.body.last);
    const email = req.body.email;



    //SQL query
    let sqlquery = "INSERT INTO users (firstname, lastname, email, username, hashpassword) VALUES (?,?,?,?,?)"

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {

        //Store hashed password in your database
        if(err){
            next(err);
        } else {
            let newrecord = [firstName, lastName, email, username, hashedPassword]

            db.query(sqlquery, newrecord, (err, result) => {
                if(err){
                    next(err)
                }
                else {
                    //Show that registration is successful
            result = ' Hello '+ firstName + ' '+ lastName +' you are now registered!  We will send an email to you at ' + email;
            result += ' Your password is: ' + plainPassword + ' and your hashed password is: ' + hashedPassword;
            res.send(result); 
                }
            })

        }
      })      
       
    }
})

router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM users" // query database to get all the users
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("userslist.ejs", {availableUsers:result})
     })
})

router.get('/login', function(req, res, next) {
    res.render('login.ejs');
})
router.post('/login', function (req, res) {
    const { username, password } = req.body;

    // Fetch user data from the database based on the provided username
    let userQuery = "SELECT * FROM users WHERE username = ?";
    db.query(userQuery, [username], (err, result) => {
        if (err) {
            console.error(err);
            res.redirect(`./login`);
            return;
        }

        // Check if a user with the provided username exists
        if (result.length === 0) {
            res.send('Invalid username or password');
            return;
        }

        // Extract the hashed password from the database
        const hashedPassword = result[0].hashpassword;

        // Compare the provided password with the hashed password
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                console.error(err);
                res.status(500).send('An error occurred while verifying the password.');
                return;
            }

            if (isMatch) {
                // Save user session here, when login is successful
                req.session.userId = req.body.username;
                // Successful login
                //res.send(`Welcome, ${username}! Login successful.`);
                res.redirect(`./profile`);
            } else {
                // Passwords do not match
                res.send('Invalid username or password');
            }
        });
    });
});

router.get('/profile', redirectLogin, function(req, res, next){
    res.render('profile.ejs')
})

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
      return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'../'+'>Home</a>');
    })
})


// Export the router object so index.js can access it
module.exports = router