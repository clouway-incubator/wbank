#!/bin/sh

cd frontend
npm run build
cp -fr build ../cmd/bankapp/static