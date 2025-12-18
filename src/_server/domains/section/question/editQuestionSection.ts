import { and, eq } from 'drizzle-orm'
import { db } from '../../../../../db'
import { questionsTable } from '../../../../../db/tables'
import { IQuestion } from '../../../../../db/types'

export async function editQuestionSection(data: Partial<IQuestion>) {
    const result = await db
        .update(questionsTable)
        .set(data)
        .where(
            and(
                eq(questionsTable.id, data.id!),
                eq(questionsTable.form_id, data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        throw new Error(`Question section ${data.id} not found`)
    }

    return { id: data.id }
}
