#!/usr/bin/env node

import yargs from 'yargs'

import { runWithEnvVars } from './runWithEnvVars'

const logOptions = ['off', 'sls', 'all'] as const
type LogOptions = typeof logOptions[number]

const program = yargs
  .options('stage', {
    type: 'string',
    defaultDescription: 'Stage to configure environment variables for',
  })
  .options('log', { choices: logOptions, default: 'off' as LogOptions })
  .options('watch', { type: 'boolean', default: false })
  .options('namespace', {
    type: 'string',
    description: 'Add a namespace to configured environment variables like SNOWPACK_PUBLIC or VITE',
  })

const { stage, log, watch, namespace, _ } = program.argv
const [cmd, ...args] = _.map((x) => x.toString())

runWithEnvVars({ cmd, args, stage, log, watch, namespace }).catch((error) => {
  console.error(error)
  process.exitCode = 1
})
