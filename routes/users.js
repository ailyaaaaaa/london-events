// Create a new router
const express = require("express")
const router = express.Router()
const mysql = require('mysql');
const bcrypt = require('bcrypt')
const saltRounds = 10

// Handle redirects
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}
const redirectProfile = (req, res, next) => {
    if (req.session.userId) {
      res.redirect('./profile') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}
const { check, validationResult } = require('express-validator');

// Render the register page
router.get('/register', redirectProfile, function (req, res, next) {
    res.render('register.ejs')                                                               
})    

// Add a new user
router.post('/registered', [
    // Validate fields
    check('first').notEmpty().withMessage('First name is required'),
    check('last').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('A valid email is required'),
    check('username').notEmpty().withMessage('Username is required'),
    check('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number'),], function (req, res, next) {

        // Redirect to the register page if there are any errors
        const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.redirect('./register'); }
            else { 
                // Retrieve data from form
                const plainPassword = req.body.password;
                const username = req.sanitize(req.body.username);
                const firstName = req.sanitize(req.body.first);
                const lastName = req.sanitize(req.body.last);
                const email = req.body.email;

                // SQL query
                let sqlquery = "INSERT INTO users (firstname, lastname, email, username, hashpassword) VALUES (?,?,?,?,?)"

                // Hash the password
                bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {

                    // Store hashed password in your database
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
                                res.redirect('profile'); 
                            }
                        })

                    }
                })      
                
            }
})

// Render list of users
router.get('/list', redirectLogin, function(req, res, next) {
    // Query database to get all the users
    let sqlquery = "SELECT * FROM users" 
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("userslist.ejs", {availableUsers:result})
     })
})

//Render login page
router.get('/login', redirectProfile, function(req, res, next) {
    res.render('login.ejs');
})

// Check user's login details
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
                res.redirect(`./profile`);
            } else {
                // Passwords do not match
                res.send('Invalid username or password');
            }
        });
    });
});

// Render profile page
router.get('/profile', redirectLogin, function(req, res, next){
    const userId = req.session.userId;
    const query = 'SELECT firstname, lastname, username FROM users WHERE username = ?';
    
    db.query(query, [userId], (err, results) => {
        if (err) {
          console.log('Database error:', err);
          return res.status(500).send('Database error');
        }
        
        if (results.length > 0) {
          const user = results[0]; // Since the query should return only one user
          res.render('profile', { 
            firstName: user.firstname,
            lastName: user.lastname,
            username: user.username
          });
        } else {
          console.log('No user found with ID:', userId); // Log for debugging
          res.status(404).send('User not found');
        }
      });
})

// Logout
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