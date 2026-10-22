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
}
