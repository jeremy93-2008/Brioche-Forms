import { and, eq } from 'drizzle-orm'
import { db } from '@db/index'
import { sectionsTable } from '@db/tables'
import { ISection } from '@db/types'

export async function editSection(data: ISection) {
    const result = await db
        .update(sectionsTable)
        .set(data)
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
