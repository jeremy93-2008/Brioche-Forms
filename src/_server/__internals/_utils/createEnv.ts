import {
    IServerPluginBuilder,
    IServerPluginReturn,
} from '@/_server/__internals/_plugins/type'
import { IBasicEnv } from '@/_server/__internals/createServer'
import { v7 as uuidv7 } from 'uuid'

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never

type EnvFromBuilder<B> = B extends () => IServerPluginReturn<
    infer Name,
    infer Piece
>
    ? Record<Name, Piece>
    : {}

type EnvFromBuilders<Bs extends readonly any[]> = UnionToIntersection<
    EnvFromBuilder<Bs[number]>
>

export function createEnv<const Bs extends readonly IServerPluginBuilder[]>(
    envBuilders: Bs
): IBasicEnv & EnvFromBuilders<Bs> {
    const env: IBasicEnv & Record<string, unknown> = {
        request: { id: uuidv7(), timestamp: Date.now() },
        hooks: {
            beforeRequest: [],
            afterRequest: [],
            beforeMiddlewares: [],
            afterMiddlewares: [],
            beforeHandler: [],
            afterHandler: [],
        },
    }

    for (const buildEnv of envBuilders) {
        const plg = buildEnv()
        env[plg.name] = plg.cb()
    }

    return env as IBasicEnv & EnvFromBuilders<Bs>
}
