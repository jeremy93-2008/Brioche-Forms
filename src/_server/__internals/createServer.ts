import {
    IServerPluginBuilder,
    IServerPluginEnvFromBuilder,
} from '@/_server/__internals/_plugins/types/type'
import {
    composeServerFunction,
    ComposeServerFunctionHandler,
    ComposeServerFunctionMiddleware,
} from '@/_server/__internals/composeServerFunction'

export interface IBasicEnv {
    request: {
        id: string
        timestamp: number
    }
    hooks: {
        beforeRequest: Array<() => void | Promise<void>>
        afterRequest: Array<() => void | Promise<void>>
        beforeMiddlewares: Array<() => void | Promise<void>>
        afterMiddlewares: Array<() => void | Promise<void>>
        beforeHandler: Array<() => void | Promise<void>>
        afterHandler: Array<() => void | Promise<void>>
    }
}

export function createServer<
    TInput,
    TOutput,
    TCtx,
    const Bs extends readonly IServerPluginBuilder[] = [],
>() {
    const envBuilders = [] as IServerPluginBuilder[]

    let _handler: ComposeServerFunctionHandler<
        TInput,
        TOutput,
        TCtx,
        IServerPluginEnvFromBuilder<Bs>
    > = async () => {
        return { status: 'success', data: {} }
    }
    const _middlewares: ComposeServerFunctionMiddleware<
        TInput,
        TCtx,
        IServerPluginEnvFromBuilder<Bs>
    >[] = []

    const getServer = () => {
        return {
            use: <Name extends string, EnvPiece extends object>(
                plugin: IServerPluginBuilder<Name, EnvPiece>
            ) => {
                envBuilders.push(plugin as IServerPluginBuilder)
                return getServer() as unknown as ReturnType<
                    typeof createServer<
                        TInput,
                        TOutput,
                        TCtx,
                        [...Bs, IServerPluginBuilder<Name, EnvPiece>]
                    >
                >
            },
            middlewares: (
                ...middlewares: ComposeServerFunctionMiddleware<
                    TInput,
                    TCtx,
                    IServerPluginEnvFromBuilder<Bs>
                >[]
            ) => {
                _middlewares.push(...middlewares)
                return getServer()
            },
            handler: (
                handler: ComposeServerFunctionHandler<
                    TInput,
                    TOutput,
                    TCtx,
                    IServerPluginEnvFromBuilder<Bs>
                >
            ) => {
                _handler = handler
                return getServer()
            },
            execute: () => {
                return composeServerFunction<
                    TInput,
                    TOutput,
                    TCtx,
                    IServerPluginEnvFromBuilder<Bs>,
                    Bs
                >(_handler, _middlewares, envBuilders as unknown as Bs)
            },
        }
    }

    return getServer()
}
