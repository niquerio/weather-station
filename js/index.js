import { weatherIcon, weather_text } from "./tomorrow_io.js"
import { get_sensor_data } from "./temperature_humidity_sensor"

const formatter = new Intl.DateTimeFormat("en-US", {month: "short", day: "numeric", year: "numeric", hour: "numeric",  minute: "numeric"})

async function setSensorReadings() {
  const sensor_data = await get_sensor_data();
  for(const sensor_location of ["inside", "outside"]){
    const temperature = sensor_data[sensor_location].temperature / 10
    const humidity = sensor_data[sensor_location].humidity
    const dewpoint = sensor_data[sensor_location].dewpoint
    const time = formatter.format(sensor_data[sensor_location].time)
    document.getElementById(`${sensor_location}-temperature`).innerHTML = to_fahrenheit_fixed(temperature)
    document.getElementById(`${sensor_location}-humidity`).innerHTML = humidity.toFixed(0)
    document.getElementById(`${sensor_location}-dewpoint`).innerHTML = to_fahrenheit_fixed(dewpoint)
    document.getElementById(`${sensor_location}-tip`).innerHTML = `Last update: ${time}`
  }
}

function to_fahrenheit_fixed(celsius) {
  return ((celsius * 9 / 5) + 32).toFixed(0);
}

function fahrenheit_forecast(forecast) {
  forecast.today.high = to_fahrenheit_fixed(forecast.today.high)
  forecast.today.low = to_fahrenheit_fixed(forecast.today.low)
}

async function setForecast() {
  const response = await fetch("/forecast");
  let forecast = await response.json();
  const hour = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "numeric" });
  fahrenheit_forecast(forecast);
  const icon_text = weatherIcon(forecast.today.weather_code, parseInt(hour));
  const tooltip_text = weather_text(forecast.today.weather_code)
  const forecast_tooltip_text = `Last update: ${formatter.format(new Date(forecast.date))}`
  document.getElementById("today-icon").innerHTML = icon_text;
  document.getElementById("weather-tip").innerHTML = tooltip_text;
  document.getElementById("forecast-tip").innerHTML = forecast_tooltip_text;
  ["high", "low", "humidity", "precipitation"].forEach((kind) => {
    document.getElementById(kind).innerHTML = parseFloat(forecast.today[kind]).toFixed(0);
  });
  const hours = document.getElementById("hours")
  hours.innerHTML = "";
  forecast.next_five_hours.forEach((t) => {
    const new_div = document.createElement("div")
    new_div.classList.add("hour")

    const tooltip_wrapper_span = document.createElement("span")
    tooltip_wrapper_span.classList.add("tooltip-wrapper")

    const icon_span = document.createElement("span")
    icon_span.classList.add("material-symbols-outlined")
    icon_span.classList.add("hour-icon")

    const tooltip_span = document.createElement("span")
    tooltip_span.classList.add("tooltip")

    const temp_span = document.createElement("span")
    const hour_span = document.createElement("span")



    const icon_text = document.createTextNode(weatherIcon(t.weather_code, t.hour));
    const tooltip_text = document.createTextNode(weather_text(t.weather_code))
    const temp_text = document.createTextNode(to_fahrenheit_fixed(t.temperature) + "°");
    const hour_text = document.createTextNode(t.time);

    icon_span.appendChild(icon_text);
    tooltip_span.appendChild(tooltip_text);
    tooltip_wrapper_span.append(icon_span);
    tooltip_wrapper_span.append(tooltip_span);


    temp_span.appendChild(temp_text);
    hour_span.appendChild(hour_text);

    new_div.appendChild(tooltip_wrapper_span);
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
