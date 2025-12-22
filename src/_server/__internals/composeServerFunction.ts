import { IServerPluginBuilder } from '@/_server/__internals/_plugins/types/type'
import { createEnv } from '@/_server/__internals/_utils/createEnv'
import { ServerEnv } from '@/_server/__internals/defineServerRequest'
import { IMapCtx } from '@/_server/__internals/types'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import { runHooks } from './_utils/runHooks'

export type ComposeServerFunctionHandler<TInput, TOutput, TCtx, TEnv> = (
    data: TInput,
    ctx: TCtx,
    env: TEnv
) => Promise<IReturnAction<Partial<TOutput>>>

export type ComposeServerFunctionMiddleware<TInput, TCtx, TEnv> = (
    data: TInput,
    ctx: IMapCtx<TCtx>,
    env: TEnv
) => Promise<IReturnAction<TInput> | void>

export function composeServerFunction<
    TInput,
    TOutput,
    TCtx,
    TEnv,
    const Bs extends readonly IServerPluginBuilder[],
>(
    handler: ComposeServerFunctionHandler<TInput, TOutput, TCtx, TEnv>,
    middlewares: ComposeServerFunctionMiddleware<TInput, TCtx, TEnv>[],
    envBuilders: Bs
) {
    return async (args: any) => {
        const env = createEnv<Bs>(envBuilders, {
            handlerName: handler.name,
            middlewareNames: middlewares.map((m) => m.name),
        })
        try {
            const parsedArgs =
                env.parsers?.reduce((prev, parse) => {
                    return parse(prev)
                }, args) ?? args

            await runHooks(env.hooks.beforeRequest)
            const ctx = new Map() as IMapCtx<TCtx>
            await runHooks(env.hooks.beforeMiddlewares)
            for (const middleware of middlewares) {
                const result = await middleware(parsedArgs, ctx, env as TEnv)
                if (result && result.status === 'error') {
                    throw new Error(result.error.message)
                }
            }

            await runHooks(env.hooks.afterMiddlewares)
            await runHooks(env.hooks.beforeHandler)

            const result = await handler(
                parsedArgs as TInput,
                Object.fromEntries(ctx) as TCtx,
                env as TEnv
            )
            await runHooks(env.hooks.afterHandler)

            return result
        } catch (e) {
            if ((env as unknown as ServerEnv).logging.loglevel === 'debug') {
                return {
                    status: 'error',
                    error: {
                        message:
                            e instanceof Error
                                ? e.message
                                : 'Unknown server error',
                        trace: e instanceof Error ? e.stack : 'No stack trace',
                    },
                }
            }
            return {
                status: 'error',
                error: {
                    message:
                        e instanceof Error ? e.message : 'Unknown server error',
                },
            }
        } finally {
            await runHooks(env.hooks.afterRequest)
        }
    }
}
