from app.sensors import Sensors, Sensor
import pytest
from dataclasses import asdict
import json


@pytest.fixture
def data():
    return [
        {
            "time": "2020-12-24 13:49:16-0500",
            "type": "F007TH",
            "channel": "5",
            "rolling_code": 174,
            "name": "Music room",
            "temperature": 19.9,
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
            "temperature": 39.9,
            "humidity": 48,
            "battery_ok": True,
            "t_hist": 6,
            "h_hist": 5,
        },
    ]


def test_is_iterable(data):
    subject = list(Sensors(data))
    assert subject[0] is not None


def test_serialize(data):
    subject = Sensors(data).serialize()
    assert subject[0]["temperature"] == 19.9


def test_elements_are_sensor_objects(data):
    subject = list(Sensors(data))
    assert subject[0].temperature == 19.9
    assert subject[1].temperature == 39.9
    assert subject[0].room_label == "music_room"
    assert subject[1].timestamp_seconds == 1608834136.0


def test_sensor_has_derrivable_properties(data):
    sen = Sensor(**data[0])
    subject = asdict(sen)
    assert subject["temperature"] == 19.9
    assert subject["dewpoint"] == -8.714914015386967


def test_sensor_has_dewpoint(data):
    subject = Sensor(**data[0])
    assert subject.dewpoint == -8.714914015386967
