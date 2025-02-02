from lib.forecast import Forecast
from lib.sensors import Sensors
from flask import Flask, render_template
from flask_caching import Cache

app = Flask(__name__)
app.config["CACHE_TYPE"] = "simple"
app.config.from_prefixed_env()
cache = Cache(app)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/sensors")
def sensors():
    return Sensors.fetch()


@app.route("/forecast")
@cache.cached(timeout=(600))
def forecast():
    """
    Cache of 10 minutes is so that the api endpoint for tomorrow.io doesn't get
    hit too frequently. As of 2025-02-02 the limits for the api key are:
    3 requests/second; 25 requests/hour; 500 requests/day.
    """
    return Forecast.fetch().output()
