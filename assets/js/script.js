var searchedCity = document.getElementById("search-city");
var submitButton = document.getElementById("submit-city");
var historyButton = document.getElementById("history");
var previousSearchEl = document.getElementById("previous-searches");
var weatherDisplay = document.querySelectorAll("#weather-display");
var cardConEl = document.getElementById("card-container");
var resetBtn = document.getElementById("reset");
var forecastEl = document.getElementById("forecast");
var apiKey = "309fbc7e18cf879d452be18a2a9572e8";
var currentDay = moment().format('l');
var clickedOldSearch = "";
var previousSearch = [];
weatherDisplay.textContent = "";
forecastEl.textContent = "";


// save the previous searches
var newSave = function () {
    localStorage.setItem('previousSearches', JSON.stringify(previousSearch));
};
// load the previous searches
var loadPrevious = function () {
    if (localStorage.getItem('previousSearches') == null) {
        localStorage.setItem('previousSearches', JSON.stringify(previousSearch))
    };
    previousSearch = JSON.parse(localStorage.getItem('previousSearches'));
    savedPreviousSearch();
};

// use location API to get coordinates of city
var getLocation = function (city) {
    var locationApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;
    fetch(locationApiUrl)
        .then(function (response) {
        response.json()
        .then(function (data) {
            console.log(data);
            var lat = data[0].lat;
            var lon = data[0].lon;
            getWeather(lat, lon);
            });
        });
    savedPreviousSearch();
};

// get value of user's city input
var citySubmitHandler = function (event) {
    event.preventDefault();
    var sumbittedCity = searchedCity.value.trim();
    if (sumbittedCity) {
        getLocation(sumbittedCity);
        previousSearch.push(sumbittedCity);
        searchedCity.value = "";
    };
};

// get coordinates from location API to display current and five day forecasts
var getWeather = function (lat, lon) {
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
    var currentWeather = document.getElementById("current-weather");

    fetch(weatherApiUrl)
        .then(function (response) {
            response.json()
            .then(function (data) {
                currentWeather.textContent = "";
                cardConEl.textContent = "";
                // display current weather
                var currentCity = document.createElement("h3");
                // check if user clicked on a previous search 
                if (previousSearch[i] == undefined) {
                    currentCity.textContent = clickedOldSearch + " (" + currentDay + ")";
                } else {
                    currentCity.textContent = previousSearch[i] + " (" + currentDay + ")";
                };
                currentWeather.appendChild(currentCity);
                var currentTemp = document.createElement("li");
                currentTemp.textContent = "Temp: " + data.current.temp + "°F";
                currentCity.append(currentTemp);
                var currentIcon = document.createElement("li");
                currentIcon.innerHTML = '<img src="http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png" width="50px" height="50px" alt="">';
                currentCity.append(currentIcon);
                var currentWind = document.createElement("li");
                currentWind.textContent = "Wind: " + data.current.wind_speed + " MPH";
                currentCity.append(currentWind);
                var currentHum = document.createElement("li");
                currentHum.textContent = "Humidity: " + data.current.humidity + " %";
                currentCity.append(currentHum);

                // display UV index with color scale
                var uvIndex = document.createElement("li");
                uvIndex.setAttribute("id", "uv-index");
                currentCity.append(uvIndex);
                var currentUvi = document.createElement("p");
                currentUvi.textContent = "UV Index: ";
                uvIndex.appendChild(currentUvi);
                var currentUvColor = document.createElement("p");
                currentUvColor.textContent = data.current.uvi;
                currentUvColor.setAttribute("id", "uv-color");
                if (data.current.uvi < 2) {
                    currentUvColor.setAttribute("style", "background: green;");
                } else if (2 < data.current.uvi < 5) {
                    currentUvColor.setAttribute("style", "background: yellow; color: black;");
                } else if (6 < data.current.uvi < 7) {
                    currentUvColor.setAttribute("style", "background: orange;");
                } else if (8 < data.current.uvi < 10) {
                    currentUvColor.setAttribute("style", "background: red;");
                } else if (10 < data, current.uvi) {
                    currentUvColor.setAttribute("style", "background: rgb(0, 153, 255);");
                };
                uvIndex.appendChild(currentUvColor);

                forecastEl.textContent = "5-Day Forecast:";

                //  five day forecast 
                for (i = 1; i < data.daily.length - 2; i++) {
                    var cardEl = document.createElement("ul");
                    cardEl.setAttribute("id", "card");
                    cardConEl.appendChild(cardEl);
                    cardDate = document.createElement("h4");
                    cardDate.innerHTML = moment().add([i], "days").format("l");
                    cardEl.appendChild(cardDate);
                    currentCity.appendChild(currentTemp);
                    var cardIcon = document.createElement("li");
                    cardIcon.innerHTML = '<img src="http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '@2x.png" width="50px" height="50px" alt="">';
                    cardEl.appendChild(cardIcon);
                    var cardTemp = document.createElement("li");
                    cardTemp.textContent = "Temp: " + data.daily[i].temp.day + "°F";
                    cardEl.appendChild(cardTemp);
                    var cardWind = document.createElement("li");
                    cardWind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
                    cardEl.appendChild(cardWind);
                    var cardHum = document.createElement("li");
                    cardHum.textContent = "Humidity: " + data.daily[i].humidity + " %";
                    cardEl.appendChild(cardHum);
                };

            });
        });

};

// turn previous searches into buttons for user to click on
var savedPreviousSearch = function () {
    previousSearchEl.innerHTML = "";

    for (i = 0; i < previousSearch.length; i++) {
        var previousCity = document.createElement("p")
        previousCity.textContent = previousSearch[i];
        previousCity.setAttribute("class", previousSearch[i]);
        previousCity.setAttribute("id", "previous-search");
        previousSearchEl.appendChild(previousCity);
    };
    // save to localStorage
    newSave();
};

// clear search history with reset button
var searchReset = function (event) {
    previousSearch = [];
    localStorage.clear();
    previousSearchEl.innerHTML = "";
};

// check for old searches
document.addEventListener("click", function (event) {
    if (event.target.id == "previous-search") {
        var oldSearch = event.target.textContent;
        clickedOldSearch = oldSearch;
        getLocation(oldSearch);
    };
});

// submit button event listener 
submitButton.addEventListener("click", citySubmitHandler);

// reset button event listener 
resetBtn.addEventListener("click", searchReset);

// load previous searches
loadPrevious();