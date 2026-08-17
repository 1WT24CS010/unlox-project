// ============================================
// Weather App - script.js
// This file handles:
// 1. Saving the API key
// 2. Fetching weather data when the user searches
// 3. Showing the result (or an error message)
// ============================================

// We will store the API key here once the user saves it
let apiKey = "";

// Grab the HTML elements we need to work with
const apiKeyInput = document.getElementById("apiKeyInput");
const saveKeyBtn = document.getElementById("saveKeyBtn");

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const message = document.getElementById("message");
const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

// ---------- 1. Save the API key ----------
saveKeyBtn.addEventListener("click", function () {
  apiKey = apiKeyInput.value.trim();

  if (apiKey === "") {
    message.textContent = "Please paste your API key first.";
  } else {
    message.textContent = "API key saved. You can search now!";
  }
});

// ---------- 2. Search for a city ----------
searchBtn.addEventListener("click", function () {
  getWeather();
});

// Also allow pressing "Enter" in the city input box
cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});

// ---------- 3. Function that fetches the weather ----------
function getWeather() {
  const city = cityInput.value.trim();

  // Basic checks before making the request
  if (apiKey === "") {
    message.textContent = "Please enter and save your API key first.";
    return;
  }
  if (city === "") {
    message.textContent = "Please type a city name.";
    return;
  }

  // Let the user know we're working on it
  message.textContent = "Loading...";
  weatherCard.style.display = "none";

  // Build the API URL
  // units=metric gives us Celsius instead of Kelvin
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    encodeURIComponent(city) +
    "&units=metric&appid=" +
    apiKey;

  // fetch() gets the data from the API
  fetch(url)
    .then(function (response) {
      // If the city was not found, the API returns a 404 status
      if (response.status === 404) {
        throw new Error("City not found. Please check the spelling.");
      }
      if (!response.ok) {
        throw new Error("Something went wrong. Please try again.");
      }
      return response.json();
    })
    .then(function (data) {
      showWeather(data);
    })
    .catch(function (error) {
      message.textContent = error.message;
    });
}

// ---------- 4. Function that displays the weather on the page ----------
function showWeather(data) {
  message.textContent = "";

  cityName.textContent = data.name + ", " + data.sys.country;
  temperature.textContent = Math.round(data.main.temp) + "°C";
  condition.textContent = "Condition: " + data.weather[0].description;
  humidity.textContent = "Humidity: " + data.main.humidity + "%";
  windSpeed.textContent = "Wind Speed: " + data.wind.speed + " m/s";

  // The weather icon code comes from the API, e.g. "04d"
  const iconCode = data.weather[0].icon;
  weatherIcon.src = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";

  weatherCard.style.display = "block";
}