import { IDeleteText } from '@/_server/_handlers/actions/text/delete'
import { and, eq } from 'drizzle-orm'
import { db } from '@db/index'
import { textsTable } from '@db/tables'

export async function deleteTextSection(data: IDeleteText) {
    const result = await db
        .delete(textsTable)
        .where(
            and(
                eq(textsTable.id, data.id),
                eq(textsTable.form_id, data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        throw new Error(`Text section ${data.id} not found.`)
    }

    return { id: data.id }
}
