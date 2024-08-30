#!/bin/bash
npm run generate
npm run migrate
exec "$@"