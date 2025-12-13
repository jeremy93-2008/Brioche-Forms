import { and, eq } from 'drizzle-orm'
import { db } from '../../../../db'
import { pagesTable } from '../../../../db/tables'
import { IPage } from '../../../../db/types'

export async function editPage(data: Partial<IPage>) {
    const result = await db
        .update(pagesTable)
        .set(data)
        .where(
            and(
                eq(pagesTable.id, data.id!),
                eq(pagesTable.form_id, data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        throw new Error(`Page ${data.id} not found`)
    }

    return { id: data.id! }
}
