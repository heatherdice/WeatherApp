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
    event.preventDefault();
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
let form = document.querySelector("#button-addon2");
form.addEventListener("click", changeCity);

// return apiURL
function apiURL(city) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
}

// display current temp, name, description of city
function cityTemp(response) {
    let temp = Number(Math.round(response.data.main.temp));
    let currentTemp = document.querySelector("#current-temp");
    currentTemp.innerHTML = `${temp}`;
    document.querySelector("#current-city").innerHTML = response.data.name;
    document.querySelector("#description").innerHTML = response.data.weather[0].description;
}
axios.get(apiURL(city)).then(cityTemp);

/* draft function to get precipitation data
function cityPrecipitation(response) {
    let rain = response.data.rain;
    let currentRain = document.querySelector("#current-rain");
    currentRain.innerHTML = $`{rain}`;
}
axios.get(apiURL(city).then(cityPrecipitation));
*/

// get current city name and temp
function getCurrentCity(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let apiLatLon = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        axios.get(apiLatLon).then(cityTemp);
        
    }, err => console.log(err))
}
// get current city name & temp
let form2 = document.querySelector("#button-addon");
form2.addEventListener("click", getCurrentCity);


/* display temperature, convert temp by clicking C and F 
no, I didn't have to do a conversion, but I wanted to */
// function fahrenheit() {
//     let temp = Number(document.querySelector("#current-temp").innerHTML);
//     let conversion = (temp * (9/5)) + 32;
//     document.querySelector("#current-temp").innerHTML = conversion.toFixed(1);
// }
// function celcius() {
//     let temp = Number(document.querySelector("#current-temp").innerHTML);
//     let conversion = (temp - 32) * 5/9;
//     document.querySelector("#current-temp").innerHTML = conversion.toFixed(1);
// }
// let fTemp = document.querySelector("#fahrenheit");
// let cTemp = document.querySelector("#celcius");
// fTemp.addEventListener("click", fahrenheit);
// cTemp.addEventListener("click", celcius);

/* FUTURE TEST CASE: toggle between F & C so that only one shows on the page. 
That way, temp isn't arbitrarily converted every time C & F are clicked. */