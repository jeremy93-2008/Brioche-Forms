import { IServerPluginBuilder } from '@/_server/__internals/_plugins/types/type'
import { ServerEnv } from '@/_server/__internals/defineServerRequest'

export interface IMultipartPluginReturnCb {
    parse: (data: FormData) => Record<string, any>
}

export function MultipartParserPlugin(): IServerPluginBuilder<
    'multipart',
    IMultipartPluginReturnCb
> {
    const multipartParse = (data: FormData) => {
        if (!(data instanceof FormData)) return data
        const parsed: Record<string, any> = {}
        data.forEach((value, key) => {
            if (parsed[key]) {
                if (Array.isArray(parsed[key])) {
                    parsed[key].push(value)
                } else {
                    parsed[key] = [parsed[key], value]
                }
            } else {
                parsed[key] = value
            }
        })
        return parsed
    }

    return (env: ServerEnv, opts) => {
        return {
            name: 'multipart',
            cb: () => ({
                parse: multipartParse,
            }),
            hooks: {
                beforeRequest: [
                    () => {
                        env.logging.debug(
                            `   📦 🔄 [req#${env.request.id.slice(-5)}] → parsing multipart data`
                        )
                        env.logging.debug(
                            `   📦 [req#${env.request.id.slice(-5)}] → multipart data parsed`
                        )
                    },
                ],
                beforeMiddlewares: [],
                afterMiddlewares: [],
                beforeHandler: [],
                afterHandler: [],
            },
            parser: multipartParse,
        }
    }
}
