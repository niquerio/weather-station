import { weatherIcon } from "./tomorrow_io.js"

function updateSensorReadings(jsonResponse) {
  const inside_temperature = jsonResponse.inside.temperature.toFixed(0);
  const inside_humidity = jsonResponse.inside.humidity.toFixed(0);
  const outside_temperature = jsonResponse.outside.temperature.toFixed(0);
  const outside_humidity = jsonResponse.outside.humidity.toFixed(0);

  document.getElementById("inside-temperature").innerHTML = to_far(inside_temperature) + "°"
  document.getElementById("inside-humidity").innerHTML = inside_humidity + "%"
  document.getElementById("outside-temperature").innerHTML = to_far(outside_temperature) + "°"
  document.getElementById("outside-humidity").innerHTML = outside_humidity + "%"
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
   
    hours.innerHtml = ""
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
setInterval(setForecast,(1000 * 60 * 60))
