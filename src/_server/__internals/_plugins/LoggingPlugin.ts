import { IServerPluginBuilder } from '@/_server/__internals/_plugins/types/type'

interface ILoggingPluginReturnCb {
    info: (message: string) => void
    error: (message: string) => void
    debug: (message: string) => void
    warn: (message: string) => void
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export function LoggingPlugin(opts?: {
    level?: LogLevel
}): IServerPluginBuilder<'logging', ILoggingPluginReturnCb> {
    const level: LogLevel = opts?.level ?? 'info'

    const info = (message: string) => {
        if (level === 'error' || level === 'warn') return
        console.log(`[INFO]: ${message}`)
    }
    const error = (message: string) => {
        console.error(`[ERROR]: ${message}`)
    }
    const debug = (message: string) => {
        if (level !== 'debug') return
        console.debug(`[DEBUG]: ${message}`)
    }
    const warn = (message: string) => {
        if (level === 'error') return
        console.warn(`[WARN]: ${message}`)
    }

    return (env, opts) => {
        const rid = env.request.id.slice(-5)
        const t = new Date(env.request.timestamp).toISOString().slice(11, 23)

        return {
            name: 'logging',
            cb: () => ({
                level,
                info,
                error,
                debug,
                warn,
            }),
            hooks: {
                beforeRequest: [
                    () =>
                        info(
                            `[req#${rid}] → serverFn:${opts.handlerName} @${t}`
                        ),
                ],
                beforeMiddlewares: [
                    () => {
                        const ms = Date.now() - env.request.timestamp
                        debug(`[req#${rid}] → middlewares started t+${ms}ms`)
                    },
                ],
                afterMiddlewares: [
                    () => {
                        const middlewaresNames =
                            opts.middlewareNames.join(', ') || 'none'
                        const ms = Date.now() - env.request.timestamp
                        debug(
                            `[req#${rid}] → middlewares done t+${ms}ms - [${middlewaresNames}]`
                        )
                    },
                ],
                beforeHandler: [
                    () => {
                        const ms = Date.now() - env.request.timestamp
                        debug(
                            `[req#${rid}] → handler started:${opts.handlerName} t+${ms}ms`
                        )
                    },
                ],
                afterHandler: [
                    () => {
                        const ms = Date.now() - env.request.timestamp
                        debug(
                            `[req#${rid}] → handler done:${opts.handlerName} t+${ms}ms`
                        )
                    },
                ],
                afterRequest: [
                    () => {
                        const ms = Date.now() - env.request.timestamp
                        info(
                            `[req#${rid}] ← serverFn:${opts.handlerName} ${ms}ms`
                        )
                    },
                ],
            },
        }
    }
}
