SHELL := /bin/bash

install:
	npm install --immutable

run-tests:
	npm run test
	npx bats test/*.bats

build:
	npm run package

validate-format:
	npm run validate-format
