setup:
    npm install
    pre-commit install --hook-type commit-msg

install:
    npm install

test:
    npm test

lint:
    docker run -v $(pwd):/app -v $(pwd)/.linters:/polylint/.linters outoforbitdev/polylint:0.1.0

lint-write:
    npm run validate-themes

gate: test lint
    npx tsc --noEmit

build:
    npm run build

pack: build
    #!/usr/bin/env bash
    npm pack
    VERSION=$(node -p "require('./package.json').version")
    PACKAGE="../library-react-core/outoforbitdev-ood-react-$VERSION.tgz"
    cd ../library-galaxy-map/ && npm install $PACKAGE
    PACKAGE="../../../library-react-core/outoforbitdev-ood-react-$VERSION.tgz"
    cd ../app-galaxy-map/src/client && npm install $PACKAGE && just restart-node
    rm $PACKAGE
