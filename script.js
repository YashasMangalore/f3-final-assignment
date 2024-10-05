// Get references to DOM elements
const fetchDataBtn = document.getElementById("fetchDataBtn");
const weatherContainer = document.getElementById("weather");
const mapContainer = document.getElementById("mapContainer");
const header = document.querySelector("h1"); // Reference to the h1 element

// Add event listener to the button
fetchDataBtn.addEventListener("click", getUserLocation);

// Function to fetch user location
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Success callback for Geolocation
function successCallback(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Update the header and remove the button
  updateHeaderAndButton(lat, lon);

  // Display the map with the user's location
  displayMap(lat, lon);

  // Fetch weather data for the location
  fetchWeatherData(lat, lon);
}

// Error callback for Geolocation
function errorCallback(error) {
  alert(`Error fetching location: ${error.message}`);
}

// Function to update the header and button
function updateHeaderAndButton(lat, lon) {
  header.style.display = "none"; // Hide the original h1
  fetchDataBtn.style.display = "none"; // Remove the button

  // Create a new h2 element for the welcome message
  const welcomeHeader = document.createElement("h2");
  welcomeHeader.textContent = "Welcome To The Weather App";
  welcomeHeader.classList.add("welcome-header"); // Add class for styling
  header.parentNode.insertBefore(welcomeHeader, header); // Insert the new h2 before the h1

  // Create a new p element for the current location
  const locationHeader = document.createElement("p");
  locationHeader.textContent = "Here is your current location";
  locationHeader.classList.add("location-header"); // Add class for styling
  welcomeHeader.after(locationHeader); // Insert the new p after the h2

  // Create a parent div for latitude and longitude
  const latLonContainer = document.createElement("div");
  latLonContainer.classList.add("lat-lon-container"); // Add class for styling

  // Create a div for latitude
  const latDiv = document.createElement("div");
  latDiv.innerHTML = `<strong>Lat: ${lat}</strong>`;
  latDiv.classList.add("lat-lon"); // Add class for styling

  // Create a div for longitude
  const lonDiv = document.createElement("div");
  lonDiv.innerHTML = `<strong>Long: ${lon}</strong>`;
  lonDiv.classList.add("lat-lon"); // Add class for styling

  // Append latitude and longitude divs to the container
  latLonContainer.appendChild(latDiv);
  latLonContainer.appendChild(lonDiv);

  // Append the latLonContainer to the document after locationHeader
  locationHeader.after(latLonContainer);
}


// Function to display Google Maps with user's location
function displayMap(lat, lon) {
  // Create the iframe for the map
  const mapFrame = document.createElement("iframe");
  mapFrame.width = "100%";
  mapFrame.height = "450";
  mapFrame.style.border = "0";
  mapFrame.allowFullscreen = true;
  mapFrame.loading = "lazy";
  mapFrame.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyCvA3Sc1nfC6zR4e3rD6zeAbdE4mjAi7-Q&q=${lat},${lon}&zoom=12&maptype=roadmap`;

  // Clear previous map (if any) and append the new one
  mapContainer.innerHTML = ""; // Clear previous content
  mapContainer.appendChild(mapFrame); // Append the new map frame
}

// Function to fetch weather data from OpenWeatherMap API
function fetchWeatherData(lat, lon) {
  const apiKey = "5cf4650e769cf4383f5298ec5beb20c5"; // Your OpenWeatherMap API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => displayWeatherData(data))
    .catch((error) => console.error("Error fetching weather data:", error));
}

// Function to display fetched weather data
function displayWeatherData(data) {
  const currentWeather = data.list[0]; // Get current weather
  weatherContainer.innerHTML = `
        <h3>Your Weather Data</h3>
        <div id="weatherDetails">
            <div class="weather-detail"><strong>Location:</strong> ${data.city.name}, ${data.city.country}</div>
            <div class="weather-detail"><strong>Temperature:</strong> ${currentWeather.main.temp}°C</div>
            <div class="weather-detail"><strong>Weather:</strong> ${currentWeather.weather[0].description}</div>
            <div class="weather-detail"><strong>Humidity:</strong> ${currentWeather.main.humidity}%</div>
            <div class="weather-detail"><strong>Time Zone:</strong> GMT +${data.city.timezone / 3600}</div>
            <div class="weather-detail"><strong>Pressure:</strong> ${(currentWeather.main.pressure / 1013.25).toFixed(2)} atm</div>
            <div class="weather-detail"><strong>Wind Speed:</strong> ${(currentWeather.wind.speed * 3.6).toFixed(2)} km/h</div>
            <div class="weather-detail"><strong>Wind Direction:</strong> ${getWindDirection(currentWeather.wind.deg)} </div>
            <div class="weather-detail"><strong>Feels Like:</strong> ${currentWeather.main.feels_like}°C</div>
        </div>
    `;
  weatherContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
}

// Function to convert wind degrees to direction names
function getWindDirection(degree) {
  if (degree >= 0 && degree < 22.5) return "North";
  if (degree >= 22.5 && degree < 67.5) return "North-East";
  if (degree >= 67.5 && degree < 112.5) return "East";
  if (degree >= 112.5 && degree < 157.5) return "South-East";
  if (degree >= 157.5 && degree < 202.5) return "South";
  if (degree >= 202.5 && degree < 247.5) return "South-West";
  if (degree >= 247.5 && degree < 292.5) return "West";
  if (degree >= 292.5 && degree < 337.5) return "North-West";
  return "North"; // Default to North if no match
}
