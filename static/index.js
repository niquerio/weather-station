const weatherCodeMap = {
  "0":  {
    "name": "Unknown",
    "day": "none",
    "night": "none"
  },
  "1000": {
    "name": "Clear, Sunny",
    "day": "sunny",
    "night": "clear_night"
  },
  "1100": {
    "name": "Mostly Clear",
    "day": "sunny",
    "night": "clear_night"
  },
  "1101": {
    "name": "Partly Cloudy",
    "day": "partly_cloudy_day",
    "night": "partly_cloudy_night"
  },
  "1102": {
    "name": "Mostly Cloudy",
    "day": "cloud",
    "night": "cloud"
  },
  "1001": {
    "name": "Cloudy",
    "day": "cloud",
    "night": "cloud"
  },
  "2000": {
    "name": "Fog",
    "day": "foggy",
    "night": "foggy"
  },
  "2100": {
    "name": "Light Fog",
    "day": "foggy",
    "night": "foggy"
  },
  "4000": {
    "name": "Drizzle",
    "day": "rainy_light",
    "night": "rainy_light"
  },
  "4001": {
    "name": "Rain",
    "day": "rainy",
    "night": "rainy"
  },
  "4200": {
    "name": "Light Rain",
    "day": "rainy_light",
    "night": "rainy_light"
  },
  "4201": {
    "name": "Heavy Rain",
    "day": "rainy_heavy",
    "night": "rainy_heavy"
  },
  "5000": {
    "name": "Snow",
    "day": "weather_snowy",
    "night": "weather_snowy"
  },
  "5001": {
    "name": "Flurries",
    "day": "weather_snowy",
    "night": "weather_snowy"
  },
  "5100": {
    "name": "Light Snow",
    "day": "weather_snowy",
    "night": "weather_snowy"
  },
  "5101": {
    "name": "Heavy Snow",
    "day": "snowing_heavy",
    "night": "snowing_heavy"
  },
  "6000": {
    "name": "Freezing Drizzle",
    "day": "rainy_snow",
    "night": "rainy_snow"
  },
  "6001": {
    "name": "Freezing Rain",
    "day": "rainy_snow",
    "night": "rainy_snow"
  },
  "6200": {
    "name": "Light Freezing Rain",
    "day": "rainy_snow",
    "night": "rainy_snow"
  },
  "6201": {
    "name": "Heavy Freezing Rain",
    "day": "rainy_snow",
    "night": "rainy_snow"
  },
  "7000": {
    "name": "Ice Pellets",
    "day": "weather_hail",
    "night": "weather_hail"
  },
  "7101": {
    "name": "Heavy Ice Pellets",
    "day": "weather_hail",
    "night": "weather_hail"
  },
  "7102": {
    "name": "Light Ice Pellets",
    "day": "weather_hail",
    "night": "weather_hail"
  },
  "8000": {
    "name": "Thunderstorm",
    "day": "thunderstorm",
    "night": "thunderstorm"
  }
}

function weatherIcon(code,hour){
  const time_of_day = hour >= 5 && hour <= 14 ? "day" : "night";
  return weatherCodeMap[code][time_of_day];
}

function updateGauge(temperature){
  document.getElementById("outside-temperature").innerHTML = temperature + "°"

};

function updateSensorReadings(jsonResponse) {
  let temperature = jsonResponse.temperature.toFixed(0);
  updateGauge(temperature);
}

function to_far(celcius){
  return ((celcius * 9/5) + 32)
}

function far_forecast(forecast){
  forecast.today.high = to_far(forecast.today.high)
  forecast.today.low = to_far(forecast.today.low)
}

async function setForecast(){
  const response = await fetch("/forecast");
  let forecast = await response.json();
  const hour = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "numeric" });
  far_forecast(forecast);
  const icon_text = weatherIcon(forecast.today.weather_code, parseInt(hour)) ;
  document.getElementById("today-icon").innerHTML = icon_text;
  ["high","low","humidity","precipitation"].forEach((kind) => {
    document.getElementById(kind).innerHTML = parseFloat(forecast.today[kind]).toFixed(0);
  });
  const hours = document.getElementById("hours")
  forecast.next_five_hours.forEach((t) => {
    const new_div = document.createElement("div")
    new_div.classList.add("hour")

    const icon_span = document.createElement("span") 
    icon_span.classList.add("material-symbols-outlined")
    icon_span.classList.add("hour-icon")
    const temp_span = document.createElement("span") 
    const hour_span = document.createElement("span") 

    

    const icon_text = document.createTextNode(weatherIcon(t.weather_code,t.hour));
    const temp_text = document.createTextNode(to_far(t.temperature).toFixed(0)+ "°");
    const hour_text = document.createTextNode(t.time);

    icon_span.appendChild(icon_text);
    temp_span.appendChild(temp_text);
    hour_span.appendChild(hour_text);

    new_div.appendChild(icon_span);
    new_div.appendChild(temp_span);
    new_div.appendChild(hour_span);
   
    hours.appendChild(new_div);

  })
}

function setDateTime(){
  var date = new Date().toLocaleDateString('en-US', { weekday:"short", month:"short", day:"numeric"});
  document.getElementById("clock-date").innerHTML = date;
  var time = new Date().toLocaleTimeString('en-US', {hour: "numeric", minute: "numeric"});
  document.getElementById("clock-time").innerHTML = time;
}
/*
  SocketIO Code
*/
//   var socket = io.connect("http://" + document.domain + ":" + location.port);
var socket = io.connect();

//receive details from server
socket.on("updateSensorData", function (msg) {
  var sensorReadings = JSON.parse(msg);
  updateSensorReadings(sensorReadings);
});

setDateTime();
setInterval(setDateTime,1000)

setForecast();
//setInterval(setForecast,(1000 * 60 * 60))
