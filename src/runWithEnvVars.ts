import chokidar from 'chokidar'
import { join } from 'path'
import findConfigPath from 'serverless/lib/cli/resolve-configuration-path'

import { getEnvVars } from './getEnvVars'
import { runChildProcess } from './runChildProcess'
import { setEnvVars } from './setEnvVars'

export type RunWithEnvVarsOptions = {
  readonly cmd: string
  readonly args: readonly string[]

  readonly watch?: boolean
  readonly log?: boolean
  readonly stage?: string
  readonly namespace?: string
}

export async function runWithEnvVars(options: RunWithEnvVarsOptions) {
  const configPath = (await findConfigPath()) ?? join(process.cwd(), 'serverless.yml')

  let cp = await createCp(options)

  if (options.watch) {
    const watcher = chokidar.watch(configPath, { persistent: true, interval: 1000 })

    watcher.on('change', async () => {
      console.log('Configuration changed, restarting...')

      cp.kill()
      cp = await createCp(options)
    })
  }
}

async function createCp(options: RunWithEnvVarsOptions) {
  const { cmd, args, log, stage, watch = false } = options

  if (log) {
    console.info('Reading Serverless environment variables...')
  }

  const envVars = filterAlreadySetEnvVars(await getEnvVars({ stage }))

  if (log) {
    console.info(`Environment Variables To Set:`)
    console.info(JSON.stringify(envVars, null, 2))
  }

  setEnvVars(envVars, options.namespace)

  if (log) {
    console.info('Serverless environment variables set')
  }

  return runChildProcess(cmd, args, process.env, watch)
}

function filterAlreadySetEnvVars(envVars: Record<string, string>): Record<string, string> {
  const toSet: Record<string, string> = {}

  for (const key in envVars) {
    if (!(key in process.env)) {
      toSet[key] = envVars[key]
    }
  }

  return toSet
}
