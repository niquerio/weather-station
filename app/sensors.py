from httpx import get
from app.services import S
from dataclasses import dataclass, field, asdict
from datetime import datetime
from metpy.calc import dewpoint_from_relative_humidity
from metpy.units import units
import json

static_sensors = ""
with open("tests/fixtures/sensor_data.json") as f:
    static_sensors = json.load(f)


class Sensors:
    @classmethod
    def fetch(cls):
        if S.sensors_off:
            return Sensors(static_sensors)
        resp = get(S.sensor_api_url)
        return Sensors(resp.json())

    @classmethod
    def get(cls):
        resp = get(S.sensor_api_url)
        return Sensors(resp.json())

    def __init__(self, data):
        self.data = data

    def __iter__(self):
        return iter([Sensor(**item) for item in self.data])

    def serialize(self):
        return [asdict(sen) for sen in self]


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
    dewpoint: float = field(init=False, repr=True)

    @property
    def dewpoint(self):
        return float(
            dewpoint_from_relative_humidity(
                self.temperature_celsius * units.degC, self.humidity * units.percent
            ).magnitude
        )

    @dewpoint.setter
    def dewpoint(self, _):
        pass  # Do nothing, this is a read-only attribute

    @property
    def room_label(self) -> str:
        return self.name.lower().replace(" ", "_")

    @property
    def humidity_ratio(self):
        return self.humidity / 100

    @property
    def temperature_celsius(self):
        return self.temperature / 10

    @property
    def timestamp_seconds(self):
        return datetime.strptime(self.time, "%Y-%m-%d %H:%M:%S%z").timestamp()

    @property
    def battery_metric(self):
        return int(self.battery_ok)

    def labels(self):
        return f"room={self.room_label}, type={self.type}"
