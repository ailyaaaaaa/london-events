// Import express, ejs, mysql, session, validator, and sanitizer
var express = require ('express')
var ejs = require('ejs')
var mysql = require('mysql2')
var session = require ('express-session')
var validator = require ('express-validator');
const expressSanitizer = require('express-sanitizer');

// Create the express application object
const app = express()
const port = 8000

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Create an input sanitizer
app.use(expressSanitizer());

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and statis js)
app.use(express.static(__dirname + '/public'))

// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Define the database connection
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'london_events_app',
    password: 'qwertyuiop',
    database: 'london_events'
})

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('Connected to database')
})
global.db = db

// Define our application-specific data
app.locals.data = {name: "London Events"}

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Load the route handlers for /events
const eventsRoutes = require('./routes/events')
app.use('/events', eventsRoutes)

// Load the route handlers for /weather
const weatherRoutes = require('./routes/weather')
app.use('/weather', weatherRoutes)

// Load the route handlers for /api
const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`))