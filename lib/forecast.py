from dateutil import parser, tz
import json
class Forecast():
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
        wanted_keys = ["timestamp","weather_code","time","temperature"]
        sfl = map(lambda d: dict((k, d[k]) for k in wanted_keys if k in d), ffl)
        output = list(sfl)[0:5]
        return output
    
    def output(self):
        return    {
            "today": {
                "high": self.today_high(),
                "low": self.today_low(),
                "humidity": self.today_humidity(),
                "precipitation": self.today_precipitation(),
                },
            "next_five_hours": self.next_five_hours()
        }

    def toJSON(self):
        return json.dumps(self.output())

    def __hourly_map_fn(self,x):
       t = parser.parse(x["time"]).astimezone(self.to_zone)
       return {
               "timestamp": x["time"],
               "time": t.strftime("%-I %p"),
               "hour": int(t.strftime("%H")),
               "weather_code": int(x["values"]["weatherCode"]),
               "temperature": x["values"]["temperature"]
               }
        
    def __today(self, key):
        return self._data["timelines"]["daily"][0]["values"][key]
