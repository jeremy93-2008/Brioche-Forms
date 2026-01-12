import { asyncTransactionContext } from '@/_server/domains/_context/db.client'
import { db } from '@db/index'

export function withTransactionContext() {
    return async <T>(callback: () => T | Promise<T>): Promise<T> => {
        return db.transaction(async (tx) => {
            return await asyncTransactionContext.run({ tx }, async () => {
                return callback()
            })
        })
    }
}
