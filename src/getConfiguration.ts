import findConfigPath from 'serverless/lib/cli/resolve-configuration-path'
import readConfiguration from 'serverless/lib/configuration/read'

export async function getConfiguration() {
  const configurationPath = await findConfigPath()

  if (!configurationPath) {
    throw new Error(`Unable to find configuration file`)
  }

  const configuration = await readConfiguration(configurationPath)

  return {
    configurationPath,
    configuration,
  }
}
