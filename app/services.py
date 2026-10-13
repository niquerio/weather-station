from dataclasses import dataclass
import os


def get_boolean_env_var(env_var, default):
    value = os.getenv(env_var)
    if value is None:
        return default
    elif value.lower() in ["false", "f", 0]:
        return False
    else:
        return True


@dataclass
class Services:
    sensor_api_url: str
    tomorrow_api_key: str
    forecast_off: bool


S = Services(
    sensor_api_url=os.getenv(
        "SENSOR_API_URL", "http://your_sensor_api_url/api/sensors"
    ),
    tomorrow_api_key=os.getenv("TOMORROW_API_KEY", "your_api_key"),
    forecast_off=get_boolean_env_var("FORECAST_OFF", False),
)
