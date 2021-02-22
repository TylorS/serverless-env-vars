#!/usr/bin/env node

import chokidar from 'chokidar'
import { join } from 'path'
import findConfigPath from 'serverless/lib/cli/resolve-configuration-path'
import yargs from 'yargs'

import { getEnvVars } from './getEnvVars'
import { runChildProcess } from './runChildProcess'
import { setEnvVars } from './setEnvVars'

const program = yargs
  .options('stage', {
    type: 'string',
    default: 'dev',
    defaultDescription: 'Stage to configure environment variables for',
  })
  .options('log', { type: 'boolean', default: true })
  .options('logStages', { type: 'array', default: ['dev'] })
  .options('watch', { type: 'boolean', default: false })

const { stage, log, logStages, watch, _ } = program.argv

async function main() {
  const configPath = (await findConfigPath()) ?? join(process.cwd(), 'serverless.yml')

  let cp = await runWithEnvVars()

  if (watch) {
    const watcher = chokidar.watch(configPath, { persistent: true, interval: 1000 })

    watcher.on('change', async () => {
      console.log('Configuration changed, restarting...')

      cp.kill()
      cp = await runWithEnvVars()
    })
  }
}

async function runWithEnvVars() {
  if (log) {
    console.info('Reading Serverless environment variables...')
  }

  const envVars = await getEnvVars({ stage })

  if (log && logStages.includes(stage)) {
    console.info(`Environment Variables:`)
    console.info(JSON.stringify(envVars, null, 2))
  }

  setEnvVars(envVars)

  if (log) {
    console.info('Serverless environment variables set')
  }

  return runChildProcess(
    _.map((x) => x.toString()),
    envVars,
    watch,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
