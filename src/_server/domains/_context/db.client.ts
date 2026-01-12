import { db } from '@db/index'

export type IDbClient = {
    tx: Parameters<Parameters<typeof db.transaction>[0]>[0]
}

export const asyncTransactionContext = new AsyncLocalStorage<IDbClient>()

export function getDbClient() {
    return asyncTransactionContext.getStore() ?? { tx: db }
}
