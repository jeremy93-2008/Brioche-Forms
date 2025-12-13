import { IBasicEnv } from '@/_server/__internals/createServer'

export interface IServerPluginReturn<Name extends string, Env extends object> {
    name: Name
    cb: () => Env
    hooks?: Partial<IBasicEnv['hooks']>
}

export type IServerPluginBuilderOptions = {
    handlerName: string
    middlewareNames: string[]
}

export type IServerPluginBuilder<
    Name extends string = string,
    Piece extends object = object,
> = (...args: any[]) => IServerPluginReturn<Name, Piece>

export type IServerPluginEnvFromBuilder<
    Bs extends readonly IServerPluginBuilder[],
> = IBasicEnv & EnvFromBuilders<Bs>

// helpers
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never

type EnvFromBuilder<B> = B extends (
    ...args: any[]
) => IServerPluginReturn<infer Name, infer Piece>
    ? Record<Name, Piece>
    : {}

export type EnvFromBuilders<Bs extends readonly any[]> = UnionToIntersection<
    EnvFromBuilder<Bs[number]>
>
