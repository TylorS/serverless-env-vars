import { createServerless, ServerlessOptions } from './createServerless'

/**
 * Retrieve an Record of all the environment variables set by serverless, including any plugins.
 */
export async function getEnvVars(opts: ServerlessOptions = {}): Promise<Record<string, string>> {
  const [serverless, config] = await createServerless(opts)
  const vars = Object.assign(
    {},
    (config.provider as any).environment ?? {},
    ...Object.values(serverless.service.functions).map((f) => f.environment || {}),
  )

  return vars
}
