/* eslint-disable @typescript-eslint/no-var-requires */
import Serverless from 'serverless'
import resolveInput from 'serverless/lib/cli/resolve-input'
import resolveVariables from 'serverless/lib/configuration/variables/resolve'
import resolveVariablesMeta from 'serverless/lib/configuration/variables/resolve-meta'

import { getConfiguration } from './getConfiguration'

const DEFAULT_STAGE = process.env.STAGE

export type ServerlessOptions = {
  readonly stage?: string
}

export async function createServerless({ stage = DEFAULT_STAGE }: ServerlessOptions = {}) {
  const { configurationPath, configuration } = await getConfiguration()
  const { commands, options, commandSchema } = resolveInput()
  const serverless = new Serverless({
    configuration,
    configurationPath,
    commands,
    options: stage ? { ...options, stage } : options,
    stage,
  })

  await serverless.init()

  await setup(serverless, configuration, options, commandSchema)

  return [serverless, configuration] as const
}

async function setup(serverless: any, config: any, options: any, commandSchema: any) {
  if (serverless.configurationInput) serverless.service.reloadServiceFileParam()

  // Some plugins acccess `options` through `serverless.variables`
  serverless.variables.options = serverless.pluginManager.cliOptions

  // merge arrays after variables have been populated
  // (https://github.com/serverless/serverless/issues/3511)
  serverless.service.mergeArrays()

  // populate function names after variables are loaded in case functions were externalized
  // (https://github.com/serverless/serverless/issues/2997)
  serverless.service.setFunctionNames(serverless.processedInput.options)

  // If in context of service, validate the service configuration
  if (serverless.serviceDir) await serverless.service.validate()

  serverless.serviceOutputs = new Map()
  serverless.servicePluginOutputs = new Map()

  const meta = await resolveVariablesMeta(config)

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const providerName = require('serverless/lib/configuration/resolve-provider-name')(config)
  const resolverConfiguration = {
    serviceDir: process.cwd(),
    configuration: config,
    variablesMeta: meta,
    sources: {
      env: require('serverless/lib/configuration/variables/sources/env'),
      file: require('serverless/lib/configuration/variables/sources/file'),
      opt: require('serverless/lib/configuration/variables/sources/opt'),
      self: require('serverless/lib/configuration/variables/sources/self'),
      strToBool: require('serverless/lib/configuration/variables/sources/str-to-bool'),
      sls: require('serverless/lib/configuration/variables/sources/instance-dependent/get-sls')(),
    },
    options: require('serverless/lib/cli/filter-supported-options')(options, { commandSchema, providerName }),
    fulfilledSources: new Set(),
    propertyPathsToResolve: new Set(createPathToResolve(config)),
    variableSourcesInConfig: new Set(),
  }

  await resolveVariables(resolverConfiguration)
}

function createPathToResolve(config: any): string[] {
  return Object.entries(config).flatMap(([k, v]) =>
    v != null && !Array.isArray(v) && typeof v === 'object'
      ? Object.entries(v as object).flatMap(([k2, v2]) => [
          `${k}\0${k2}`,
          ...createPathToResolve(v2).map((k3) => `${k}\0${k2}\0${k3}`),
        ])
      : [k],
  )
}
