import { weatherIcon } from "./tomorrow_io.js"
import { get_sensor_data } from "./temperature_humidity_sensor"

async function setSensorReadings() {
  const sensor_data = await get_sensor_data();
  const inside_temperature = (sensor_data.inside.temperature / 10)
  const inside_humidity = sensor_data.inside.humidity.toFixed(0)
  const outside_temperature = (sensor_data.outside.temperature / 10)
  const outside_humidity = sensor_data.outside.humidity.toFixed(0)

  document.getElementById("inside-temperature").innerHTML = to_fahrenheit(inside_temperature) + "°"
  document.getElementById("inside-humidity").innerHTML = inside_humidity + "%"
  document.getElementById("outside-temperature").innerHTML = to_fahrenheit(outside_temperature) + "°"
  document.getElementById("outside-humidity").innerHTML = outside_humidity + "%"
}

function to_fahrenheit(celcius) {
  return ((celcius * 9 / 5) + 32).toFixed(0);
}

function fahrenheit_forecast(forecast) {
  forecast.today.high = to_fahrenheit(forecast.today.high)
  forecast.today.low = to_fahrenheit(forecast.today.low)
}

async function setForecast() {
  const response = await fetch("/forecast");
  let forecast = await response.json();
  const hour = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "numeric" });
  fahrenheit_forecast(forecast);
  const icon_text = weatherIcon(forecast.today.weather_code, parseInt(hour));
  document.getElementById("today-icon").innerHTML = icon_text;
  ["high", "low", "humidity", "precipitation"].forEach((kind) => {
    document.getElementById(kind).innerHTML = parseFloat(forecast.today[kind]).toFixed(0);
  });
  const hours = document.getElementById("hours")
  hours.innerHTML = "";
  forecast.next_five_hours.forEach((t) => {
    const new_div = document.createElement("div")
    new_div.classList.add("hour")

    const icon_span = document.createElement("span")
    icon_span.classList.add("material-symbols-outlined")
    icon_span.classList.add("hour-icon")
    const temp_span = document.createElement("span")
    const hour_span = document.createElement("span")



    const icon_text = document.createTextNode(weatherIcon(t.weather_code, t.hour));
    const temp_text = document.createTextNode(to_fahrenheit(t.temperature) + "°");
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

function setDateTime() {
  var date = new Date().toLocaleDateString('en-US', { weekday: "short", month: "short", day: "numeric" });
  document.getElementById("clock-date").innerHTML = date;
  var time = new Date().toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" });
  document.getElementById("clock-time").innerHTML = time;
}

setDateTime();
setInterval(setDateTime, 1000)

setSensorReadings();
setInterval(setSensorReadings, (1000 * 15));

setForecast();
setInterval(setForecast, (1000 * 60 * 60))