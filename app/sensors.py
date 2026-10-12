from httpx import get
from app.services import S
from dataclasses import dataclass
from datetime import datetime


class Sensors:
    @classmethod
    def fetch(cls):
        resp = get(S.sensor_api_url)
        return resp.json()

    @classmethod
    def get(cls):
        data = Sensors.fetch()
        return Sensors(data)

    def __init__(self, data):
        self.data = data

    def __iter__(self):
        return iter([Sensor(**item) for item in self.data])


@dataclass
class Sensor:
    time: str = ""
    type: str = ""
    channel: str = 0
    rolling_code: int = 0
    name: str = ""
    temperature: float = 0.0
    humidity: int = 0
    battery_ok: bool = False
    t_hist: int = 0
    h_hist: int = 0

    @property
    def room_label(self):
        return self.name.lower().replace(" ", "_")

    @property
    def humidity_ratio(self):
        return self.humidity / 100

    @property
    def temperature_celcius(self):
        return self.temperature / 10

    @property
    def timestamp_seconds(self):
        return datetime.strptime(self.time, "%Y-%m-%d %H:%M:%S%z").timestamp()

    @property
    def battery_metric(self):
        return int(self.battery_ok)

    def labels(self):
        return "{" + f"room={self.room_label}, type={self.type}" + "}"
