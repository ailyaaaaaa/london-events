const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
})
const { check, validationResult } = require('express-validator');

router.get('/search_result', function (req, res, next) {
    // Search the database
    let sqlquery = "SELECT * FROM books WHERE name LIKE '%" + req.query.search_text + "%'" // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
     }) 
})


router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books" // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
     })
})

router.get('/addbook', function (req, res, next) {
    res.render('addbook.ejs')
})

router.post('/bookadded', [
    check('name').notEmpty().withMessage('Name is required'),
    check('price')
        .notEmpty().withMessage('Price is required')
        .isNumeric().withMessage('Price must be a number'),
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Redirect back with errors (use appropriate route like '/addbook')
        res.redirect('/addbook'); 
    } else{

    // Extract validated data
    const name = req.body.name;
    const price = req.body.price;

    // SQL query
    const sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
    const newrecord = [name, price];

    // Execute SQL query
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.send('This book has been added to the database: '+ req.body.name + ' price '+ req.body.price);
        }
    });
    
}});
 

router.get('/bargainbooks', function(req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20"
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("bargains.ejs", {availableBooks:result})
    })
}) 


// Export the router object so index.js can access it
module.exports = router