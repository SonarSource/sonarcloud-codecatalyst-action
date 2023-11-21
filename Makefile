SHELL := /bin/bash

install:
	npm install --immutable

run-tests:
	npm run test

build:
	npm run package

validate-format:
	npm run validate-format
