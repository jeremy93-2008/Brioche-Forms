import { IDeleteText } from '@/_server/_handlers/actions/text/delete'
import { and, eq } from 'drizzle-orm'
import { db } from '../../../../../db'
import { imagesTable } from '../../../../../db/tables'

export async function deleteImageSection(data: IDeleteText) {
    const result = await db
        .delete(imagesTable)
        .where(
            and(
                eq(imagesTable.id, data.id),
                eq(imagesTable.form_id, data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        throw new Error(`Image section ${data.id} not found.`)
    }

    return { id: data.id }
}
