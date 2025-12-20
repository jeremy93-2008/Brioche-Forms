import { IDeleteVideo } from '@/_server/_handlers/actions/video/delete'
import { and, eq } from 'drizzle-orm'
import { db } from '@db/index'
import { videosTable } from '@db/tables'

export async function deleteVideoSection(data: IDeleteVideo) {
    const result = await db
        .delete(videosTable)
        .where(
            and(
                eq(videosTable.id, data.id),
                eq(videosTable.form_id, data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        throw new Error(`Video section ${data.id} not found.`)
    }

    return { id: data.id }
}
