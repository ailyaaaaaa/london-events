// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')

// Render search page
router.get('/',function(req, res, next){
  res.render('weather.ejs')
})

// Weather search by city
router.get('/search_result', function (req, res, next) {
  // API key and search term from city
  const apiKey = 'f1368f0fa39523a28461112aad3e5494'; 
  const city = req.query.city;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  // Checks user has inputted a city name
  if (!city) {
      res.render('weather', { error: 'Please provide a city name.' });
      return;
  }

  request(url, function (err, response, body) {
      if (err) {
          next(err);
      } else {
          const weather = JSON.parse(body);

          if (weather!==undefined && weather.main!==undefined) {
            // Pass data to the EJS template
            res.render('weather_result', {
              city: weather.name,
              temperature: weather.main.temp,
              humidity: weather.main.humidity,
              wind: weather.wind.speed
          });
         }
         else {
            res.send ("No data found");
         }
      }
  });
});

// Export the router object so index.js can access it
module.exports = router