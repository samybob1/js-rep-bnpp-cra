#!/usr/bin/env bash

PORT=1337

npm run pdf:init -- $@
npm run serve -- -p ${PORT} -s -c-1 &
sleep 3
npm run pdf:export -- --port ${PORT}
kill $!
