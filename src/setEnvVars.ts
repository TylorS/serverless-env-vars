export function setEnvVars(environmentVariables: Readonly<Record<string, string>>, namespace?: string) {
  for (const [key, value] of Object.entries(environmentVariables)) {
    process.env[key] = value

    if (namespace) {
      process.env[`${namespace}_${key}`] = value
    }
  }
}
