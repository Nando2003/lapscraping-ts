#!/bin/sh
if [ "$DEBUG" = "1" ]; then
  echo "Running in development mode..."
  npm run dev

else
  echo "Running in production mode..."
  npm run build && npm start
fi