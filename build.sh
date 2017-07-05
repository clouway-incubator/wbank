#!/bin/sh

cd frontend
npm run build
cp build/* ../cmd/bankapp/static -rf
