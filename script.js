let cityInput = document.getElementById("city_input");
let searchBtn = document.getElementById("searchBtn");
let locationBtn = document.getElementById("locationBtn");
let api_key = "085e79f81818410b055af2f1b9a0e6aa";
let currentWeatherCard = document.querySelector(".weather-left .card");
let fiveDaysForcastCard = document.querySelector(".forecast");
let aqiCard = document.querySelectorAll(".highlights .card")[0];
let sunriseCard = document.querySelectorAll(".highlights .card")[1];
let humidityVal = document.getElementById("humidityVal");
let pressureVal = document.getElementById("pressureVal");
let visibilityElement = document.getElementById("visibilityVal");
let windspeedVal = document.getElementById("windspeedVal");
let feelsVal = document.getElementById("feelsVal");
let hourlyForecastCard = document.querySelector(".hourly-forecast");

let aqiList = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

function getWeatherData(name, lat, lon, country, state) {
  let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric&lang=th`;
  let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric&lang=th`;
  let AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  fetch(AIR_POLLUTION_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
      aqiCard.innerHTML = `
                <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${
        aqiList[data.list[0].main.aqi - 1]
      }</p>
              </div>
              <div class="air-indices">
                <i class="fa-solid fa-wind fa-3x"></i>
                <div class="item">
                  <p>PM2.5</p>
                  <h2>${pm2_5}</h2>
                </div>
                <div class="item">
                  <p>PM10</p>
                  <h2>${pm10}</h2>
                </div>
                <div class="item">
                  <p>SO2</p>
                  <h2>${so2}</h2>
                </div>
                <div class="item">
                  <p>CO</p>
                  <h2>${co}</h2>
                </div>
                <div class="item">
                  <p>NO</p>
                  <h2>${no}</h2>
                </div>
                <div class="item">
                  <p>NO2</p>
                  <h2>${no2}</h2>
                </div>
                <div class="item">
                  <p>NH3</p>
                  <h2>${nh3}</h2>
                </div>
                <div class="item">
                  <p>O3</p>
                  <h2>${o3}</h2>
                </div>
              </div>`;
    })
    .catch(() => {
      alert("Failed to fetch Air Quality Index");
    });

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let date = new Date();
      let weatherIcon = data.weather[0].icon;
      let weatherDescription = data.weather[0].description;
      let temperature = data.main.temp.toFixed(1);

      currentWeatherCard.innerHTML = `
        <div class="current-weather">
          <div class="details">
            <p>Now</p>
            <h2>${temperature}&deg;C</h2>
            <p>${weatherDescription}</p>
          </div>
          <div class="weather-icon">
            <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="weather icon" />
          </div>
        </div>
        <hr />
        <div class="card-footer">
          <p><i class="fa-solid fa-calendar"></i> ${
            days[date.getDay()]
          }, ${date.getDate()} ${
        months[date.getMonth()]
      } ${date.getFullYear()}</p>
          <p><i class="fa-solid fa-location-dot"></i> ${name}, ${country}</p>
        </div>
      `;

      let { sunrise, sunset } = data.sys;
      let { timezone, visibility } = data;
      let { humidity, pressure, feels_like } = data.main;
      let { speed } = data.wind;

      let sunriseMs = sunrise * 1000;
      let sunsetMs = sunset * 1000;

      let sunriseMoment = moment.utc(sunriseMs);
      let sunsetMoment = moment.utc(sunsetMs);

      sunriseMoment.add(timezone, "seconds");
      sunsetMoment.add(timezone, "seconds");

      let sRiseTime = sunriseMoment.format("hh:mm A");
      let sSetTime = sunsetMoment.format("hh:mm A");

      sunriseCard.innerHTML = `
        <div class="card-head">
          <p>Sunrise & Sunset</p>
        </div>
        <div class="sunrise-sunset">
          <div class="item">
            <div class="icon">
              <i class="fa-solid fa-sun fa-4x"></i>
            </div>
            <div>
              <p>Sunrise</p>
              <h2>${sRiseTime}</h2>
            </div>
          </div>
          <div class="item">
            <div class="icon">
              <i class="fa-solid fa-moon fa-4x"></i>
            </div>
            <div>
              <p>Sunset</p>
              <h2>${sSetTime}</h2>
            </div>
          </div>
        </div>
      `;
      humidityVal.innerHTML = `${humidity}%`;
      pressureVal.innerHTML = `${pressure} hPa`;
      visibilityElement.innerHTML = `${visibility / 1000} km`;
      windspeedVal.innerHTML = `${speed} m/s`;
      feelsVal.innerHTML = `${feels_like.toFixed(1)}&deg;C`;
    })
    .catch(() => {
      alert("Error fetching current weather data");
    });

  fetch(FORECAST_API_URL)
    .then((res) => res.json())
    .then((data) => {
      // Fix: Save the hourly forecast data properly
      let hourlyForecast = data.list;

      // Clear previous hourly forecast
      hourlyForecastCard.innerHTML = "";

      // Add hourly forecast items
      for (let i = 0; i < 7 && i < hourlyForecast.length; i++) {
        let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
        let hr = hrForecastDate.getHours();
        let a = "PM";
        if (hr < 12) a = "AM";
        if (hr == 0) hr = 12;
        if (hr > 12) hr = hr - 12;

        hourlyForecastCard.innerHTML += `
        <div class="card">
              <p>${hr} ${a}</p>
              <img src="https://openweathermap.org/img/wn/${
                hourlyForecast[i].weather[0].icon
              }.png" alt="" />
              <p>${hourlyForecast[i].main.temp.toFixed(1)}&deg;C</p>
            </div>
        `;
      }

      // Process 5-day forecast
      let uniqueForecastDays = [];
      let fiveDaysForcast = data.list.filter((forecast) => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          uniqueForecastDays.push(forecastDate);
          return true;
        }
        return false;
      });

      fiveDaysForcastCard.innerHTML = "";
      for (let i = 0; i < fiveDaysForcast.length; i++) {
        let date = new Date(fiveDaysForcast[i].dt_txt);
        let icon = fiveDaysForcast[i].weather[0].icon;
        let temp = fiveDaysForcast[i].main.temp.toFixed(1);

        fiveDaysForcastCard.innerHTML += `
          <div class="forecast-item">
            <div class="icon-wrapper">
              <img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather icon" />
              <span>${temp}&deg;C</span>
            </div>
            <p>${date.getDate()} ${months[date.getMonth()]}</p>
            <p>${days[date.getDay()]}</p>
          </div>
        `;
      }
    })
    .catch(() => {
      alert("Error fetching weather forecast");
    });
}

