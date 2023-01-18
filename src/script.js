// API info
let apiKey = "2ca1d902baba2a8bf55f85b00cd5219b";
let city = "Philadelphia";

// display current day and time
let now = new Date();
let dayTime = document.querySelector("#day");
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let day = days[now.getDay()];
let hour = now.getHours();
let minutes = String(now.getMinutes()).padStart(2, '0');
dayTime.innerHTML = `${day} ${hour}:${minutes}`;

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

// return apiURL
function apiURL(city) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
}

// display current icon, temp, name, description, humidity of city
function cityTemp(response) {
    let temp = Number(Math.round(response.data.main.temp));
    let currentTemp = document.querySelector("#current-temp");
    currentTemp.innerHTML = `${temp}`;
    celsiusTemp = response.data.main.temp;
    document.querySelector("#current-city").innerHTML = response.data.name;
    document.querySelector("#description").innerHTML = response.data.weather[0].description;
    document.querySelector("#icon").setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    document.querySelector("#icon").setAttribute("alt", response.data.weather[0].description);
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
}
axios.get(apiURL(city)).then(cityTemp);

// get current city name and temp
function getCurrentCity(event) {
    event.preventDefault(); // prevents page from reloading
    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let apiLatLon = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        axios.get(apiLatLon).then(cityTemp);
        
    }, err => console.log(err))
}
let form2 = document.querySelector("#search-current");
form2.addEventListener("click", getCurrentCity);

// convert temp to fahrenheit
function displayFahrenheit(event) {
    event.preventDefault();
    celsiusLink.classList.remove("active"); // remove active class from celsius link
    fahrenheitLink.classList.add("active"); // add active class on fahrenheit link
    let conversion = (celsiusTemp * (9/5)) + 32;
    document.querySelector("#current-temp").innerHTML = Math.round(conversion);
}
let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheit);

let celsiusTemp = null; // provides global variable able to be accessed from multiple functions

// convert temp to celsius
function displayCelsius(event) {
    event.preventDefault();
    fahrenheitLink.classList.remove("active");
    celsiusLink.classList.add("active");
    document.querySelector("#current-temp").innerHTML = Math.round(celsiusTemp);
}
let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsius);
