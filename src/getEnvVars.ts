import { createServerless, ServerlessOptions } from './createServerless'

/**
 * Retrieve an Record of all the environment variables set by serverless, including any plugins.
 */
export async function getEnvVars(options: ServerlessOptions = {}): Promise<Record<string, string>> {
  const serverless = await createServerless(options)

  return serverless.service.provider.environment ?? serverless.invokedInstance?.service.provider.environment ?? {}
}