function getCityCoordinates() {
  let cityName = cityInput.value.trim();
  cityInput.value = "";
  if (!cityName) return;

  let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        alert(`No coordinates found for city "${cityName}"`);
        return;
      }
      let { name, lat, lon, country, state } = data[0];
      getWeatherData(name, lat, lon, country, state);
    })
    .catch(() => {
      alert(`Error fetching data for ${cityName}`);
    });
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Get city name from coordinates using reverse geocoding
        const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${api_key}`;

        fetch(REVERSE_GEOCODING_URL)
          .then((res) => res.json())
          .then((data) => {
            if (data.length > 0) {
              const { name, country, state } = data[0];
              getWeatherData(name, lat, lon, country, state);
            }
          })
          .catch(() => {
            // If reverse geocoding fails, still use the coordinates
            getWeatherData("Your Location", lat, lon, "", "");
          });
      },
      (error) => {
        alert(
          "Unable to retrieve your location. Please allow location access or search for a city."
        );
      }
    );
  } else {
    alert("Geolocation is not supported by your browser");
  }
}

function getUserCoordinates() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let { latitude, longitude } = position.coords;
      let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

      fetch(REVERSE_GEOCODING_URL)
        .then((res) => res.json())
        .then((data) => {
          let { name, country, state } = data[0];
          getWeatherData(name, latitude, longitude, country, state);
        })
        .catch(() => {
          alert("failed to fetch user coordinates  ");
        });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolocation permission denied. Please reset location permission to grant access again"
        );
      }
    }
  );
}

// Event Listeners
searchBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click", getUserLocation);

// Enter key for search
cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    getCityCoordinates();
  }
});

// Load default city on page load
window.addEventListener("load", () => {
  getCityCoordinates();
  cityInput.value = "Bangkok"; // Set default city
});
