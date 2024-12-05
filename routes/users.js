// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    

router.post('/registered', function (req, res, next) {

    //Retrieve data from form
    const plainPassword = req.body.password;
    const username = req.body.username;
    const firstName = req.body.first;
    const lastName = req.body.last;
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
                                                                           
})

router.get('/list', function(req, res, next) {
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
            res.send(`Welcome, ${username}`);
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
                // Successful login
                res.send(`Welcome, ${username}! Login successful.`);
            } else {
                // Passwords do not match
                res.send('Invalid username or password');
            }
        });
    });
});

// Export the router object so index.js can access it
module.exports = router