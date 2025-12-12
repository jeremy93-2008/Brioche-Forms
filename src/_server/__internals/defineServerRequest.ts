import { composeServerFunction } from '@/_server/__internals/composeServerFunction'
import { IMapCtx } from '@/_server/__internals/types'
import { IAuthCtx } from '@/_server/_middlewares/requireAuth'
import { IPermissionCtx } from '@/_server/_middlewares/requireResourceAccess'
import { IValidationCtx } from '@/_server/_middlewares/requireValidation'
import { IReturnAction } from '@/_server/_handlers/actions/types'

/**
 * Defines a server function by wrapping a handler with a pipeline of middlewares.
 *
 * Middlewares run sequentially and may:
 * - augment the action context,
 * - validate or transform the input,
 * - block execution by returning an error result.
 *
 * After all middlewares run, the handler receives the final input
 * plus the accumulated context and produces the action result.
 *
 * @template TData - The type of the input data for the action.
 * @template TCtx - The context type shared between middlewares and handler.
 * @param handler - The main action handler function.
 * @param middlewares - An array of middleware functions to be executed before the handler.
 * @returns A server function ready to be used from the client.
 */
export function defineServerRequest<TData, TCtx>(
    handler: (data: TData, ctx: TCtx) => Promise<IReturnAction<Partial<TData>>>,
    middlewares: ((
        data: TData,
        ctx: IMapCtx<TCtx>
    ) => Promise<IReturnAction<TData> | void>)[]
): (args: TData) => Promise<IReturnAction<TData>>

/**
 * Defines a server function by wrapping a handler with a pipeline of middlewares.
 *
 * Middlewares run sequentially and may:
 * - augment the action context,
 * - validate or transform the input,
 * - block execution by returning an error result.
 *
 * After all middlewares run, the handler receives the final input
 * plus the accumulated context and produces the action result.
 *
 * @template TInput - The type of the input data for the action.
 * @template TOutput - The type of the output data from the action.
 * @template TCtx - The context type shared between middlewares and handler.
 * @param handler - The main action handler function.
 * @param middlewares - An array of middleware functions to be executed before the handler.
 * @returns A server function ready to be used from the client.
 */
export function defineServerRequest<TInput, TOutput, TCtx>(
    handler: (
        data: TInput,
        ctx: TCtx
    ) => Promise<IReturnAction<Partial<TOutput>>>,
    middlewares: ((
        data: TInput,
        ctx: IMapCtx<TCtx>
    ) => Promise<IReturnAction<TInput> | void>)[]
): (args: TInput) => Promise<IReturnAction<TOutput>>

export function defineServerRequest<TInput, TOutput, TCtx>(
    handler: (
        data: TInput,
        ctx: TCtx
    ) => Promise<IReturnAction<Partial<TOutput>>>,
    middlewares: ((
        data: TInput,
        ctx: IMapCtx<TCtx>
    ) => Promise<IReturnAction<TInput> | void>)[]
) {
    return composeServerFunction<TInput, TOutput, TCtx>(handler, middlewares)
}

export type IMiddlewaresCtx<TData> = IAuthCtx & IValidationCtx<Partial<TData>>

export type IMiddlewaresAccessCtx<TData> = IAuthCtx &
    IValidationCtx<Partial<TData>> &
    IPermissionCtx
