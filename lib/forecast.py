import json
class Forecast():
    def __init__(self,data):
        self._data = data

    def today_high(self):
        high = self._data["timelines"]["daily"][0]["values"]["temperatureMax"]
        return self.__faren(high)
   
    def today_low(self):
        high = self._data["timelines"]["daily"][0]["values"]["temperatureMin"]
        return self.__faren(high)

    def __faren(self, c):
        return round(((1.8 * c) + 32))
