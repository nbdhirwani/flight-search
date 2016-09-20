var rootURL = 'http://localhost:3000';

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
  var travelDate = $('#travel-date-txt').val();
  var fromPort = $('#from-hdn').val();
  var toPort = $('#to-hdn').val();
  var flightSearchURL = rootURL + '/search?date=' + travelDate + '&from=' + fromPort + '&to=' + toPort;

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
