from requests import get
from lib.services import S


class Sensors:
    def __init__(self, data):
        self._data = data

    def fetch():
        resp = get(S.sensor_api_url)
        return resp.json()
