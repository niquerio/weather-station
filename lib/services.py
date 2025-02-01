from dataclasses import dataclass
import os


@dataclass
class Services:
    sensor_api_url: str
    tomorrow_api_key: str


S = Services(
    sensor_api_url=os.getenv("SENSOR_API_URL", "http://galilei:8888/api/sensors"),
    tomorrow_api_key=os.getenv("TOMORROW_API_KEY", "your_api_key"),
)
