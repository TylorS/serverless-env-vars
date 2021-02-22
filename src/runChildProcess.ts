import { spawn } from 'child_process'

export function runChildProcess(
  args: readonly string[],
  env: Readonly<Record<string, string | undefined>>,
  watchMode: boolean,
) {
  const cp = spawn(args[0], args.slice(1), { env, stdio: 'inherit' })

  cp.on('close', (code) => {
    if (!watchMode) {
      process.exitCode = code ?? 1
    }
  })

  cp.on('exit', (code) => {
    if (!watchMode) {
      process.exitCode = code ?? 1
    }
  })

  cp.on('error', () => {
    if (!watchMode) {
      process.exitCode = 1
    }
  })

  return cp
}
