import { IDeleteChoice } from '@/_server/_handlers/actions/question/choice/delete'
import { and, eq } from 'drizzle-orm'
import { db } from '@db/index'
import { choicesTable } from '@db/tables'

export async function deleteChoiceSection(data: IDeleteChoice) {
    const result = await db
        .delete(choicesTable)
        .where(
            and(
                eq(choicesTable.id, data.id),
                eq(choicesTable.form_id, data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        throw new Error(`Question Choice section ${data.id} not found.`)
    }

    return { id: data.id }
}
