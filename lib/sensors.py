from requests import get
class Sensors():
    def __init__(self,data):
        self._data=data

    def fetch():
        resp = get("localhost:8888/api/sensors", params={"format": "brief"})
        return Sensors(resp.json())

    def output(self):
        inside = next(x for x in self._data if x["name"] == "Music room")
        return {
                "inside": {
                    "temperature": inside["temperature"],
                    "humidity": inside["humidity"],
                    }
          
                }
