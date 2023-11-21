SHELL := /bin/bash

install:
	npm install --immutable

build:
	npm run package

validate:
	npm run validate
