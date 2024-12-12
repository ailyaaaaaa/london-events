// Create a new router
const express = require("express")
const router = express.Router()
const { check, validationResult } = require('express-validator');

// Render the search page
router.get('/search',function(req, res, next){
    res.render("search.ejs")
})

// Render the search results
router.get('/search_result', function (req, res, next) {
    // Query database to get all events that match
    let sqlquery = "SELECT * FROM events WHERE name LIKE '%" + req.query.search_text + "%'"
    // Execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableEvents:result})
     }) 
})

// List all events
router.get('/list', function(req, res, next) {
    // Query database
    let sqlquery = "SELECT * FROM events"
    // Execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableEvents:result})
     })
})

// Render page to add a new event
router.get('/addevent', function (req, res, next) {
    res.render('addevent.ejs')
})

// Add the new event
router.post('/eventadded', [
    check('name').notEmpty().withMessage('Name is required'),
    check('description').notEmpty().withMessage('Description is required'),
    check('start_time').notEmpty().withMessage('Start time is required'),
    check('location').notEmpty().withMessage('Location is required'),
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Redirect back
        res.redirect('/addevent'); 
    } else{

    // Extract validated data
    const name = req.body.name;
    const description = req.body.description;
    const start_time = req.body.start_time;
    const end_time = req.body.end_time;
    const location = req.body.location;
    const organiser = req.body.organiser;

    // SQL query
    const sqlquery = "INSERT INTO events (name, description, start_time, end_time, location, organiser) VALUES (?,?,?,?,?,?)";
    const newrecord = [name, description, start_time, end_time, location, organiser];

    // Execute SQL query
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render('list.ejs')
        }
    });
    
}});

// Export the router object so index.js can access it
module.exports = router