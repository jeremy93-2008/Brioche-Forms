import { and, eq } from 'drizzle-orm'
import { db } from '@db/index'
import { videosTable } from '@db/tables'
import { IVideo } from '@db/types'

export async function editVideoSection(data: Partial<IVideo>) {
    const result = await db
        .update(videosTable)
        .set(data)
        .where(
            and(
                eq(videosTable.id, data.id!),
                eq(videosTable.form_id, data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        throw new Error(`Video section ${data.id} not found`)
    }

    return { id: data.id }
}
