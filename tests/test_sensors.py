from app.sensors import Sensors, Sensor
import pytest
from dataclasses import asdict
import json


@pytest.fixture
def data():
    with open("tests/fixtures/sensor_data.json") as f:
        return json.load(f)


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
