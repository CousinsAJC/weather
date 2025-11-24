const weatherAPI = "https://api.weather.gov/";
const getWeatherBtn = document.getElementById("get-weather-btn");
const weatherResult = document.getElementById("weather-result");

let latitude = null;
let longitude = null;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    // You can then use these coordinates, for example, to display them on a map
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}

getLocation();

getWeatherBtn.addEventListener("click", () => {
  if (latitude && longitude) {
    fetchWeather(latitude, longitude);
    } else {
    weatherResult.innerHTML = "Location not available.";
    }
});

async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(`${weatherAPI}points/${lat},${lon}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const forecastUrl = data.properties.forecast;
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const forecastData = await forecastResponse.json();
        displayWeather(forecastData);
    } catch (error) {
        weatherResult.innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
    }
}

function displayWeather(data) {
    const periods = data.properties.periods;
    let weatherHTML = '<h2>Weather Forecast<br>' + latitude + ', ' + longitude + '</h2>';
    periods.forEach(period => {
        weatherHTML += `
            <div class="weather-period">
                <h3>${period.name}</h3>
                <p>${period.detailedForecast}</p>
                <p>Temperature: ${period.temperature} °${period.temperatureUnit}</p>
            </div>
        `;
    });
    weatherResult.innerHTML = weatherHTML;
}
