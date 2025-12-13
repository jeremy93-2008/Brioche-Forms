import { IServerPluginBuilder } from '@/_server/__internals/_plugins/types/type'
import { createEnv } from '@/_server/__internals/_utils/createEnv'
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
    return async (args: TInput) => {
        const env = createEnv<Bs>(envBuilders, {
            handlerName: handler.name,
            middlewareNames: middlewares.map((m) => m.name),
        })

        try {
            await runHooks(env.hooks.beforeRequest)
            const ctx = new Map() as IMapCtx<TCtx>
            await runHooks(env.hooks.beforeMiddlewares)
            for (const middleware of middlewares) {
                const result = await middleware(args, ctx, env as TEnv)
                if (result && result.status === 'error') {
                    return result
                }
            }
            await runHooks(env.hooks.afterMiddlewares)
            await runHooks(env.hooks.beforeHandler)
            const result = await handler(
                args,
                Object.fromEntries(ctx) as TCtx,
                env as TEnv
            )
            await runHooks(env.hooks.afterHandler)

            return result
        } catch (e) {
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
