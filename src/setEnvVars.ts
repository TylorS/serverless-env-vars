export function setEnvVars(environmentVariables: Readonly<Record<string, string>>, namespace?: string) {
  for (const [key, value] of Object.entries(environmentVariables)) {
    setEnvVar(key, value)

    if (namespace) {
      setEnvVar(`${namespace}_${key}`, value)
    }
  }
}

function setEnvVar(key: string, value: string) {
  if (process.env[key]) {
    return
  }

  process.env[key] = value
}
