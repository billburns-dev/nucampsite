console.log('javascript connected!');

/* carousel functionality .................................................................................................................... [START] */
const carousel = new bootstrap.Carousel('#homeCarousel', {
  interval: 5000,
  pause: false
})

const carouselButton = document.getElementById('carouselButton');
const faIcon = document.getElementById('faButton');

carouselButton.addEventListener('click', function() {
  if (faIcon.classList.contains('fa-pause')) {
    faIcon.classList.remove('fa-pause');
    faIcon.classList.add('fa-play');
    carousel.pause();
  } else {
    faIcon.classList.remove('fa-play');
    faIcon.classList.add('fa-pause');
    carousel.cycle();
  }
})   
/* carousel functionality ...................................................................................................................... [END] */


/* initialize global variables ............................................................................................................... [START] */
const apiKey = process.env.OPEN_WEATHER_API_KEY;
/* initialize global variables ................................................................................................................. [END] */


/* obtain latitude & longitude values for a given city using the Geocoding API ............................................................... [START] */
async function getLatLong(city, state, country) {
  
  // URL for 'fetch' request to Geocoding API to receive latitude & longitude values for target city
  const geoCoordUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${apiKey}`;
  
  try {
    const geoData = await (await fetch(geoCoordUrl)).json();                           // geoData contains the data returned from Geocoding API
    console.log("Geographical Coordinates:", geoData);

    if (!geoData.length) {
      throw new Error("City not found");
    }

    /*
      The Geocoding API returns array of objects. The request for geographical coordinates was for only one city.
      Therefore, the array of objects that was returned only contained one object.
    */
    const onlyObject = geoData[0];
    const lat = onlyObject.lat;  // Extract latitude
    const lon = onlyObject.lon;  // Extract longitude

    return { lat, lon };

  } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
  }
}
/* obtain latitude & longitude values for a given city using the Geocoding API ................................................................. [END] */

/* obtain current weather conditions for a given latitude & longitude using the Current weather API .......................................... [START] */
async function fetchWeather(cityTemp, stateTemp, countryTemp) {
    try {
      
        const { lat, lon } = await getLatLong(cityTemp, stateTemp, countryTemp);  // convert city/state/country to latitude & Longitude values using Geocoding API 
        
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
        
        const weatherData = await (await fetch(weatherUrl)).json();   
        console.log("Weather Data:", weatherData);

        displayWeather(weatherData); // Pass data to UI function

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}
/* obtain current weather conditions for a given latitude & longitude using the Current weather API ............................................ [END] */


/* display current temperature, weather description, and icon using data received from the Current weather API ............................... [START] */
function displayWeather(data) {

  /* retrieve the applicable data from the locally stored API response ............................................................. [START] */
  // access the value of 'temp' which is a property of the object 'main'
  const weatherTemperature = data.main.temp;

  // access value of 'description' which is a property of the first object in 'weather'; 'weather' is an array of objects
  const weatherDescription = data.weather[0].description;

    // access value of 'icon' which is a property of the first object in 'weather'; 'weather' is an array of objects
  const weatherIcon = data.weather[0].icon;

  /* retrieve the applicable data from the locally stored API response ............................................................... [END] */

  console.log("Current Temperature:", weatherTemperature);
  console.log("Weather Description:", weatherDescription);
  console.log("Weather Icon:", weatherIcon);

  /* display the weather icon ...................................................................................................... [START] */
  // select designated element/container in index.html for icon image; select using the applicable id
  const weatherIconContainer = document.getElementById("weather-icon");

  // create a new image element to house the URL for the applicable icon
  const iconImgElement = document.createElement("img");
  iconImgElement.src = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
  iconImgElement.alt = "Weather Icon";

  // append newly constructed <img> statement to previously selected container
  weatherIconContainer.appendChild(iconImgElement);
  /* display the weather icon ........................................................................................................ [END] */

  /* display the current temperature ............................................................................................... [START] */
  // select designated element/container in index.html for the temperature; select using the applicable id
  const weatherTempContainer = document.getElementById("weather-temp");

  // Update text content of designated container with temperature value
  weatherTempContainer.textContent = `${weatherTemperature}°F`;
  /* display the current temperature ................................................................................................. [END] */


  /* display current description ................................................................................................... [START] */
  // select designated element/container in index.html for description; select using the applicable id
  const weatherDescContainer = document.getElementById("weather-description");

  // Update text content of designated container with description
  weatherDescContainer.textContent = `${weatherDescription}`;
  /* display current description ..................................................................................................... [END] */

}
/* display current temperature, weather description, and icon using data received from the Current weather API ................................. [END] */

fetchWeather("Salida", "CO", "US");