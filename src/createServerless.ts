import Serverless from 'serverless'
import resolveCliInput from 'serverless/lib/cli/resolve-input'

import { getConfiguration } from './getConfiguration'

const DEFAULT_STAGE = process.env.STAGE

export type ServerlessOptions = {
  readonly stage?: string
}

export async function createServerless({ stage = DEFAULT_STAGE }: ServerlessOptions = {}) {
  const { configurationPath, configuration } = await getConfiguration()
  const { commands, options } = resolveCliInput()
  const serverless = new Serverless({
    commands,
    options: stage ? { ...options, stage } : options,
    configurationPath,
    configuration,
    stage,
  })

  await serverless.init()

  await setup(serverless)

  if (serverless.invokedInstance) {
    await setup(serverless.invokedInstance)
  }

  return serverless
}

async function setup(serverless: Serverless) {
  await serverless.variables.populateService(serverless.pluginManager.cliOptions)

  serverless.service.mergeArrays()
  serverless.service.setFunctionNames(serverless.processedInput.options)
}
