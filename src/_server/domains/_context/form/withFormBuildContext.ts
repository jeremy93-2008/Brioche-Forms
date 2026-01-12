import { ServerEnv } from '@/_server/__internals/defineServerRequest'
import { asyncTransactionContext } from '@/_server/domains/_context/db.client'
import { db } from '@db/index'

export function withFormBuildContext(env: ServerEnv) {
    return async <T>(
        formId: string,
        callback: () => T | Promise<T>
    ): Promise<T> => {
        return db.transaction(async (tx) => {
            return await asyncTransactionContext.run({ tx }, async () => {
                const result = await callback()
                await env.events.dispatch('formUpdated', formId)
                return result
            })
        })
    }
}
