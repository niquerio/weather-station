#!/usr/bin/bash

echo "=============npm install================"
npm install
echo "=============npm run build================"
npm run build

echo "=============poetry install================"
export PYTHON_KEYRING_BACKEND=keyring.backends.null.Keyring
poetry install --no-root
