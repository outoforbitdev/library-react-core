setup:
    npm install
    pre-commit install

install:
    npm install

test:
    npm test
    npx tsc --noEmit

lint:
    npx prettier --check .

lint-write:
    npx prettier --write .

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
