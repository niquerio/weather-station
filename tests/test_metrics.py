import pytest
from app.sensors import Sensors
from app.metrics import Metric
import textwrap


@pytest.fixture
def data():
    return [
        {
            "time": "2020-12-24 13:49:16-0500",
            "type": "F007TH",
            "channel": "5",
            "rolling_code": 174,
            "name": "Music room",
            "temperature": 199,
            "humidity": 45,
            "battery_ok": True,
            "t_hist": 6,
            "h_hist": 5,
        },
        {
            "time": "2020-12-24 13:22:16-0500",
            "type": "F007TH",
            "channel": "5",
            "rolling_code": 92,
            "name": "Front porch",
            "temperature": 399,
            "humidity": 48,
            "battery_ok": True,
            "t_hist": 6,
            "h_hist": 5,
        },
    ]


@pytest.fixture
def sensors(data):
    return Sensors(data)


def test_metric_has_expected_output_string(sensors):
    metric = Metric(
        name="temperature_celcius",
        help_text="Temperature in celcius",
        attribute="temperature_celcius",
        sensors=sensors,
    )
    expected = """
    # HELP temperature_celcius Temperature in celcius
    # TYPE temperature_celcius gauge
    temperature_celcius{room=music_room, type=F007TH} 19.9
    temperature_celcius{room=front_porch, type=F007TH} 39.9
    """
    assert metric.__str__() == textwrap.dedent(expected).strip()
