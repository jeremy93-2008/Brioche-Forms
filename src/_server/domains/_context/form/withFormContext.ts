import { ServerEnv } from '@/_server/__internals/defineServerRequest'
import { db } from '@db/index'

export type IDbClient = {
    tx: Parameters<Parameters<typeof db.transaction>[0]>[0]
}

const asyncFormContext = new AsyncLocalStorage<IDbClient>()

export function getDbClient() {
    return asyncFormContext.getStore() ?? { tx: db }
}

export function withFormContext(env: ServerEnv) {
    return async <T>(
        formId: string,
        callback: () => T | Promise<T>
    ): Promise<T> => {
        return db.transaction(async (tx) => {
            return await asyncFormContext.run({ tx }, async () => {
                const result = await callback()
                await env.events.dispatch('formUpdated', formId)
                return result
            })
        })
    }
}
