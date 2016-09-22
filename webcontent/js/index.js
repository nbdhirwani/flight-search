// var rootURL = "http://localhost:3000";
var rootURL = "http://node.locomote.com/code-task";
// Set up airline selection
$(document).ready(function() {
  var airlinesURL = rootURL + "/airlines";
  $.ajax({
      type: "GET",
      url: airlinesURL,
      dataType: "json", // data type of response
      success: populateAirlines
  });
});

function populateAirlines(data) {
  var airlineSelection = $("#airline-sel");
  airlineSelection.find("option").remove();
  $.each(data, function(key, value){
    airlineSelection.append("<option value=" + value.code + ">" + value.name + " [" + value.code + "]" + "</option>");
  });
}

// Set up from-txt autocomplete
var optionsFrom = {
  url: function(phrase) {
    return rootURL + "/airports?q=" + phrase;
  },
  getValue: function(element){
    return element.airportName + ", " + element.cityName + " [" + element.airportCode + "]";
  },
  list: {
    onSelectItemEvent: function() {
      var selectedItemValue = $("#from-txt").getSelectedItemData().airportCode;
      $("#from-hdn").val(selectedItemValue).trigger("change");
    }
  }
};
$("#from-txt").easyAutocomplete(optionsFrom);

// Set up to-txt autocomplete
var optionsTo = {
  url: function(phrase) {
    return rootURL + "/airports?q=" + phrase;
  },
  getValue: function(element){
    return element.airportName + ", " + element.cityName + " [" + element.airportCode + "]";
  },
  list: {
    onSelectItemEvent: function() {
      var selectedItemValue = $("#to-txt").getSelectedItemData().airportCode;
      $("#to-hdn").val(selectedItemValue).trigger("change");
    }
  }
};
$("#to-txt").easyAutocomplete(optionsTo);


// Set up button click event
$("#search-btn").on("click", function(e){
  e.preventDefault();
  findFlights();
})

function findFlights(){
  var travelDate = $("#travel-date-txt").val();
  var fromPort = $("#from-hdn").val();
  var toPort = $("#to-hdn").val();
  var airline = $("#airline-sel").val();
  var flightSearchURL = rootURL + "/flight_search/"+ airline + "?date=" + travelDate + "&from=" + fromPort + "&to=" + toPort;

  $.ajax({
      type: "GET",
      url: flightSearchURL,
      dataType: "json", // data type of response
      success: renderFlightInformation
  });
}

function renderFlightInformation(data){

  var dataSet = [];
  for(var index in data) {
    dataSet.push([
      data[index].airline.name,
      data[index].start.dateTime,
      data[index].start.airportName,
      data[index].start.cityName,
      data[index].start.countryName,
      data[index].finish.dateTime,
      data[index].finish.airportName,
      data[index].finish.cityName,
      data[index].finish.countryName,
      data[index].plane.shortName,
      "$" + data[index].price
    ]);
  }
  console.log(JSON.stringify(dataSet));
  $('#result').DataTable({
    destroy: true,
    searching: false,
    data: dataSet,
    order: [[ 10, "asc" ]],
    columns: [
        { title: "Airline Name" },
        { title: "Departure Date" },
        { title: "Departure Airport" },
        { title: "Departure City" },
        { title: "Departure Country" },
        { title: "Arrival Date" },
        { title: "Arrival Airport" },
        { title: "Arrival City" },
        { title: "Arrival Country" },
        { title: "Aircraft" },
        { title: "Price" }
      ]
    });
}
