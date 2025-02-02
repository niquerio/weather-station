#!/usr/bin/bash

npm run build
poetry run gunicorn --config wsgi.py app:app
