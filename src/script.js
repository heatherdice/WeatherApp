// API info
// let apiKey = "2ca1d902baba2a8bf55f85b00cd5219b"; (Open Weather API)
let apiKey = "335d26daoc39f096bf1t1b45c4c341e4";
let city = "Philadelphia";

// return apiURL
function apiURL(city) {
    // return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; (Open Weather API)
    return `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
}

// form enter behavior
let input = document.getElementById("form-input");
input.addEventListener("keypress", function(event) {
    if(event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search").click();
    }
})

// when entering city into search bar, show city above day & time
function changeCity(event) {
    event.preventDefault(); // prevents page from reloading
    let cityInput = document.querySelector("#form-input");
    let currentCity = document.querySelector("#current-city");
    if(cityInput.value) {
        currentCity.innerHTML = `${cityInput.value}`;
        axios.get(apiURL(cityInput.value)).then(cityTemp);
    }
    else {
        alert("Please enter a city.");
    }
}
let form = document.querySelector("#search");
form.addEventListener("click", changeCity);

// display current day and time
let now = new Date();
let dayTime = document.querySelector("#day");
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let day = days[now.getDay()];
let hour = now.getHours();
let minutes = String(now.getMinutes()).padStart(2, '0');
dayTime.innerHTML = `${day} ${hour}:${minutes}`;

// forecast based on city coordinates
function getForecast(coordinates) {
    let apiForecastUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&key=${apiKey}&units=imperial`;
    axios.get(apiForecastUrl).then(displayForecast);
}

// display current icon, temp, name, description, humidity of city
function cityTemp(response) {
    // let temp = Number(Math.round(response.data.main.temp));
    let temp = Number(Math.round(response.data.temperature.current));
    let currentTemp = document.querySelector("#current-temp");
    currentTemp.innerHTML = `${temp}`;
    // celsiusTemp = response.data.main.temp;
    fahrenheitTemp = response.data.temperature.current;
    // document.querySelector("#current-city").innerHTML = response.data.name;
    document.querySelector("#current-city").innerHTML = response.data.city;
    // document.querySelector("#description").innerHTML = response.data.weather[0].description;
    document.querySelector("#description").innerHTML = response.data.condition.description;
    // document.querySelector("#icon").setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    document.querySelector('#icon').setAttribute("src", response.data.condition.icon_url);
    // document.querySelector("#icon").setAttribute("alt", response.data.weather[0].description);
    document.querySelector("#icon").setAttribute("alt", response.data.condition.icon);
    // document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#humidity").innerHTML = response.data.temperature.humidity;
    document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
    getForecast(response.data.coordinates);
}
axios.get(apiURL(city)).then(cityTemp);

// get current city name and temp
function getCurrentCity(event) {
    event.preventDefault(); // prevents page from reloading
    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        // let apiLatLon = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        let apiLatLon = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=imperial`;
        axios.get(apiLatLon).then(cityTemp);
        
    }, err => console.log(err))
}
let form2 = document.querySelector("#search-current");
form2.addEventListener("click", getCurrentCity);

// convert temp to celsius
function displayCelsius(event) {
    event.preventDefault();
    fahrenheitLink.classList.remove("active"); // remove active class from fahrenheit link
    celsiusLink.classList.add("active"); // add active class to celsius link
    let conversion = ((fahrenheitTemp-32) * 5/9);
    document.querySelector("#current-temp").innerHTML = Math.round(conversion);
}
let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsius);

// convert temp to fahrenheit
function displayFahrenheit(event) {
    event.preventDefault();
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
    document.querySelector("#current-temp").innerHTML = Math.round(fahrenheitTemp);
}
let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheit);

let fahrenheitTemp = null; // provides global variable able to be accessed from multiple functions

// display forecast days, icons, & temps (high & low)
function displayForecast(response) {
    console.log(response.data);
    let forecastElement = document.querySelector("#forecast");
    let forecastHTML = `<div class="row">`;
    days.forEach(function(day) {
        forecastHTML = 
        forecastHTML + 
        `
            <div class="col">
                <div class="weather-forecast-date">${day}</div>
                <!-- <img src="http://openweathermap.org/img/wn/03d@2x.png" alt="weather icon" width="42"> -->
                <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/clear-sky-day.png" alt="weather icon" width="42">
                <div class="weather-forecast-temperatures">
                    <span class="weather-forecast-temperature-max">
                        18°
                    </span>
                    <span class="weather-forecast-temperature-min opacity-75">
                        12°
                    </span>
                </div>
            </div>
        `;
    })
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
}

