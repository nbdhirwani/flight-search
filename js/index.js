var rootURL = 'http://node.locomote.com/code-task';

// Set up airlines selection
$(document).ready(function() {
  var airlinesURL = rootURL + '/airlines';
  $.ajax({
      type: 'GET',
      url: airlinesURL,
      dataType: "json", // data type of response
      success: populateAirlines
  });
});

function populateAirlines(data) {
  var airlineSelection = $('#airline-sel');
  airlineSelection.find('option').remove();
  $.each(data, function(key, value){
    airlineSelection.append('<option value=' + value.code + '>' + value.name + '</option>');
  });
}

// Set up from-txt autocomplete
var optionsFrom = {
  url: function(phrase) {
    return rootURL + '/airports?q=' + phrase;
  },
  getValue: function(element){
    return element.airportName + ', ' + element.cityName + ' [' + element.airportCode + ']';
  },
  list: {
    onSelectItemEvent: function() {
      var selectedItemValue = $("#from-txt").getSelectedItemData().airportCode;
      $("#from-hdn").val(selectedItemValue).trigger("change");
    }
  }
};
$('#from-txt').easyAutocomplete(optionsFrom);

// Set up to-txt autocomplete
var optionsTo = {
  url: function(phrase) {
    return rootURL + '/airports?q=' + phrase;
  },
  getValue: function(element){
    return element.airportName + ', ' + element.cityName + ' [' + element.airportCode + ']';
  },
  list: {
    onSelectItemEvent: function() {
      var selectedItemValue = $("#to-txt").getSelectedItemData().airportCode;
      $("#to-hdn").val(selectedItemValue).trigger("change");
    }
  }
};
$('#to-txt').easyAutocomplete(optionsTo);


// Set up button click event
$('#search-btn').on('click', function(){
  findFlights();
})

function findFlights(){
  var airlineCode = $('#airline-sel').val();
  var travelDate = $('#travel-date-txt').val();
  var fromPort = $('#from-hdn').val();
  var toPort = $('#to-hdn').val();
  var flightSearchURL = rootURL + '/flight_search/' + airlineCode + '?date=' + travelDate + '&from=' + fromPort + '&to=' + toPort;

  $.ajax({
      type: 'GET',
      url: flightSearchURL,
      dataType: "json", // data type of response
      success: renderFlightInformation
  });
}

function renderFlightInformation(data){
  console.log('Airline Name: ' + data[0].airline.name);
}
