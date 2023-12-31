import unittest
import json
from lib.forecast import Forecast
from pathlib import Path
THIS_DIR = Path(__file__).parent
class TestForecast(unittest.TestCase):
    def setUp(self):
        fixture_path = THIS_DIR / 'fixtures/tomorrow_forecast.json'
        with open(fixture_path) as forecast_file:
            file_contents = json.load(forecast_file)
        self.forecast = Forecast(file_contents)

    def test_today_high(self):
        self.assertEqual(self.forecast.today_high(), 6.81)

    def test_today_low(self):
        self.assertEqual(self.forecast.today_low(), 4.12)

    def test_today_humidity(self):
        self.assertEqual(self.forecast.today_humidity(), 91.6)

    def test_today_precipitation(self):
        self.assertEqual(self.forecast.today_precipitation(), 47)

    def test_today_weather_code(self):
        self.assertEqual(self.forecast.today_weather_code(), 1001)
   
    def test_next_five_hours(self):
        nfh = self.forecast.next_five_hours()
        self.assertEqual(nfh[0], {
             "temperature": 6.81, 
             "weather_code": 4200,
             "hour": 14,
             "time": "2PM",
             "timestamp": "2023-12-28T19:00:00Z"
         })
        self.assertEqual(nfh[1], {
             "temperature": 6.25,
             "weather_code": 4200,
             "hour": 17,
             "time": "5PM",
             "timestamp": "2023-12-28T22:00:00Z"
        })
        self.assertEqual(nfh[2], {
             "temperature": 5.78,
             "weather_code": 4000,
             "hour": 20,
             "time": "8PM",  #01
             "timestamp": "2023-12-29T01:00:00Z"
        })
        self.assertEqual(nfh[3], {
             "temperature": 5.36,
             "weather_code": 1001,
             "hour": 23,
             "time": "11PM",
             "timestamp": "2023-12-29T04:00:00Z"
        })
        self.assertEqual(nfh[4], {
             "temperature": 4.71, 
             "weather_code": 1001,
             "hour": 2,
             "time": "2AM",
             "timestamp": "2023-12-29T07:00:00Z"
        })

    def test_output(self):
        self.assertEqual(self.forecast.output(), {
            "today": {
                "high": 6.81,
                "low": 4.12,
                "humidity": 91.6,
                "precipitation": 47,
                "weather_code": 1001
                },
            "next_five_hours":[
                {
                    "temperature": 6.81, 
                    "weather_code": 4200,
                    "hour": 14,
                    "time": "2PM",
                    "timestamp": "2023-12-28T19:00:00Z"
                    },
                {
                    "temperature": 6.25,
                    "weather_code": 4200,
                    "hour": 17,
                    "time": "5PM",
                    "timestamp": "2023-12-28T22:00:00Z"
                    },
                {
                    "temperature": 5.78,
                    "weather_code": 4000,
                    "hour": 20,
                    "time": "8PM",  #01
                    "timestamp": "2023-12-29T01:00:00Z"
                    },
                {
                    "temperature": 5.36,
                    "weather_code": 1001,
                    "hour": 23,
                    "time": "11PM",
                    "timestamp": "2023-12-29T04:00:00Z"
                    },
                {
                    "temperature": 4.71, 
                    "weather_code": 1001,
                    "hour": 2,
                    "time": "2AM",
                    "timestamp": "2023-12-29T07:00:00Z"
                    }
                ]
            })


if __name__ == '__main__':
    unittest.main()
