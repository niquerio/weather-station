export class TemperatureHumiditySensor {
    constructor(data) {
        this.data = data
    }

    data() {
        return this.data
    }

    get inside() {
        const inside_data = this.data.find(r => r.name == "Music room")
        return inside_data ? new Location(inside_data) : new EmptyLocation()
    }

    get outside() {
        const outside_data = this.data.find(r => r.name == "Front porch")
        return outside_data ? new Location(outside_data) : new EmptyLocation()
    }
}

export class Location {
    constructor(data) {
        this.data = data
    }

    get name() {
        return this.data["name"]
    }

    get humidity() {
        return this.data["humidity"]
    }

    get temperature() {
        return this.data["temperature"]
    }
    get time() {
        return new Date(this.data["time"])
    }
}

export class EmptyLocation {
    get name() { return "" }
    get humidity() { return "" }
    get temperature() { return "" }
    get time() { return "" }
}

export async function get_sensor_data() {
    const response = await fetch("http://localhost:8888/api/sensors")
    let sensor_data = response.json();
    return new TemperatureHumiditySensor(sensor_data)
}