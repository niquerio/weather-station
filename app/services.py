from dataclasses import dataclass
import os


@dataclass
class Services:
    sensor_api_url: str
    tomorrow_api_key: str


S = Services(
    sensor_api_url=os.getenv(
        "SENSOR_API_URL", "http://your_sensor_api_url/api/sensors"
    ),
    tomorrow_api_key=os.getenv("TOMORROW_API_KEY", "your_api_key"),
)
