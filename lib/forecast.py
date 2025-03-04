from dateutil import parser, tz
from requests import get
from lib.services import S


class Forecast:
    def fetch():
        resp = get(
            "https://api.tomorrow.io/v4/weather/forecast?location=42.295,-83.740",
            params={"apikey": S.tomorrow_api_key},
        )
        return Forecast(resp.json())

    to_zone = tz.gettz("America/New_York")

    def __init__(self, data):
        self._data = data

    def today_high(self):
        return self.__today("temperatureMax")

    def today_low(self):
        return self.__today("temperatureMin")

    def today_humidity(self):
        return self.__today("humidityAvg")

    def today_precipitation(self):
        return self.__today("precipitationProbabilityMax")

    def today_weather_code(self):
        return self.__today("weatherCodeMax")

    def next_five_hours(self):
        hourly = self._data["timelines"]["hourly"]
        simpler_hourly = [self.__hourly_map_fn(hour) for hour in hourly]
        hours_we_care_about = [
            x for x in simpler_hourly if x["hour"] in [2, 5, 8, 11, 14, 17, 20, 23]
        ]
        output = hours_we_care_about[0:5]
        return output

    def output(self):
        return {
            "today": {
                "high": self.today_high(),
                "low": self.today_low(),
                "humidity": self.today_humidity(),
                "precipitation": self.today_precipitation(),
                "weather_code": self.today_weather_code(),
            },
            "next_five_hours": self.next_five_hours(),
        }

    def __hourly_map_fn(self, x):
        t = parser.parse(x["time"]).astimezone(self.to_zone)
        return {
            "timestamp": x["time"],
            "time": t.strftime("%-I%p"),
            "hour": int(t.strftime("%H")),
            "weather_code": int(x["values"]["weatherCode"]),
            "temperature": x["values"]["temperature"],
        }

    def __today(self, key):
        return self._data["timelines"]["daily"][0]["values"][key]
