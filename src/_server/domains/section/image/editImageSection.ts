import { and, eq } from 'drizzle-orm'
import { db } from '@db/index'
import { imagesTable } from '@db/tables'
import { IText } from '@db/types'

export async function editImageSection(data: Partial<IText>) {
    const result = await db
        .update(imagesTable)
        .set(data)
        .where(
            and(
                eq(imagesTable.id, data.id!),
                eq(imagesTable.form_id, data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        throw new Error(`Image section ${data.id} not found`)
    }

    return { id: data.id }
}
