$(document).ready(() => {
    console.log("ready!");
});
// DOM ELEMNTS
// INITAL DATA
var cityHistory = [];
// A user types in a city
$("#city-info-button").on("click", function () {
    event.preventDefault();
    var citySearch = $("#citySearch").val();
    cityHistory.push(citySearch);
    //window.localStorage.set("history", JSON.stringify(cityHistory));
    getAndShowWeather(citySearch);
});

function getAndShowWeather(city) {
    // Date Display
    var date = moment();
    var dateDisplay = date.format("dddd MMMM Do YYYY");
    $("#date").text(dateDisplay);
    console.log(dateDisplay);
    // a user submits their search
    var citySearch = city;
    var APIKey = "c7629276d88b73d9dee17485c554906b";
    console.log(citySearch);
    var queryURL =
        "http://api.openweathermap.org/data/2.5/weather?q=" +
        citySearch +
        "&appid=c7629276d88b73d9dee17485c554906b" +
        "&units=imperial";
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        var iconCode = response.weather[0].icon;
        var iconImage = "http://openweathermap.org/img/w/" + iconCode + ".png";
        console.log(iconCode);
        $("#icon-image").attr("src", iconImage);
        $("#temperature").text(parseInt(response.main.temp));
        $("#humidity").text(response.main.humidity);
        $("#wind-speed").text(response.wind.speed);
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        var uvURL =
            "http://api.openweathermap.org/data/2.5/uvi?appid=" +
            APIKey +
            "&lat=" +
            latitude +
            "&lon=" +
            longitude;
        console.log("uvURL:", uvURL);
        $.ajax({
            url: uvURL,
            method: "GET",
        }).then(function (response) {
            console.log(response.value);
            var uvIndex = response.value;
            $("#uv-index").text(uvIndex);
            if (uvIndex < 2) {
                $(".index").attr("class", "low");
                console.log("You're safe!");
            }
            if (uvIndex >= 2 && uvIndex <= 5) {
                $(".index").attr("class", "moderate");
                console.log("Getting risky");
            }
            if (uvIndex > 5 && uvIndex <= 7) {
                $(".index").attr("class", "high");
                console.log("Uh oh!");
            }
            if (uvIndex > 7 && uvIndex <= 10) {
                $(".index").attr("class", "very-high");
                console.log("You better stay inside!");
            }
            if (uvIndex > 10) {
                $(".index").attr("class", "extreme");
                console.log("You will ignite on fire");
            }
            // five Day Forecast
            var forecastURL =
                "http://api.openweathermap.org/data/2.5/forecast?q=" +
                citySearch +
                "&appid=c7629276d88b73d9dee17485c554906b" +
                "&units=imperial";
            $.ajax({
                url: forecastURL,
                method: "GET",
            }).then(function (response) {
                console.log(response);
                // day one
                var firstDay = moment(response.list[0].dt_txt).format(
                    "dddd MMMM Do YYYY"
                );
                $("#one").text(firstDay);
                console.log(firstDay);
                $("#temperature-one").text(parseInt(response.list[3].main.temp));
                $("#humidity-one").text(response.list[3].main.humidity);
                $("#wind-speed-one").text(response.list[3].wind.speed);
                var iconCode = response.list[3].weather[0].icon;
                var iconImage = "http://openweathermap.org/img/w/" + iconCode + ".png";
                console.log(iconCode);
                $("#icon-image1").attr("src", iconImage);
                // Day Two
                var secondDay = moment(response.list[11].dt_txt).format(
                    "dddd MMMM Do YYYY"
                );
                $("#two").text(secondDay);
                $("#temperature-two").text(parseInt(response.list[11].main.temp));
                $("#humidity-two").text(response.list[11].main.humidity);
                $("#wind-speed-two").text(response.list[11].wind.speed);
                var iconCode = response.list[11].weather[0].icon;
                var iconImage = "http://openweathermap.org/img/w/" + iconCode + ".png";
                console.log(iconCode);
                $("#icon-image2").attr("src", iconImage);
                // Day Three
                var thirdDay = moment(response.list[19].dt_txt).format(
                    "dddd MMMM Do YYYY"
                );
                $("#three").text(thirdDay);
                $("#temperature-three").text(parseInt(response.list[19].main.temp));
                $("#humidity-three").text(response.list[19].main.humidity);
                $("#wind-speed-three").text(response.list[19].wind.speed);
                var iconCode = response.list[19].weather[0].icon;
                var iconImage = "http://openweathermap.org/img/w/" + iconCode + ".png";
                console.log(iconCode);
                $("#icon-image3").attr("src", iconImage);
                // Day Four
                var fourthDay = moment(response.list[28].dt_txt).format(
                    "dddd MMMM Do YYYY"
                );
                $("#four").text(fourthDay);
                $("#temperature-four").text(parseInt(response.list[28].main.temp));
                $("#humidity-four").text(response.list[28].main.humidity);
                $("#wind-speed-four").text(response.list[28].wind.speed);
                var iconCode = response.list[28].weather[0].icon;
                var iconImage = "http://openweathermap.org/img/w/" + iconCode + ".png";
                console.log(iconCode);
                $("#icon-image4").attr("src", iconImage);
                // Day Five
                var fifthDay = moment(response.list[37].dt_txt).format(
                    "dddd MMMM Do YYYY"
                );
                $("#five").text(fifthDay);
                $("#temperature-five").text(parseInt(response.list[37].main.temp));
                $("#humidity-five").text(response.list[37].main.humidity);
                $("#wind-speed-five").text(response.list[37].wind.speed);
                var iconCode = response.list[37].weather[0].icon;
                var iconImage = "http://openweathermap.org/img/w/" + iconCode + ".png";
                console.log(iconCode);
                $("#icon-image5").attr("src", iconImage);
            });
        });
    });
}