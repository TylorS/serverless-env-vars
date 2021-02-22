import { spawn } from 'child_process'

export function runChildProcess(
  cmd: string,
  args: readonly string[],
  env: Readonly<Record<string, string | undefined>>,
  watchMode: boolean,
) {
  const cp = spawn(cmd, args, { env, stdio: 'inherit' })

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
