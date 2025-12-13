import {
    IServerPluginBuilder,
    IServerPluginBuilderOptions,
    IServerPluginReturn,
} from '@/_server/__internals/_plugins/types/type'
import { mergeHooks } from '@/_server/__internals/_utils/mergeHooks'
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
    envBuilders: Bs,
    opts: IServerPluginBuilderOptions
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
        const plg = buildEnv(env, opts)
        // We invoke the callback to get the environment piece
        env[plg.name] = plg.cb()

        // We register hooks if any
        if (plg.hooks) {
            mergeHooks(env.hooks, plg.hooks)
        }
    }

    return env as IBasicEnv & EnvFromBuilders<Bs>
}
