import { and, eq } from 'drizzle-orm'
import { db } from '@db/index'
import { choicesTable } from '@db/tables'
import { IChoice } from '@db/types'

export async function editChoiceSection(data: Partial<IChoice>) {
    const result = await db
        .update(choicesTable)
        .set(data)
        .where(
            and(
                eq(choicesTable.id, data.id!),
                eq(choicesTable.form_id, data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        throw new Error(`Question Choice section ${data.id} not found`)
    }

    return { id: data.id }
}
