var userCity = document.getElementById("search-city");
var submitBtn = document.getElementById("submit-city");
var previousSearchDisp = document.getElementById("previous-searches");
var resetBtn = document.getElementById("reset");
var weatherDisp = document.querySelectorAll("#weather-display");
var forecastDisp = document.getElementById("forecast");
var fiveDayCard = document.getElementById("five-day-card");
var currentDay = moment().format('l');
var previousSearches = [];
var clickedPrevious = "";
var apiKey = "309fbc7e18cf879d452be18a2a9572e8";
forecastDisp.textContent = "";
weatherDisp.textContent = "";

// save the previous searches
var saveSearch = function () {
    localStorage.setItem('previousSearches', JSON.stringify(previousSearches));
};
// load the previous searches
var loadPrevious = function () {
    if (localStorage.getItem('previousSearches') == null) {
        localStorage.setItem('previousSearches', JSON.stringify(previousSearches))
    };
    previousSearches = JSON.parse(localStorage.getItem('previousSearches'));
    savePreviousSearch();
};

// use location API to get coordinates of city
var fetchLocation = function (city) {
    var locationApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;
    fetch(locationApiUrl)
        .then(function (response) {
        response.json()
        .then(function (data) {
            console.log(data);
            var latitude = data[0].lat;
            var longitude = data[0].lon;
            fetchWeather(latitude, longitude);
            });
        });
    savePreviousSearch();
};

// get value of user's city input
var submitCity = function (event) {
    event.preventDefault();
    var chosenCity = userCity.value.trim();
    if (chosenCity) {
        fetchLocation(chosenCity);
        previousSearches.push(chosenCity);
        userCity.value = "";
    };
};

// get coordinates from location API to display current and five day forecasts
var fetchWeather = function (latitude, longitude) {
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;
    var currentWeather = document.getElementById("current-weather");
    fetch(weatherApiUrl).then(function (response) {
        response.json().then(function (data) {
            currentWeather.textContent = "";
            fiveDayCard.textContent = "";
            // display current weather
            var currentCity = document.createElement("h3");
            // check if user clicked on a previous search 
                if (previousSearches[i] == undefined) {
                    currentCity.textContent = clickedPrevious + " (" + currentDay + ")";
                } else {
                    currentCity.textContent = previousSearches[i] + " (" + currentDay + ")";
                };
                // display city with weather icon
                currentWeather.appendChild(currentCity);
                var currentIcon = document.createElement("li");
                currentIcon.innerHTML = '<img src="http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png" width="50px" height="50px" alt="">';
                currentCity.appendChild(currentIcon);
                // display temp, wind, and humidity
                var currentTemp = document.createElement("li");
                currentTemp.textContent = "Temp: " + data.current.temp + "°F";
                currentWeather.appendChild(currentTemp);
                var currentWind = document.createElement("li");
                currentWind.textContent = "Wind: " + data.current.wind_speed + " MPH";
                currentWeather.appendChild(currentWind);
                var currentHum = document.createElement("li");
                currentHum.textContent = "Humidity: " + data.current.humidity + " %";
                currentWeather.appendChild(currentHum);
                // display UV index with color scale
                var uvIndex = document.createElement("li");
                uvIndex.setAttribute("id", "uv-index");
                currentWeather.appendChild(uvIndex);
                var currentUvIndex = document.createElement("div");
                currentUvIndex.textContent = "UV Index: ";
                uvIndex.appendChild(currentUvIndex);
                var currentUvColor = document.createElement("div");
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

                forecastDisp.textContent = "5-Day Forecast:";

                //  five day forecast 
                for (i = 1; i < data.daily.length - 2; i++) {
                    var cardEl = document.createElement("ul");
                    cardEl.setAttribute("id", "card");
                    fiveDayCard.appendChild(cardEl);
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

// display previous searches as buttons for user to click
var savePreviousSearch = function () {
    previousSearchDisp.innerHTML = "";

    for (i = 0; i < previousSearches.length; i++) {
        var previousCity = document.createElement("p")
        previousCity.textContent = previousSearches[i];
        previousCity.setAttribute("class", previousSearches[i]);
        previousCity.setAttribute("id", "previous-search");
        previousSearchDisp.appendChild(previousCity);
    };
    // save to localStorage
    saveSearch();
};

// clear search history with reset button
var searchReset = function (event) {
    previousSearches = [];
    localStorage.clear();
    previousSearchDisp.innerHTML = "";
};

// check for user clicking on a saved search
document.addEventListener("click", function (event) {
    if (event.target.id == "previous-search") {
        var savedSearch = event.target.textContent;
        clickedPrevious = savedSearch;
        fetchLocation(savedSearch);
    };
});

// submit button event listener 
submitBtn.addEventListener("click", submitCity);

// reset button event listener 
resetBtn.addEventListener("click", searchReset);

// load previous searches
loadPrevious();