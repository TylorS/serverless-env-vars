# serverless-env-vars

Run your scripts using the same environment variables that are loaded by serverless.

## Installation

```sh
# NPM
npm i --save-dev serverless-env-vars
# Yarn
yarn --dev severless-env-vars
```

## Usage

```sh
# Run npm run build with serverless-set environment variables
serverless-env-vars npm run build

# Configure the stage 
STAGE=prod serverless-env-vars ...
```
