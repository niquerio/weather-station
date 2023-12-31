from dateutil import parser, tz
from requests import get
import os

class Forecast():
    def fetch(apikey=os.getenv("TOMORROW_API_KEY")):
        resp = get("https://api.tomorrow.io/v4/weather/forecast?location=42.295,-83.740", params={"apikey":apikey})
        return Forecast(resp.json())

    to_zone = tz.gettz("America/New_York")
    def __init__(self,data):
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
        
        ffl = filter(
                    lambda x: x["hour"] in [2,5,8,11,14,17,20,23], 
                    map(self.__hourly_map_fn, hourly)
                    )
        output = list(ffl)[0:5]
        return output
    
    def output(self):
        return    {
            "today": {
                "high": self.today_high(),
                "low": self.today_low(),
                "humidity": self.today_humidity(),
                "precipitation": self.today_precipitation(),
                "weather_code": self.today_weather_code()
                },
            "next_five_hours": self.next_five_hours()
        }

    def __hourly_map_fn(self,x):
       t = parser.parse(x["time"]).astimezone(self.to_zone)
       return {
               "timestamp": x["time"],
               "time": t.strftime("%-I%p"),
               "hour": int(t.strftime("%H")),
               "weather_code": int(x["values"]["weatherCode"]),
               "temperature": x["values"]["temperature"]
               }
        
    def __today(self, key):
        return self._data["timelines"]["daily"][0]["values"][key]
