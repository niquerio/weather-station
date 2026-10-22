import { weatherIcon, weatherText } from './tomorrow_io.js'
import { getSensorData } from './temperature_humidity_sensor'
import { frenchDictionary } from './dictionary.js'
import { Forecast } from './draw_forecast.js'

// next steps: separate redraw from fetch data.
// save sensorData and forecast_data
const states = {
  us: {
    unit: 'f',
    image: '/static/middle.png',
    locale: 'en-US'
  },
  ca: {
    unit: 'c',
    image: '/static/ealdormere.png',
    locale: 'fr-CA'
  }
}
let state = 'us'
let sensorData = {}
let forecast = {}

function currentState () {
  return states[state]
}

async function fetchSensorData () {
  sensorData = await getSensorData()
}

async function fetchForecast () {
  const response = await fetch('/forecast')
  forecast = await response.json()
}

async function toggleLocale () {
  state = state === 'us' ? 'ca' : 'us'
  setLocaleImageAndTitle()
  setDateTime()
  drawSensorData()
  drawForecast()
}

function formatLongDate (dateString) {
  const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }
  return new Date(dateString).toLocaleString(currentState().locale, options)
}

function setLocaleImageAndTitle () {
  document.getElementById('locale').src = currentState().image
  document.getElementById('now-title').innerHTML = toDisplayText('Now')
  document.getElementById('forecast-title').innerHTML = toDisplayText('Forecast')
}

function drawSensorData () {
  for (const sensorLocation of ['inside', 'outside']) {
    const temperature = sensorData[sensorLocation].temperature / 10
    const humidity = sensorData[sensorLocation].humidity
    const dewpoint = sensorData[sensorLocation].dewpoint
    const time = sensorData[sensorLocation].time
    document.getElementById(`${sensorLocation}-temperature`).innerHTML = toDisplayTemperature(temperature)
    document.getElementById(`${sensorLocation}-humidity`).innerHTML = humidity.toFixed(0)
    document.getElementById(`${sensorLocation}-dewpoint`).innerHTML = toDisplayTemperature(dewpoint)
    document.getElementById(`${sensorLocation}-tip`).innerHTML = `${toDisplayText('Last update')}: ${formatLongDate(time)}`
  }
}

async function setSensorReadings () {
  await fetchSensorData()
  drawSensorData()
}

function toFahrenheitFixed (celsius) {
  return ((celsius * 9 / 5) + 32).toFixed(0)
}

function toDisplayTemperature (celsius) {
  if (currentState().unit === 'f') {
    return toFahrenheitFixed(celsius)
  } else {
    return celsius.toFixed(0)
  }
}

function toDisplayText (text) {
  if (currentState().locale === 'fr-CA') {
    return frenchDictionary[text]
  } else {
    return text
  }
}

function drawForecast () {
  new Forecast(document, currentState(), forecast).draw()

  const hours = document.getElementById('hours')
  hours.innerHTML = ''
  forecast.next_five_hours.forEach((t) => {
    const newDiv = document.createElement('div')
    newDiv.classList.add('hour')

    const tooltipWrapperSpan = document.createElement('span')
    tooltipWrapperSpan.classList.add('tooltip-wrapper')

    const iconSpan = document.createElement('span')
    iconSpan.classList.add('material-symbols-outlined')
    iconSpan.classList.add('hour-icon')

    const tooltipSpan = document.createElement('span')
    tooltipSpan.classList.add('tooltip')

    const tempSpan = document.createElement('span')
    const hourSpan = document.createElement('span')

    const iconText = document.createTextNode(weatherIcon(t.weather_code, t.hour))
    const tooltipText = document.createTextNode(toDisplayText(weatherText(t.weather_code)))
    const tempText = document.createTextNode(toDisplayTemperature(t.temperature) + '°')
    const hourText = document.createTextNode(t.time)

    iconSpan.appendChild(iconText)
    tooltipSpan.appendChild(tooltipText)
    tooltipWrapperSpan.append(iconSpan)
    tooltipWrapperSpan.append(tooltipSpan)

    tempSpan.appendChild(tempText)
    hourSpan.appendChild(hourText)

    newDiv.appendChild(tooltipWrapperSpan)
    newDiv.appendChild(tempSpan)
    newDiv.appendChild(hourSpan)

    hours.innerHtml = ''
    hours.appendChild(newDiv)
  })
}

async function setForecast () {
  await fetchForecast()
  drawForecast()
}

function setDateTime () {
  const date = new Date().toLocaleDateString(currentState().locale, { weekday: 'short', month: 'short', day: 'numeric' })
  document.getElementById('clock-date').innerHTML = date
  const time = new Date().toLocaleTimeString(currentState().locale, { hour: 'numeric', minute: 'numeric' })
  document.getElementById('clock-time').innerHTML = time
}

setDateTime()
setInterval(setDateTime, 1000)

setSensorReadings()
setInterval(setSensorReadings, (1000 * 15))

setForecast()
setInterval(setForecast, (1000 * 60 * 60))

document.getElementById('locale').addEventListener('click', function (e) {
  toggleLocale()
})
document.getElementById('refresh').addEventListener('click', function (e) {
  window.location.reload()
})
