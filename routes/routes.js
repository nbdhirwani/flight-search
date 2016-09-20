var appRouter = function(app, request) {
  var targetHostRootUrl = "http://node.locomote.com/code-task";

// Route configuration for airports
  app.get("/airports", function(req, res) {
      if(!req.query.q) {
        return res.send({"status": "error", "message": "missing query parameter"});
      }

      var queryPhrase = req.query.q;

      if (queryPhrase.length < 2) {
        return res.send([]);
      } else {
        var airportsUrl = targetHostRootUrl + "/airports?q=" + queryPhrase;
        request(airportsUrl, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            res.send(JSON.parse(body));
          } else {
            console.log(error, response.statusCode, body);
          }
          res.end("");
        });
    }
  });

// Route configuration for search
  app.get("/search", function(req, res) {

    if(!req.query.date || !req.query.from || !req.query.to) {
      return res.send({"status": "error", "message": "missing query parameter"});
    }

    var fromPort = req.query.from;
    var toPort = req.query.to;
    var travelDateStart = getFirstDateOfTravel(req.query.date);

    var airlinesUrl = targetHostRootUrl + "/airlines";

    request(airlinesUrl, function(airlinesError, airlinesResponse, airlinesBody) {
      if(!airlinesError && airlinesResponse.statusCode == 200) {
        var airlines = JSON.parse(airlinesBody);
        var input = {airlines: airlines, travelDateStart: travelDateStart, fromPort: fromPort, toPort: toPort};
        processAirlines(input, res);
      } else {
        console.log(airlinesError, airlinesResponse.statusCode, airlinesBody);
      }
    });
  });

  function processAirlines(input, res) {
    var output = new Array();
    for(counter = 0 ; counter < 5 ; counter++) {
      var currentTravelDate = new Date(input.travelDateStart);
      currentTravelDate.setDate(currentTravelDate.getDate() + counter);
      input.currentTravelDate = currentTravelDate;
      var searchResultsForAllAirlinesForOneDay = new Array();
      input.airlines.forEach(function(airline){
        input.airlineCode = airline.code;
        var searchUrl = buildFlightSearchUrl(input);
        request(searchUrl, function(searchError, searchResponse, searchBody) {
          if (!searchError && searchResponse.statusCode == 200) {
            var searchResultsFromOrigin = JSON.parse(searchBody);
            var searchResultsForOneAirline = new Array();
            for(var index in searchResultsFromOrigin) {
              var searchResultFromOrigin = searchResultsFromOrigin[index];
              searchResultsForOneAirline.push({
                airlineName: searchResultFromOrigin.airline.name,

                deparureDate: searchResultFromOrigin.start.dateTime,
                deparureAirport: searchResultFromOrigin.start.airportName,
                deparureCity: searchResultFromOrigin.start.cityName,
                deparureCountry: searchResultFromOrigin.start.countryName,

                arrivalDate: searchResultFromOrigin.finish.dateTime,
                arrivalAirport: searchResultFromOrigin.finish.airportName,
                arrivalCity: searchResultFromOrigin.finish.cityName,
                arrivalCountry: searchResultFromOrigin.finish.countryName,

                aircraftName: searchResultFromOrigin.plane.shortName,

                price: searchResultFromOrigin.price
              });
            }
            console.log("searchResultsForOneAirline:::::::: " + JSON.stringify(searchResultsForOneAirline));
            searchResultsForAllAirlinesForOneDay.concat(searchResultsForOneAirline);
          } else {
            console.log(searchError, searchResponse.statusCode, searchBody);
          }
        });
      });
      output.push({travelDate: currentTravelDate, searchResultsByTravelDate: searchResultsForAllAirlinesForOneDay})
    }
    res.send(output);
    res.end("");
  }

  function buildFlightSearchUrl(input) {
    return targetHostRootUrl + "/flight_search/" + input.airlineCode + "?date=" + formatDate(input.currentTravelDate) + "&from=" + input.fromPort + "&to=" + input.toPort;
  }

  function getFirstDateOfTravel(selectedDate) {
    var travelDateStart = parseDate(selectedDate);
    travelDateStart.setDate(travelDateStart.getDate() - 2);
    return travelDateStart;
  }

  function formatDate(input) {

    var dd = input.getDate();
    if ( dd < 10 ) dd = "0" + dd;

    var mm = input.getMonth() + 1;
    if ( mm < 10 ) mm = "0" + mm;

    return input.getFullYear() + "-" + mm + "-" + dd;
  }

  function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
  }
}

module.exports = appRouter;
