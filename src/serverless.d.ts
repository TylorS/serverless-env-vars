// declare module 'serverless' {
//   export type Config = Record<string, string>

//   export interface Options {
//     readonly commands: readonly string[]
//     readonly options: Record<string, string>
//     readonly configurationPath: string
//     readonly configuration: Config
//     readonly stage?: string
//   }

//   export class Serverless {
//     pluginManager: PluginManager
//     service: Service
//     processedInput: {
//       readonly commands: readonly string[]
//       readonly options: Record<string, string>
//     }

//     constructor(options: Options)

//     init(): Promise<void>

//     variables: {
//       populateService: (cliOptions: Record<string, string>) => Promise<void>
//     }

//     invokedInstance?: Serverless
//   }

//   export interface Service {
//     readonly provider: {
//       readonly name: string
//       readonly runtime?: string
//       readonly variableSyntax: string
//       readonly environment: Record<string, string>
//     }
//     readonly custom?: unknown
//     readonly resources?: {
//       readonly Resources?: {
//         readonly Type: string
//         readonly Properties: any
//       }
//     }
//     readonly functions: FunctionMap
//     readonly getAllFunctions: () => string[]
//     readonly getFunction: (functionName: string) => FunctionDefinition

//     // TODO: Find correct typings for Service methods below here
//     readonly load: (options: ServiceOptions) => Promise<void>
//     readonly setFunctionNames: (options: ServiceOptions) => Promise<void>
//     readonly mergeArrays: () => Promise<void>
//     readonly validate: () => Promise<void>
//   }

//   export interface FunctionDefinition {
//     readonly name?: string
//     readonly package?: Package
//     readonly reservedConcurrency?: number
//     readonly runtime?: string
//     readonly timeout?: number
//     readonly memorySize?: number
//     readonly environment?: { [name: string]: string }
//     readonly events: Event[]
//     readonly tags?: { [key: string]: string }
//   }

//   export type FunctionMap = Record<string, Function>

//   export type ServiceOptions = unknown

//   export interface Function {
//     readonly handler: string
//     readonly package: Package
//     readonly runtime?: string
//   }

//   /** Optional deployment packaging configuration */
//   export interface Package {
//     /** Specify the directories and files which should be included in the deployment package */
//     readonly include: string[]
//     /** Specify the directories and files which should be excluded in the deployment package */
//     readonly exclude: string[]
//     /** Config if Serverless should automatically exclude dev dependencies in the deployment package. Defaults to true */
//     readonly excludeDevDependencies?: boolean
//     /** Own package that should be used. You must provide this file. */
//     readonly artifact?: string
//     /** Enables individual packaging for each function. If true you must provide package for each function. Defaults to false */
//     readonly individually?: boolean
//   }

//   export interface PluginManager {
//     readonly spawn: (command: string) => Promise<void>
//     readonly cliCommands: readonly string[]
//     readonly cliOptions: Record<string, string>
//   }

//   export interface PluginCommand {
//     readonly usage?: string
//     readonly lifecycleEvents?: ReadonlyArray<string>
//     readonly options?: Record<string, PluginCommandOption>
//   }

//   export interface PluginCommandOption {
//     readonly usage?: string
//     readonly required?: boolean
//     readonly shortcut?: string
//   }

//   export default Serverless
// }

declare module 'serverless/lib/cli/resolve-configuration-path' {
  const resolveConfigurationPath: () => Promise<string | null>

  export = resolveConfigurationPath
}

declare module 'serverless/lib/configuration/variables/resolve' {
  const resolveConfigurationPath: (serverless: any) => Promise<string | null>

  export = resolveConfigurationPath
}

declare module 'serverless/lib/configuration/variables/resolve-meta' {
  const resolveMeta: (serverless: any) => Promise<string | null>

  export = resolveMeta
}

declare module 'serverless/lib/cli/resolve-input' {
  const resolveInput: (...args: any[]) => any

  export = resolveInput
}

declare module 'serverless/lib/configuration/read' {
  const readConfiguration: (path: string) => Promise<any>

  export = readConfiguration
}
