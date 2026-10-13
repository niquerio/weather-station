import { weatherIcon, weather_text } from "./tomorrow_io.js"
import { get_sensor_data } from "./temperature_humidity_sensor"
import { french_dictionary } from "./dictionary.js"

//next steps: separate redraw from fetch data. 
// save sensor_data and forecast_data
const formatter = new Intl.DateTimeFormat
const states = {"us": {
    "unit": "f",
    "image": "/static/middle.png",
    "locale": "en-US"
  },
  "ca": {
    "unit": "c",
    "image": "/static/ealdormere.png",
    "locale": "fr-CA"
  }
}
var state = "us"
var sensor_data = {}
var forecast = {}



function current_state(){
  return states[state]
}

async function fetchSensorData(){
  sensor_data = await get_sensor_data();
}

async function fetchForecast(){
  const response = await fetch("/forecast");
  forecast = await response.json();
}

async function toggle_locale(){
  state = state == "us" ? "ca" : "us";
  set_locale_image_and_title()
  setDateTime()
  drawSensorData()
  drawForecast()
}


function format_long_date(date_string){
  let options = {month: "short", day: "numeric", year: "numeric", hour: "numeric",  minute: "numeric"}
  return new Date(date_string).toLocaleString(current_state().locale, options)
}

function set_locale_image_and_title(){
  document.getElementById("locale").src=current_state().image;
  document.getElementById("now-title").innerHTML = to_display_text("Now")
  document.getElementById("forecast-title").innerHTML = to_display_text("Forecast")
}


function drawSensorData(){
  for(const sensor_location of ["inside", "outside"]){
    const temperature = sensor_data[sensor_location].temperature / 10
    const humidity = sensor_data[sensor_location].humidity
    const dewpoint = sensor_data[sensor_location].dewpoint
    const time = sensor_data[sensor_location].time
    document.getElementById(`${sensor_location}-temperature`).innerHTML = to_display_temperature(temperature)
    document.getElementById(`${sensor_location}-humidity`).innerHTML = humidity.toFixed(0)
    document.getElementById(`${sensor_location}-dewpoint`).innerHTML = to_display_temperature(dewpoint)
    document.getElementById(`${sensor_location}-tip`).innerHTML = `${to_display_text("Last update")}: ${format_long_date(time)}`
  }
}

async function setSensorReadings() {
  await fetchSensorData()
  drawSensorData()
}

function to_fahrenheit_fixed(celsius) {
  return ((celsius * 9 / 5) + 32).toFixed(0);
}

function to_display_temperature(celcius){
  if(current_state().unit == "f"){
    return to_fahrenheit_fixed(celcius)
  }
  else{
    return celcius.toFixed(0)
  }
}

function to_display_text(text){
  if(current_state().locale =="fr-CA"){
    return french_dictionary[text]
  }else{
    return text
  }
}

function drawForecast(){
  const hour = new Date().toLocaleTimeString(current_state().locale, { hour12: false, hour: "numeric" });
  const icon_text = weatherIcon(forecast.today.weather_code, parseInt(hour));
  const tooltip_text = to_display_text(weather_text(forecast.today.weather_code))
  const forecast_tooltip_text = `${to_display_text("Last update")}: ${format_long_date(forecast.date)}`
  document.getElementById("today-icon").innerHTML = icon_text;
  document.getElementById("weather-tip").innerHTML = tooltip_text;
  document.getElementById("forecast-tip").innerHTML = forecast_tooltip_text;
  for( const temp_kind of ["high", "low"]){
    document.getElementById(temp_kind).innerHTML = to_display_temperature(parseFloat(forecast.today[temp_kind]));
  }
  for(const vapor_type of ["humidity", "precipitation"]){
    document.getElementById(vapor_type).innerHTML = parseFloat(forecast.today[vapor_type]).toFixed(0);
  };
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
    const tooltip_text = document.createTextNode(to_display_text(weather_text(t.weather_code)))
    const temp_text = document.createTextNode(to_display_temperature(t.temperature) + "°");
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

async function setForecast() {
  await fetchForecast()
  drawForecast()
}

function setDateTime() {
  var date = new Date().toLocaleDateString(current_state().locale, { weekday: "short", month: "short", day: "numeric" });
  document.getElementById("clock-date").innerHTML = date;
  var time = new Date().toLocaleTimeString(current_state().locale, { hour: "numeric", minute: "numeric" });
  document.getElementById("clock-time").innerHTML = time;
}

setDateTime();
setInterval(setDateTime, 1000)

setSensorReadings();
setInterval(setSensorReadings, (1000 * 15));

setForecast();
setInterval(setForecast, (1000 * 60 * 60))

document.getElementById("locale").addEventListener("click", function (e) {
  toggle_locale()
});
