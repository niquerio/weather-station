import json
from lib.forecast import Forecast
from lib.sensors import Sensors
from flask import Flask, render_template, request
from flask_socketio import SocketIO
from threading import Lock

thread = None
thread_lock = Lock()

app = Flask(__name__)
app.config.from_prefixed_env()
socketio = SocketIO(app, cors_allowed_origins="*")

"""
Background Thread
"""


def background_thread():
    while True:
        sensor_readings = Sensors.fetch().output()
        sensor_json = json.dumps(sensor_readings)
        socketio.emit("updateSensorData", sensor_json)
        socketio.sleep(3)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/forecast")
def forecast():
    return Forecast.fetch().output()

"""
Decorator for connect
"""


@socketio.on("connect")
def connect():
    global thread
    print("Client connected")

    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)


"""
Decorator for disconnect
"""

@socketio.on("disconnect")
def disconnect():
    print("Client disconnected", request.sid)
