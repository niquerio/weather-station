import unittest
import json
from lib.sensors import Sensors
from pathlib import Path
THIS_DIR = Path(__file__).parent
class TestForecast(unittest.TestCase):
    def setUp(self):
        fixture_path = THIS_DIR / 'fixtures/weather_sensor.json'
        with open(fixture_path) as sensors_file:
            file_contents = json.load(sensors_file)
        self.sensors = Sensors(file_contents)

    def test_output(self):
        self.assertEqual(self.sensors.output(), {
            "inside": {
                "temperature": 19.9,
                "humidity": 45
                },
            "outside": {
                "temperature": 19.9,
                "humidity": 45
                }
            })

if __name__ == '__main__':
    unittest.main()
