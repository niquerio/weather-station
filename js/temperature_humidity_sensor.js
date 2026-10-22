export class TemperatureHumiditySensor {
  constructor (data) {
    this.data = data
  }

  data () {
    return this.data
  }

  get inside () {
    const insideData = this.data.find(r => r.name === 'Music room')
    return insideData ? new Location(insideData) : new EmptyLocation()
  }

  get outside () {
    const outsideData = this.data.find(r => r.name === 'Front porch')
    return outsideData ? new Location(outsideData) : new EmptyLocation()
  }
}

export class Location {
  constructor (data) {
    this.data = data
  }

  get name () {
    return this.data.name
  }

  get humidity () {
    return this.data.humidity
  }

  get temperature () {
    return this.data.temperature
  }

  get dewpoint () {
    return this.data.dewpoint
  }

  get time () {
    return new Date(this.data.time)
  }
}

export class EmptyLocation {
  get name () { return '' }
  get humidity () { return '' }
  get temperature () { return '' }
  get time () { return '' }
}

export async function getSensorData () {
  const response = await fetch('/sensors')
  const sensorData = await response.json()
  return new TemperatureHumiditySensor(sensorData)
}
