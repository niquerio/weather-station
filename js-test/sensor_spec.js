import { expect } from 'chai';
import { TemperatureHumiditySensor, Location, EmptyLocation } from '../js/temperature_humidity_sensor.js'

const sensor_data = [
    { "time": "2020-12-24 13:49:16-0500", "type": "F007TH", "channel": "5", "rolling_code": 174, "name": "Music room", "last": 2, "temperature": 19.9, "humidity": 45, "battery_ok": true, "t_hist": 6, "h_hist": 5 },
    { "time": "2020-12-24 13:22:16-0500", "type": "F007TH", "channel": "5", "rolling_code": 92, "name": "Front porch", "last": 2, "temperature": 39.9, "humidity": 48, "battery_ok": true, "t_hist": 6, "h_hist": 5 }
]

describe('TemperatureHumiditySensor tests', () => {
    it('has raw data', (done) => {
        const sensor = new TemperatureHumiditySensor(sensor_data)
        expect(sensor.data).to.equal(sensor_data);
        done();
    })

    it("has an inside location of Music room", (done) => {
        const sensor = new TemperatureHumiditySensor(sensor_data)
        expect(sensor.inside instanceof Location).to.be.true
        expect(sensor.inside.name).to.equal("Music room")
        done();
    });

    it("has an outside location of Front porch", (done) => {
        const sensor = new TemperatureHumiditySensor(sensor_data)
        expect(sensor.outside instanceof Location).to.be.true
        expect(sensor.outside.name).to.equal("Front porch")
        done();
    });

    it('returns and EmptyLocation for inside when data is empty', (done) => {
        const sensor = new TemperatureHumiditySensor([])
        expect(sensor.inside instanceof EmptyLocation).to.be.true
        done();
    })

    it('returns and EmptyLocation for outside when data is empty', (done) => {
        const sensor = new TemperatureHumiditySensor([])
        expect(sensor.outside instanceof EmptyLocation).to.be.true
        done();
    })
});

describe('Location', () => {
    it("has a humidty", (done) => {
        var location = new Location(sensor_data[0])
        expect(location.humidity).to.equal(45)
        done();
    });
    it("has a temperature in whatever is given", (done) => {
        var location = new Location(sensor_data[0])
        expect(location.temperature).to.equal(19.9)
        done();
    });
    it("has a time", (done) => {
        var location = new Location(sensor_data[0])
        expect(location.time instanceof Date).to.be.true
        done();
    });
    it("has a name", (done) => {
        var location = new Location(sensor_data[0])
        expect(location.name).to.equal("Music room")
        done();
    });
});
describe('EmtpyLocation', () => {
    it("has a humidty", (done) => {
        var location = new EmptyLocation(sensor_data[0])
        expect(location.humidity).to.equal("")
        done();
    });
    it("has a temperature in whatever is given", (done) => {
        var location = new EmptyLocation(sensor_data[0])
        expect(location.temperature).to.equal("")
        done();
    });
    it("has a time", (done) => {
        var location = new EmptyLocation(sensor_data[0])
        expect(location.time).to.equal("")
        done();
    });
    it("has a name", (done) => {
        var location = new EmptyLocation(sensor_data[0])
        expect(location.name).to.equal("")
        done();
    });
});