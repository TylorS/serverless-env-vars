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

The main usage of this library will be to run it on the CLI, it will create a child process for your commands
that are configured with `{...process.env, ...serverlessEnvVars}` as the environment.

```sh
# Run npm run build with serverless-set environment variables
serverless-env-vars npm run build

# Configure the stage 
STAGE=prod serverless-env-vars ...
```

## API

There is an exposed node API if that's more your thing. The CLI is a `yargs`-based wrapper around this function.

### runWithEnvVars(options: RunWithEnvVarsOptions): Promise<void>

```ts
export type RunWithEnvVarsOptions = {
  readonly cmd: string
  readonly args: readonly string[]

  readonly watch?: boolean
  readonly log?: boolean
  readonly logStages?: readonly string[]
  readonly stage?: string
}
```

### getConfiguration(): Promise<{ configurationPath: string, configuration: Config }>

Retrieve the configuration of your local serverless setup. If a configuration can not be found or 
parsed this will throw.

```ts
import { getConfiguration } from 'serverless-env-vars'

async function example() {
  const { configurationPath, configuration } = await getConfiguration()
}
```

### createServerless({ stage?: string }): Promise<Serverless>

Easily create a Serverless instance.

```ts
import { createServerless } from 'serverless-env-vars'

async function example() {
  // Stage is optional
  // Stage can be configured via the environment variable STAGE
  const serverless = await createServerless({ stage: 'prod' }) 
}
```

### getEnvVars({ stage?: string }): Promise<Record<string, string>>

Get environment variables for your local serverless configuration.

```ts
import { getEnvVars } from 'serverless-env-vars'

async function example() {
  // Stage is optional
  // Stage can be configured via the environment variable STAGE
  const envVars = await getEnvVars({ stage: 'prod' }) 
}
```

### setEnvVars(envVars: Record<string, string>): void

Set the environment variables within `process.env`

