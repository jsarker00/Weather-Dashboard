//DOM Elements
var cityHistoryEl = $("#history");
var weatherCard = $("#weather");
var futureWeatherCards = $("#futureWeather");
//Initialize
var cityHistory = [];
var temperature;
var humidity;
var windSpeed;
var city = "Brooklyn";
var icon;
var futureWeather;
//need some extras for uvIndex
var lon;
var lat;
var uvIndex;
$("#searchButton").on("click", function (event) {
  event.preventDefault();
  //get the city input from the input box
  city = $("#cityInput").val();
  //city = "New York City";
  //check that something was input. If not, return
  if (city === "") {
    return;
  }
  //run to populate the weather info
  ajaxWeatherQuery(populateToday);
  cityHistory.unshift(city);
  createHistoryButtons();
  localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
});
//create buttons of the history of the searches
function createHistoryButtons() {
  cityHistoryEl.empty();
  for (var j = 0; j < cityHistory.length; j++) {
    var newLI = $("<li>");
    var newButton = $("<button>");
    newButton.addClass("btn btn-secondary btn-history");
    newButton.attr("data-city", cityHistory[j]);
    newButton.text(cityHistory[j]);
    newLI.append(newButton);
    cityHistoryEl.append(newLI);
  }
}
$(document).on("click", ".btn-history", function () {
  event.preventDefault();
  city = $(this).data("city");
  ajaxWeatherQuery(populateToday);
});
//use this to call ajax
function ajaxWeatherQuery(popPage) {
  var cityHistoryCheck = JSON.parse(localStorage.getItem("cityHistory"));
  if (cityHistoryCheck !== null) {
    cityHistory = cityHistoryCheck;
  } else {
    cityHistory = [];
  }
  //get the weather info of the city
  var queryCityURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=67f994b6ac288057dbc392568e7e908b";
  //ajax to call the above URL for the city
  $.ajax({
    url: queryCityURL,
    method: "GET",
  }).then(function (response) {
    //grab the info we just got
    temperature = Math.round(response.main.temp);
    humidity = response.main.humidity;
    windSpeed = response.wind.speed;
    icon = response.weather[0].icon;
    //getting the longitude and latitude
    lon = response.coord.lon;
    lat = response.coord.lat;
    //using lat and lon to get the UV index
    var queryUVURL =
      "https://api.openweathermap.org/data/2.5/uvi?appid=67f994b6ac288057dbc392568e7e908b&lat=" +
      lat +
      "&lon=" +
      lon;
    $.ajax({
      url: queryUVURL,
      method: "GET",
    }).then(function (uvResponse) {
      uvIndex = uvResponse.value;
      //calling populatePage here cause async is annoying
      popPage();
    });
  });
  var queryFutureURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=67f994b6ac288057dbc392568e7e908b";
  $.ajax({
    url: queryFutureURL,
    method: "GET",
  }).then(function (futureResponse) {
    futureWeather = futureResponse;
  });
}

function populateToday() {
  weatherCard.empty();
  //create a card-body
  var cardBody = $("<div>");
  cardBody.addClass("card-body");
  //create a title with the city name
  var titleEl = $("<h2>");
  titleEl.addClass("card-title");
  titleEl.text(city);
  //create the weather icon
  var iconEl = $("<img>");
  var iconURL = "https://openweathermap.org/img/w/" + icon + ".png";
  iconEl.attr("src", iconURL);
  iconEl.attr("alt", "icon of the weather");
  titleEl.append(iconEl);
  //add title to card
  cardBody.append(titleEl);
  //create a subtitle with the date
  var subtitleEl = $("<div>");
  //add subtitle to card
  subtitleEl.addClass("card-subtitle");
  subtitleEl.text(moment().format("dddd, MMMM Do YYYY"));
  cardBody.append(subtitleEl);
  //create a p with temp
  var tempEl = $("<p>");
  tempEl.text("Temperature: " + temperature + "°F");
  //add temp to card
  cardBody.append(tempEl);
  //create a p with humidity
  var humidityEl = $("<p>");
  humidityEl.text("Humidity: " + humidity + "%");
  //add humidity to card
  cardBody.append(humidityEl);
  //create a p with wind speed
  var windSpeedEl = $("<p>");
  windSpeedEl.text("Wind Speed: " + windSpeed + "MPH");
  //add speed to card
  cardBody.append(windSpeedEl);
  //create a p with uv index
  var uvIndexEl = $("<p>");
  console.log(uvIndex);
  uvIndexEl.text("UV Index: " + uvIndex);
  //set color according to danger level
  if (uvIndex <= 2) {
    uvIndexEl.css("background-color", "green");
  } else if (uvIndex <= 5) {
    uvIndexEl.css("background-color", "yellow");
  } else if (uvIndex <= 7) {
    uvIndexEl.css("background-color", "orange");
  } else {
    uvIndexEl.css("background-color", "red");
  }
  uvIndexEl.css("color", "white");
  uvIndexEl.css("width", "120px");
  //add uv index to card
  cardBody.append(uvIndexEl);
  //append card-body to card
  weatherCard.append(cardBody);
  //clear future cards what is already there
  for (var i = 4; i <= 40; i = i + 8) {
    populateFuture(i);
  }
}

function populateFuture(day) {
  //clear on first run through
  if (day === 4) {
    futureWeatherCards.empty();
  }
  //create cards for future
  var dayPlus = $("<div>");
  dayPlus.addClass("card card-forecast");
  dayPlus.attr("width", "20%");
  //the date is at the top
  var dayPlusDate = $("<div>");
  dayPlusDate.addClass("card-title");
  dayPlusDate.text(futureWeather.list[day].dt_txt.substr(0, 10));
  dayPlus.append(dayPlusDate);
  //grabbing the icon to show
  var dayPlusIcon = $("<img>");
  var dayPlusIconVal = futureWeather.list[day].weather[0].icon;
  var dayPlusIconUrl =
    "https://openweathermap.org/img/w/" + dayPlusIconVal + ".png";
  dayPlusIcon.attr("src", dayPlusIconUrl);
  dayPlusIcon.attr("alt", "icon for future day");
  dayPlus.append(dayPlusIcon);
  //show the future date temp
  var dayPlusTemp = $("<p>");
  dayPlusTemp.text(
    "Temperature: " + Math.round(futureWeather.list[day].main.temp) + "°F"
  );
  dayPlus.append(dayPlusTemp);
  //show the future date humidity
  var dayPlusHumidity = $("<p>");
  dayPlusHumidity.text(
    "Humidity: " + futureWeather.list[day].main.humidity + "%"
  );
  dayPlus.append(dayPlusHumidity);
  //append to page
  futureWeatherCards.append(dayPlus);
}

function loadPage() {
  var cityHistoryCheck = JSON.parse(localStorage.getItem("cityHistory"));
  if (cityHistoryCheck !== null) {
    city = cityHistoryCheck[0];
  }
}
//populate the weather with the default
loadPage();
ajaxWeatherQuery(populateToday);
createHistoryButtons();