import { frenchDictionary } from './dictionary.js'
import { weatherIcon, weatherText } from './tomorrow_io.js'

function getCurrentHour () {
  return parseInt(new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric' }))
}

export class Forecast {
  constructor (document, state, forecast, hour = getCurrentHour()) {
    this.document = document
    this.state = state
    this.hour = hour
    this.forecast = forecast
  }

  iconText () {
    return weatherIcon(this.forecast.today.weather_code, this.hour)
  }

  tooltipText () {
    return this.toDisplayText(weatherText(this.forecast.today.weather_code))
  }

  forecastTooltipText () {
    const prefix = this.toDisplayText('Last update')
    return `${prefix}: ${this.longDate()}`
  }

  humidity () {
    return this.toVaporDisplay((this.forecast.today.humidity))
  }

  precipitation () {
    return this.toVaporDisplay((this.forecast.today.precipitation))
  }

  high () {
    return this.toDisplayTemperature(this.forecast.today.high)
  }

  low () {
    return this.toDisplayTemperature(this.forecast.today.low)
  }

  toVaporDisplay (value) {
    return parseFloat(value).toFixed(0)
  }

  toDisplayText (text) {
    if (this.state.locale === 'fr-CA') {
      return frenchDictionary[text]
    } else {
      return text
    }
  }

  toDisplayTemperature (celsius) {
    let result = parseFloat(celsius)
    if (this.state.unit === 'f') {
      result = this.toFahrenheit(result)
    }
    return result.toFixed(0)
  }

  toFahrenheit (celsius) {
    return ((celsius * 9 / 5) + 32)
  }

  longDate () {
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }
    return new Date(this.forecast.date).toLocaleString(this.state.locale, options)
  }

  draw () {
    for (const element of [
      { id: 'today-icon', text: this.iconText() },
      { id: 'weather-tip', text: this.tooltipText() },
      { id: 'forecast-tip', text: this.forecastTooltipText() },
      { id: 'humidity', text: this.humidity() },
      { id: 'precipitation', text: this.precipitation() },
      { id: 'high', text: this.high() },
      { id: 'low', text: this.low() }
    ]) {
      this.changeText(element.id, element.text)
    }
  }

  changeText (id, text) {
    this.document.getElementById(id).innerHTML = text
  }
}

export function drawForecast (document, currentState, forecast, currentHour = getCurrentHour()) {
  new Forecast(document, currentState, forecast, currentHour).draw()
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
    // const tooltipText = document.createTextNode(toDisplayText(weatherText(t.weather_code)))
    //  const tempText = document.createTextNode(toDisplayTemperature(t.temperature) + '°')
    const tooltipText = document.createTextNode('whatever')
    const tempText = document.createTextNode('whateverelse' + '°')
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
