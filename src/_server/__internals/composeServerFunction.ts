import { IMapCtx } from '@/_server/__internals/types'
import { IReturnAction } from '@/_server/_handlers/actions/types'

export function composeServerFunction<TInput, TOutput, TCtx>(
    handler: (
        data: TInput,
        ctx: TCtx
    ) => Promise<IReturnAction<Partial<TOutput>>>,
    middlewares: ((
        data: TInput,
        ctx: IMapCtx<TCtx>
    ) => Promise<IReturnAction<TInput> | void>)[]
) {
    return async (args: TInput) => {
        const ctx = new Map() as IMapCtx<TCtx>
        for (const middleware of middlewares) {
            const result = await middleware(args, ctx)
            if (result && result.status === 'error') {
                return result
            }
        }
        return handler(args, Object.fromEntries(ctx) as TCtx)
    }
}
