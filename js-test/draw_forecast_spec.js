import jsdom from 'jsdom'
import { expect } from 'chai'
import { html } from './fixtures/html.js'
import { forecast } from './fixtures/data.js'
import { drawForecast } from '../js/draw_forecast.js'
const { JSDOM } = jsdom
describe('draw_forecast', () => {
  let document = ''
  let forecastData = {}
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
  function subject (state = 'us') {
    drawForecast(document, states[state], forecastData, 15)
  }
  function getElementText (id) {
    return document.getElementById(id).innerHTML
  }
  beforeEach(function () {
    document = new JSDOM(html).window.document
    forecastData = JSON.parse(forecast)
  })
  it('changes the value of the today-icon', (done) => {
    expect(getElementText('today-icon')).to.equal('sunny')
    subject()
    expect(getElementText('today-icon')).to.equal('cloud')
    done()
  })
  it('changes the value of the weather-tip', (done) => {
    expect(getElementText('weather-tip')).to.equal('sunny')
    subject()
    expect(getElementText('weather-tip')).to.equal('Cloudy')
    done()
  })
  it('changes the value of the forecast-tip', (done) => {
    expect(getElementText('forecast-tip')).to.equal('Some text')
    subject()
    expect(getElementText('forecast-tip')).to.equal('Last update: Oct 12, 2026, 9:26 PM')
    done()
  })
  it('is in french when the state is ca', (done) => {
    subject('ca')
    expect(getElementText('weather-tip')).to.equal('Nuageux')
    expect(getElementText('forecast-tip')).to.equal('Dernière mise à jour: 12 oct. 2026, 21 h 26')
    done()
  })

  it('changes humidity, precipitation, high, low', (done) => {
    subject()
    expect(getElementText('humidity')).to.equal('92')
    expect(getElementText('precipitation')).to.equal('47')
    expect(getElementText('high')).to.equal('44')
    expect(getElementText('low')).to.equal('39')
    done()
  })
  it('adds some hours', (done) => {
    subject()
    const hours = document.getElementById('hours').children
    const firstHour = hours[0].children
    const lastHour = hours[4].children
    expect(firstHour[0].children[0].innerHTML).to.equal('rainy_light')
    expect(firstHour[0].children[1].innerHTML).to.equal('whatever')
    expect(firstHour[1].innerHTML).to.equal('whateverelse°')
    expect(firstHour[2].innerHTML).to.equal('2PM')
    expect(lastHour[0].children[0].innerHTML).to.equal('cloud')
    expect(lastHour[0].children[1].innerHTML).to.equal('whatever')
    expect(lastHour[1].innerHTML).to.equal('whateverelse°')
    expect(lastHour[2].innerHTML).to.equal('2AM')
    done()
  })
})
