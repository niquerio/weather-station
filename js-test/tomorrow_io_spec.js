import {expect} from 'chai';
import {weatherIcon} from '../js/tomorrow_io.js'

describe('WeatherIcon(code,hour)', () => {
  for (const hour of [6,7,8,9,10,11,12,13,14,15,16,17,18]){
    it(`returns day value when hour is ${hour} and code is 1000`, (done) => {
        expect(weatherIcon("1000",hour)).to.equal("sunny")
        done();
    });
  }
  for (const hour of [0,1,2,3,4,5,19,20,21,22,23]){
    it(`returns night value when hour is ${hour} and code is 1000`, (done) => {
        expect(weatherIcon("1000",hour)).to.equal("clear_night")
        done();
    });
  }
});
