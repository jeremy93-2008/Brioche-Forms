import { EventsDispatcherPlugin } from '@/_server/__internals/_plugins/EventsDispatcherPlugin'
import { LoggingPlugin } from '@/_server/__internals/_plugins/LoggingPlugin'
import { MultipartParserPlugin } from '@/_server/__internals/_plugins/MultipartParserPlugin'
import {
    IServerPluginBuilder,
    IServerPluginEnvFromBuilder,
} from '@/_server/__internals/_plugins/types/type'
import {
    ComposeServerFunctionHandler,
    ComposeServerFunctionMiddleware,
} from '@/_server/__internals/composeServerFunction'
import { createServer } from '@/_server/__internals/createServer'
import { EventsList } from '@/_server/_events'
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
    handler: ComposeServerFunctionHandler<TData, TData, TCtx, ServerEnv>,
    middlewares: ComposeServerFunctionMiddleware<TData, TCtx, ServerEnv>[]
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
 * @template TInputParsed - Parsed input payload type after plugin parsers have run, and sent to the handler.
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
    handler: ComposeServerFunctionHandler<TInput, TOutput, TCtx, ServerEnv>,
    middlewares: ComposeServerFunctionMiddleware<TInput, TCtx, ServerEnv>[]
): (args: TInput) => Promise<IReturnAction<TOutput>>

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
 * @template TInputParsed - Parsed input payload type after plugin parsers have run, and sent to the handler. * @template TOutput - Successful output payload type produced by the handler.
 * @template TCtx - Accumulated context type filled by middlewares (auth, validation, permissions, etc.).
 *
 * @param handler - Business handler executed after middlewares. Receives `(data, ctx, env)`.
 * @param middlewares - Middleware pipeline executed before the handler.
 *
 * @returns A callable server function `(args: TInput) => Promise<IReturnAction<TOutput>>`.
 */
export function defineServerRequest<
    TInput,
    TInputParsed,
    TOutput,
    TCtx,
    const Bs extends readonly IServerPluginBuilder[] = [],
>(
    handler: ComposeServerFunctionHandler<
        TInputParsed,
        TOutput,
        TCtx,
        ServerEnv
    >,
    middlewares: ComposeServerFunctionMiddleware<
        TInputParsed,
        TCtx,
        ServerEnv
    >[]
): (args: TInput) => Promise<IReturnAction<TOutput>>

export function defineServerRequest<
    TInput,
    TInputParsed,
    TOutput,
    TCtx,
    const Bs extends readonly IServerPluginBuilder[] = [],
>(
    handler: ComposeServerFunctionHandler<
        TInputParsed,
        TOutput,
        TCtx,
        ServerEnv
    >,
    middlewares: ComposeServerFunctionMiddleware<
        TInputParsed,
        TCtx,
        ServerEnv
    >[]
) {
    return createServer<TInput, TInputParsed, TOutput, TCtx, Bs>()
        .use(LoggingPlugin({ level: 'debug' }))
        .use(EventsDispatcherPlugin(EventsList))
        .use(MultipartParserPlugin())
        .middlewares(...middlewares)
        .handler(handler)
        .execute()
}

type DefaultBuilders = readonly [
    ReturnType<typeof LoggingPlugin>,
    ReturnType<typeof EventsDispatcherPlugin>,
    ReturnType<typeof MultipartParserPlugin>,
]

export type ServerEnv<Bs extends readonly IServerPluginBuilder[] = []> =
    IServerPluginEnvFromBuilder<[...DefaultBuilders, ...Bs]>

export type IMiddlewaresCtx<TData> = IAuthCtx & IValidationCtx<Partial<TData>>

export type IMiddlewaresAccessCtx<TData> = IAuthCtx &
    IValidationCtx<Partial<TData>> &
    IPermissionCtx
