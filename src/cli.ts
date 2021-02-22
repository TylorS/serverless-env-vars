#!/usr/bin/env node

import yargs from 'yargs'

import { runWithEnvVars } from './runWithEnvVars'

const program = yargs
  .options('stage', {
    type: 'string',
    defaultDescription: 'Stage to configure environment variables for',
  })
  .options('log', { type: 'boolean', default: true })
  .options('logStages', { type: 'array', default: ['dev'] })
  .options('watch', { type: 'boolean', default: false })

const { stage, log, logStages, watch, _ } = program.argv
const [cmd, ...args] = _.map((x) => x.toString())

runWithEnvVars({ cmd, args, stage, log, logStages, watch }).catch((error) => {
  console.error(error)
  process.exitCode = 1
})
