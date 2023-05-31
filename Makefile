.PHONY: build

install: package.json
	@npm install

run: .example_install
	@cd example && ../node_modules/.bin/webpack-dev-server --hot --inline --config ./webpack.config.js

.example_install: example/package.json
	@cd example && npm install

build:
	@NODE_ENV=production ./node_modules/.bin/babel ./src -d lib --ignore '*.spec.js'
	@cd src && rsync -R `find . -name *.css` ../lib # copy all CSS files keeping structure from src to lib

doc:
	@cd docs && jekyll server . --watch

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require ignore-styles \
		--compilers js:babel-register \
		'./src/**/*.spec.js'

test-watch:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require ignore-styles \
		--compilers js:babel-register \
		--watch \
		'./src/**/*.spec.js'
