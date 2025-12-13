import { EventsDispatcherPlugin } from '@/_server/__internals/_plugins/EventsDispatcherPlugin'
import { LoggingPlugin } from '@/_server/__internals/_plugins/LoggingPlugin'
import {
    IServerPluginBuilder,
    IServerPluginEnvFromBuilder,
} from '@/_server/__internals/_plugins/types/type'
import {
    ComposeServerFunctionHandler,
    ComposeServerFunctionMiddleware,
} from '@/_server/__internals/composeServerFunction'
import { createServer } from '@/_server/__internals/createServer'
import { FormTouched } from '@/_server/_events/FormTouched'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import { IAuthCtx } from '@/_server/_middlewares/requireAuth'
import { IPermissionCtx } from '@/_server/_middlewares/requireResourceAccess'
import { IValidationCtx } from '@/_server/_middlewares/requireValidation'

/**
 * Entry point for server actions in this codebase.
 *
 * Creates and returns a request-scoped server function by:
 * - building a typed `env` from registered plugins (logging, events, etc.)
 * - running lifecycle hooks around the request (via plugins)
 * - executing middlewares sequentially to enrich/validate `ctx` or short-circuit with an error
 * - executing the handler with `(data, ctx, env)` and returning an `IReturnAction`
 *
 * Notes:
 * - Plugins are registered at build time (via `createServer().use(...)`) and their `env` is
 *   instantiated per request inside the composed function.
 * - Middlewares run before the handler and can stop execution by returning `{ status: "error" }`.
 *
 * @template TData - Payload type sent and received by the server function
 * @template TCtx - Accumulated context type filled by middlewares (auth, validation, permissions, etc.).
 *
 * @param handler - Business handler executed after middlewares. Receives `(data, ctx, env)`.
 * @param middlewares - Middleware pipeline executed before the handler.
 *
 * @returns A callable server function `(args: TInput) => Promise<IReturnAction<TOutput>>`.
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
 * Entry point for server actions in this codebase.
 *
 * Creates and returns a request-scoped server function by:
 * - building a typed `env` from registered plugins (logging, events, etc.)
 * - running lifecycle hooks around the request (via plugins)
 * - executing middlewares sequentially to enrich/validate `ctx` or short-circuit with an error
 * - executing the handler with `(data, ctx, env)` and returning an `IReturnAction`
 *
 * Notes:
 * - Plugins are registered at build time (via `createServer().use(...)`) and their `env` is
 *   instantiated per request inside the composed function.
 * - Middlewares run before the handler and can stop execution by returning `{ status: "error" }`.
 *
 * @template TInput - Input payload type received by the server function.
 * @template TOutput - Successful output payload type produced by the handler.
 * @template TCtx - Accumulated context type filled by middlewares (auth, validation, permissions, etc.).
 *
 * @param handler - Business handler executed after middlewares. Receives `(data, ctx, env)`.
 * @param middlewares - Middleware pipeline executed before the handler.
 *
 * @returns A callable server function `(args: TInput) => Promise<IReturnAction<TOutput>>`.
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
        .use(LoggingPlugin({ level: 'debug' }))
        .use(EventsDispatcherPlugin({ formTouched: FormTouched }))
        .middlewares(...middlewares)
        .handler(handler)
        .execute()
}

export type IMiddlewaresCtx<TData> = IAuthCtx & IValidationCtx<Partial<TData>>

export type IMiddlewaresAccessCtx<TData> = IAuthCtx &
    IValidationCtx<Partial<TData>> &
    IPermissionCtx
