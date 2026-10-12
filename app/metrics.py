from app.sensors import Sensors
from dataclasses import dataclass
import textwrap


sensor_metrics = [
    {
        "name": "temperature_celcius",
        "help_text": "Temperature in celcius",
        "attribute": "temperature_celcius",
    },
    {
        "name": "humidity_ratio",
        "help_text": " Humidity between 0 and 1",
        "attribute": "humidity_ratio",
    },
    {
        "name": "battery_ok",
        "help_text": "Boolean state of the sensor battery",
        "attribute": "battery_metric",
    },
    {
        "name": "sensor_data_last_recorded_timestamp_seconds",
        "help_text": "Time when we last got new data from the sensor",
        "attribute": "timestamp_seconds",
    },
    {
        "name": "dewpoint_celcius",
        "help_text": "Dewpoint of relative humidity and temperature in degrees celcius",
        "attribute": "dewpoint",
    },
]


def all_metrics(sensors):
    return [Metric(**metric, sensors=sensors) for metric in sensor_metrics]


@dataclass
class Metric:
    name: str
    help_text: str
    attribute: str
    sensors: Sensors
    metric_type: str = "gauge"

    def __str__(self):
        result = f"""
        # HELP {self.name} {self.help_text}
        # TYPE {self.name} {self.metric_type}
        """
        result = textwrap.dedent(result)
        for sensor in self.sensors:
            if getattr(sensor, self.attribute):
                result += f"{self.name}{{{sensor.labels()}}} {getattr(sensor, self.attribute)}\n"
        return result.strip()
