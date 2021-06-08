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
  readonly log?: 'off' | 'sls' | 'all'
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
  const { cmd, args, log = 'off', stage, watch = false, namespace } = options

  console.info('Reading Serverless environment variables...')

  const envVars = await getEnvVars({ stage })

  logEnvVars(log, envVars, process.env, namespace)

  setEnvVars(envVars, options.namespace)

  console.info('Serverless environment variables set')

  return runChildProcess(cmd, args, process.env, watch)
}

function logEnvVars(
  level: NonNullable<RunWithEnvVarsOptions['log']>,
  sls: Record<string, string>,
  env: Record<string, string | undefined>,
  namespace?: string,
) {
  if (level === 'off') {
    return
  }

  if (level === 'sls') {
    logSlsVars(sls, env)
  }

  if (level === 'all') {
    logAllVars({ ...sls, ...env })
  }

  if (namespace) {
    logNamespaceVariables(namespace, sls, env)
  }
}

function logSlsVars(sls: Record<string, string>, env: Record<string, string | undefined>) {
  console.info('Variables found via Serverless Config:')
  console.info(JSON.stringify(sls, null, 2))

  const existingVars = Object.fromEntries(
    Object.keys(sls)
      .filter((k) => k in env)
      .map((k) => [k, env[k]] as const),
  )

  console.info('Variables overriden by existing variables:')
  console.info(JSON.stringify(existingVars, null, 2))
}

function logAllVars(env: Record<string, string | undefined>) {
  console.info('All variables set for your child process')
  console.info(JSON.stringify(env, null, 2))
}

function logNamespaceVariables(
  namespace: string,
  sls: Record<string, string>,
  env: Record<string, string | undefined>,
) {
  const toLogAbout = Object.fromEntries(
    Object.entries(sls)
      .map(([k, v]) => [`${namespace}_${k}`, v])
      .filter(([k]) => !(k in env)),
  )

  console.info('Namespaced Variables from Serverless:')
  console.info(JSON.stringify(toLogAbout, null, 2))
}
