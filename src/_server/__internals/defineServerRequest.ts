import { EventsPlugin } from '@/_server/__internals/_plugins/EventsPlugin'
import {
    IServerPluginBuilder,
    IServerPluginEnvFromBuilder,
} from '@/_server/__internals/_plugins/type'
import {
    ComposeServerFunctionHandler,
    ComposeServerFunctionMiddleware,
} from '@/_server/__internals/composeServerFunction'
import { createServer } from '@/_server/__internals/createServer'
import { FormModifiedAt } from '@/_server/_events/FormModifiedAt'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import { IAuthCtx } from '@/_server/_middlewares/requireAuth'
import { IPermissionCtx } from '@/_server/_middlewares/requireResourceAccess'
import { IValidationCtx } from '@/_server/_middlewares/requireValidation'

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
export function defineServerRequest<
    TData,
    TCtx,
    const Bs extends readonly IServerPluginBuilder[] = [],
>(
    handler: ComposeServerFunctionHandler<
        TData,
        TData,
        TCtx,
        IServerPluginEnvFromBuilder<Bs>
    >,
    middlewares: ComposeServerFunctionMiddleware<
        TData,
        TCtx,
        IServerPluginEnvFromBuilder<Bs>
    >[]
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
export function defineServerRequest<
    TInput,
    TOutput,
    TCtx,
    const Bs extends readonly IServerPluginBuilder[] = [],
>(
    handler: ComposeServerFunctionHandler<
        TInput,
        TOutput,
        TCtx,
        IServerPluginEnvFromBuilder<Bs>
    >,
    middlewares: ComposeServerFunctionMiddleware<
        TInput,
        TCtx,
        IServerPluginEnvFromBuilder<Bs>
    >[]
): (args: TInput) => Promise<IReturnAction<TOutput>>

export function defineServerRequest<
    TInput,
    TOutput,
    TCtx,
    const Bs extends readonly IServerPluginBuilder[] = [],
>(
    handler: ComposeServerFunctionHandler<
        TInput,
        TOutput,
        TCtx,
        IServerPluginEnvFromBuilder<Bs>
    >,
    middlewares: ComposeServerFunctionMiddleware<
        TInput,
        TCtx,
        IServerPluginEnvFromBuilder<Bs>
    >[]
) {
    return createServer<TInput, TOutput, TCtx, Bs>()
        .use(EventsPlugin({ event: FormModifiedAt }))
        .middlewares(...middlewares)
        .handler(handler)
        .execute()
}

export type IMiddlewaresCtx<TData> = IAuthCtx & IValidationCtx<Partial<TData>>

export type IMiddlewaresAccessCtx<TData> = IAuthCtx &
    IValidationCtx<Partial<TData>> &
    IPermissionCtx
