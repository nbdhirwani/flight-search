var rootURL = 'http://node.locomote.com/code-task';

$(document).ready(function() {
  var airlinesURL = rootURL + '/airlines';
  $.ajax({
      type: 'GET',
      url: airlinesURL,
      dataType: "json", // data type of response
      success: populateAirlines
  });
});

$('#from-txt').on('input', function(){
  var fromPort = $('#from-txt').val();
  if(fromPort.length >= 2){
    findAirport(fromPort, populateFromAirports);
  }
});

$('#to-txt').on('input', function(){
  var fromPort = $('#to-txt').val();
  if(fromPort.length >= 2){
    findAirport(fromPort, populateToAirports);
  }
});

$('#search-btn').on('click', function(){
  findFlights();
})

function populateAirlines(data) {
  var airlineSelection = $('#airline-sel');
  airlineSelection.find('option').remove();
  $.each(data, function(key, value){
    airlineSelection.append('<option value=' + value.code + '>' + value.name + '</option>');
  });
}

function findAirport(name, successCallBack) {
  var airportURL = rootURL + '/airports?q=' + name;
  $.ajax({
      type: 'GET',
      url: airportURL,
      dataType: "json", // data type of response
      success: successCallBack
  });
}

function populateFromAirports(data) {
  var airports = new Array();
  $.each(data, function(key, value) {
    var airport = new Object();
    airport.value = value.airportName + ', ' + value.cityName + '(' + value.airportCode + ')';
    airport.data = value.airportCode;
    airports.push(airport);
  });

  $('#from-txt').autocomplete({
    lookup: airports
  });
}

function populateToAirports(data) {
  var airports = new Array();
  $.each(data, function(key, value) {
    var airport = new Object();
    airport.value = value.airportName + ', ' + value.cityName + '(' + value.airportCode + ')';
    airport.data = value.airportCode;
    airports.push(airport);
  });

  $('#to-txt').autocomplete({
    lookup: airports
  });
}

function findFlights(){
  var airlineCode = $('#airline-sel').val();
  var travelDate = $('#travel-date-txt').val();
  var fromPort = $('#from-txt').val();
  var toPort = $('#to-txt').val();
  var flightSearchURL = rootURL + 'flight_search' + airlineCode + '?date=' + travelDate + '&from=' + fromPort + '&to=' + toPort;

  console.log(flightSearchURL);

  $.ajax({
      type: 'GET',
      url: flightSearchURL,
      dataType: "json", // data type of response
      success: renderFlightInformation
  });
}
