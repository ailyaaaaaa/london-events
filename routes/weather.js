// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')

let apiKey = 'f1368f0fa39523a28461112aad3e5494'
// Handle our routes

router.get('/',function(req, res, next){
  res.render('weather.ejs')
})

router.get('/londonnow',function(req, res, next){
    
        let city = 'london'
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}` 

        request(url, function (err, response, body) {
          if(err){
            next(err)
          } else {
            //res.send(body)
            var weather = JSON.parse(body)
            var wmsg = 'It is '+ weather.main.temp + 
            ' degrees in '+ weather.name +
            '! <br> The humidity now is: ' + 
            weather.main.humidity;
            res.send (wmsg);

          } 
        });
})

// Weather search by city
router.get('/search_result', function (req, res, next) {
  const apiKey = 'f1368f0fa39523a28461112aad3e5494'; // Declare explicitly to avoid scoping issues
  const city = req.query.city; // Retrieve city name from query string
  
  if (!city) {
      res.render('weather', { error: 'Please provide a city name.' });
      return;
  }

  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

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