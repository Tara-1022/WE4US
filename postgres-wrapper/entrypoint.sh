#!/bin/sh
set -e

echo "Running mix deps.get to fix lock file..."
mix deps.get
echo "Compiling heroicons..."
mix deps.compile heroicons --force || true
echo "Starting Phoenix server..."
exec mix phx.server