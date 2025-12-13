import { IDeleteSection } from '@/_server/_handlers/actions/section/delete'
import { and, eq } from 'drizzle-orm'
import { db } from '../../../../db'
import { sectionsTable } from '../../../../db/tables'

export async function deleteSection(data: IDeleteSection) {
    const result = await db
        .delete(sectionsTable)
        .where(
            and(
                eq(sectionsTable.id, data.id),
                eq(sectionsTable.form_id, data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        throw new Error(`Section ${data.id} not found`)
    }

    return { id: data.id }
}
