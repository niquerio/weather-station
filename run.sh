#!/usr/bin/bash

poetry run gunicorn --config wsgi.py app:app
