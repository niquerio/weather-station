import unittest
import json
from pathlib import Path
THIS_DIR = Path(__file__).parent
from lib.forecast import Forecast
class TestForecast(unittest.TestCase):
    def setUp(self):
        fixture_path = THIS_DIR / 'fixtures/tomorrow_forecast.json'
        with open(fixture_path) as forecast_file:
            file_contents = json.load(forecast_file)
        self.forecast = Forecast(file_contents)

    def test_today_high(self):
        self.assertEqual(self.forecast.today_high(), 44)

    def test_today_low(self):
        self.assertEqual(self.forecast.today_low(), 39)



if __name__ == '__main__':
    unittest.main()
