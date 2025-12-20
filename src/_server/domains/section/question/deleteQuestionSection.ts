import { IDeleteVideo } from '@/_server/_handlers/actions/video/delete'
import { and, eq } from 'drizzle-orm'
import { db } from '@db/index'
import { questionsTable } from '@db/tables'

export async function deleteQuestionSection(data: IDeleteVideo) {
    const result = await db
        .delete(questionsTable)
        .where(
            and(
                eq(questionsTable.id, data.id),
                eq(questionsTable.form_id, data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        throw new Error(`Question section ${data.id} not found.`)
    }

    return { id: data.id }
}
