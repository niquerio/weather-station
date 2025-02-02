from lib.forecast import Forecast
from lib.sensors import Sensors
from flask import Flask, render_template

app = Flask(__name__)
app.config.from_prefixed_env()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/sensors")
def sensors():
    return Sensors.fetch()


@app.route("/forecast")
def forecast():
    return Forecast.fetch().output()
