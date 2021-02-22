export function setEnvVars(environmentVariables: Readonly<Record<string, string>>) {
  for (const [key, value] of Object.entries(environmentVariables)) {
    process.env[key] = value
  }
}
