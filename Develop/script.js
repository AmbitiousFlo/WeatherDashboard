var apiKey = "09bb760d8abd8773c5b76873ead608da";
var titleEl = document.getElementById("title");
var tempEl = document.getElementById("temp");
var windEl = document.getElementById("wind");
var humidityEl = document.getElementById("humidity");
var searchBtn = document.getElementById("search-btn");
var cityInput = document.getElementById("city-input");
var fivedayForecastEl = document.getElementById("fiveday-forecast");
var searchHistoryEl = document.getElementById("search-history"); // Get the search history element

function formatTemperature(temp) {
    return "Temp: " + temp.toFixed(1) + "F";
}

function searchCity() {
    var cityName = cityInput.value;
    displayWeather(cityName);

    // Show the search history after a search is performed
    searchHistoryEl.style.display = "block";
}

function displayWeather(cityName) {
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (currentData) {
            console.log(currentData);
            titleEl.innerHTML = currentData.name + dayjs.unix(currentData.dt).format("(MM/DD/YYYY)") + "<img src='https://openweather.org/img/wn/" + currentData.weather[0].icon + "@2x.png'>";

            // Update the current temperature element
            tempEl.textContent = formatTemperature(currentData.main.temp);

            // Update the current wind element
            windEl.textContent = "Wind: " + currentData.wind.speed + " MPH";

            // Update the current humidity element
            humidityEl.textContent = "Humidity: " + currentData.main.humidity + "%";

            // Save the searched city to local storage
            saveToLocalStorage(cityName);
        });

    // Fetch 5-day forecast data for the chosen city
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

    fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (forecastData) {
            console.log(forecastData);
            var forecastArr = forecastData.list;

            // Clear the previous forecast
            fivedayForecastEl.textContent = "";

            // Loop through the forecast data and update the cards
            for (let i = 0; i < forecastArr.length; i += 8) {
                var date = dayjs.unix(forecastArr[i].dt).format("MM/DD/YYYY");
                var temp = formatTemperature(forecastArr[i].main.temp);
                var wind = "Wind: " + forecastArr[i].wind.speed + " MPH";
                var humidity = "Humidity: " + forecastArr[i].main.humidity + "%";

                // Update the card elements with the forecast data
                var cardTitle = document.getElementById("card-title" + (i / 8 + 1));
                var tempEl = document.getElementById("temp" + (i / 8 + 1));
                var windEl = document.getElementById("wind" + (i / 8 + 1));
                var humidityEl = document.getElementById("humidity" + (i / 8 + 1));

                cardTitle.textContent = date;
                tempEl.textContent = temp;
                windEl.textContent = wind; 
                humidityEl.textContent = humidity;
            }
        });
}

function saveToLocalStorage(cityName) {
    // Get the existing history from local storage
    var existingHistory = localStorage.getItem("searchHistory");
    var searchHistory = existingHistory ? JSON.parse(existingHistory) : [];

    // Add the cityName to the history
    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);

        // Limit the history to 5 recent cities
        if (searchHistory.length > 5) {
            searchHistory.shift();
        }

        // Save the updated history back to local storage
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }

    // Update the search history list with buttons for each city
    var historyList = document.getElementById("history-list");
    historyList.innerHTML = ""; // Clear previous history buttons

    for (var i = searchHistory.length - 1; i >= 0; i--) {
        var cityButton = document.createElement("button");
        cityButton.type = "button";
        cityButton.className = "btn btn-secondary";
        cityButton.textContent = searchHistory[i];

        // Add an "onclick" event to the history buttons to perform a new search when clicked
        cityButton.onclick = function () {
            var cityName = this.textContent;
            cityInput.value = cityName; // Update the input field with the selected city
            displayWeather(cityName);
        };

        historyList.appendChild(cityButton);
    }
}

searchBtn.addEventListener("click", searchCity);
