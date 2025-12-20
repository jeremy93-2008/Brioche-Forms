import { IDeletePage } from '@/_server/_handlers/actions/page/delete'
import { and, eq } from 'drizzle-orm'
import { db } from '@db/index'
import { pagesTable } from '@db/tables'

export async function deletePage(data: IDeletePage) {
    const result = await db
        .delete(pagesTable)
        .where(
            and(
                eq(pagesTable.id, data.id),
                eq(pagesTable.form_id, data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        throw new Error(`Page ${data.id} not found`)
    }

    return { id: data.id }
}
