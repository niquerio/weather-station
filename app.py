import json
from flask import Flask, render_template, request
from flask_socketio import SocketIO
from random import random
from threading import Lock

thread = None
thread_lock = Lock()

app = Flask(__name__)
app.secret_key = b'whatever'
socketio = SocketIO(app, cors_allowed_origins="*")

"""
Background Thread
"""


def background_thread():
    while True:
        sensor_readings = {
            "temperature": random()*100,
            "humidity": random()*100 
         }
        sensor_json = json.dumps(sensor_readings)
        socketio.emit("updateSensorData", sensor_json)
        socketio.sleep(3)

@app.route("/hello")
def index():
    return render_template("index.html")

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
