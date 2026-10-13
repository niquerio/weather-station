from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request, Response
from fastapi.responses import HTMLResponse, PlainTextResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from fastapi_cache.decorator import cache

import fastapi_structured_logging

from app.forecast import Forecast
from app.sensors import Sensors
from app.metrics import all_metrics


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    FastAPICache.init(InMemoryBackend())
    yield


fastapi_structured_logging.setup_logging()

app = FastAPI(
    title="Weather Station",
    description="Weather station for Rio-Elkiss household",
    lifespan=lifespan,
)
app.add_middleware(fastapi_structured_logging.AccessLogMiddleware)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
def main(request: Request, response: Response):
    response.headers["Cache-Control"] = "no-store"
    return templates.TemplateResponse(request=request, name="index.html", context={})


@app.get("/sensors")
def sensors():
    return Sensors.fetch().serialize()


@app.get("/forecast")
@cache(expire=600)
async def forecast():
    """
    Cache of 10 minutes is so that the api endpoint for tomorrow.io doesn't get
    hit too frequently. As of 2025-02-02 the limits for the api key are:
    3 requests/second; 25 requests/hour; 500 requests/day.
    """
    return Forecast.fetch().output()


@app.get("/metrics", response_class=PlainTextResponse)
def metrics(request: Request):
    sensors = Sensors.fetch()
    return templates.TemplateResponse(
        request=request,
        name="metrics.txt",
        context={"metrics": all_metrics(sensors)},
        media_type="text/plain",
    )
