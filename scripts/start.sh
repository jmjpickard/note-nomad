#!/bin/bash

if [ -f .env ]
then
  export $(cat .env | xargs)
fi

# Migrate the database before the app start
npm run db:deploy

# Start the app
node dist/src/index.js
