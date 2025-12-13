import { and, eq } from 'drizzle-orm'
import { db } from '../../../../../db'
import { textsTable } from '../../../../../db/tables'
import { IText } from '../../../../../db/types'

export async function editTextSection(data: Partial<IText>) {
    const result = await db
        .update(textsTable)
        .set(data)
        .where(
            and(
                eq(textsTable.id, data.id!),
                eq(textsTable.form_id, data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        throw new Error(`Text section ${data.id} not found`)
    }

    return { id: data.id }
}
