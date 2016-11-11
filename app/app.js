require('./styles/style.scss');

(function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, denied);

    function success(info) {
      var coords = info.coords.latitude + "," + info.coords.longitude;
      // Reverse geocode to obtain location
      reverseGeocode(coords);
      weatherData(coords);
    }

    function denied(info) {
      console.log(info.message);
    }
  }

  function reverseGeocode(coords) {
    var apiKey = 'AIzaSyBWFuPKH-W73LTvZD0TvR6d4yJJ3Bbbw9c';
    $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coords + '&key=' + apiKey, function(response) {
      $.each(response.results, function(key, val) {
        val.types[0] === "locality" || val.types[0] === "neighborhood" && val.types[1] === "political" ? $('.location').html(val.formatted_address) : "";
      });
    })
  }

  function weatherData(coords) {
    $.getJSON('https://api.darksky.net/forecast/8310f3d313f6cea1cafb9db9054c6332/' + coords + '?callback=?', function(response) {
      var skycons = new Skycons({
        'color': 'white'
      });
      skycons.play();
      var current = response.currently;
      currentWeather(response);
      futureWeather(response);

      // Celsius and Fahrenheight conversion
      tempConverter(current);

      function currentWeather(response) {
        var humidity = current.humidity * 100;
        var precip = current.precipProbability;
        var fahrenheit = Math.round(current.temperature) + String.fromCharCode(176) + "F";
        var summary = current.summary;
        var wind = current.windSpeed;
        var icon = current.icon;

        $(".tempSummary").html('<div class="temp">' + fahrenheit +
          '</div>' + '<i class="toggleTemp fa fa-exchange" aria-hidden="true"></i>' +
          '<div class="summary"><b>' + summary + '</b></div>');
        $(".moreInfo").html('<li class="humidity"><b>Humidity: </b>' + humidity + '%</li>' +
          '<li class="precip"><b>Precipitation: </b>' + precip + '%</li>' +
          '<li class="wind"><b>Windspeed: </b>' + wind + 'mph</li>')

        // Set weather icon relative to weather description
        skycons.set(document.getElementById("currentWeatherIcon"), icon);

      }

      function futureWeather(response) {
        var daily = response.daily.data;

        $.each(daily, function(key, future) {
          // Get daily weather information after today's date
          if (key > 0) {
            var html = "";
            var dateInfo = [];
            var tempMin = Math.round(future.temperatureMin);
            var tempMax = Math.round(future.temperatureMax);
            var icons = future.icon;
            var date = new Date(future.time * 1000);

            // Get only date information
            dateInfo.push(date.toUTCString().split(" ").slice(0, 3).join(" "));

            html = "<div class='boxes'><div><b>" + dateInfo + "</div>" +
              "<canvas class='futureWeatherIcon" + key + "' width='50' height='70'></canvas>" +
              "<div class='futureTemp'>" + tempMin + " / " + tempMax + "</b></div></div>";
            $('.dailyForecast').append(html);

            skycons.set(document.querySelector(".futureWeatherIcon" + key), icons);
          }
        });
      }
    });

    function tempConverter(current) {
      var fahrenheit = Math.round(current.temperature) + String.fromCharCode(176) + "F"
      var celsius = Math.round((current.temperature - 32) / 1.8) + String.fromCharCode(176) + "C";
      var tempFArr = [];
      var tempCArr = [];

      $(".futureTemp").each(function() {
         var split = $(this).text().split(" / ");

         var minF = parseInt(split[0]);
         var maxF = parseInt(split[1]);
         var minC = Math.round((minF - 32) / 1.8);
         var maxC = Math.round((maxF - 32) / 1.8);
         var combinedF = minF + " / " + maxF;
         var combinedC = minC + " / " + maxC;
         tempFArr.push(combinedF);
         tempCArr.push(combinedC);
       });

      // Convert to Celsius and vice versa
      $(".toggleTemp").click(function() {
        if ($(".temp").html() === fahrenheit) {
          $(".temp").html(celsius)
          $(".futureTemp").each(function(key) {
             $(this).html("<b>" + tempCArr[key] + "</b>");
          })
        } else {
          $(".temp").html(fahrenheit);
          $(".futureTemp").each(function(key) {
             $(this).html("<b>" + tempFArr[key] + "</b>");
          })
        }
      })
    }
  }
})();
