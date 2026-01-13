import { getDbClient } from '@/_server/domains/_context/db.client'
import { answersTable, multipleChoicesTable } from '@db/tables'
import { IMultipleChoice } from '@db/types'
import { and, eq, notInArray, sql } from 'drizzle-orm'
import { v7 as uuidv7 } from 'uuid'

export async function upsertMultiChoicesAnswer(data: IMultipleChoice[]) {
    if (data.length === 0) {
        throw new Error('No Multichoice Answer provided for upsert.')
    }

    const result = await getDbClient()
        .tx.insert(multipleChoicesTable)
        .values(
            data.map((multichoice) => ({
                id: uuidv7(),
                answer_id: multichoice.answer_id,
                choice_id: multichoice.choice_id,
                form_id: multichoice.form_id,
            }))
        )
        .onConflictDoUpdate({
            target: multipleChoicesTable.id,
            set: {
                choice_id: sql.raw(
                    `excluded.${multipleChoicesTable.choice_id.name}`
                ),
            },
        })
        .returning({ id: answersTable.id })

    await getDbClient()
        .tx.delete(multipleChoicesTable)
        .where(
            and(
                eq(multipleChoicesTable.answer_id, data[0].answer_id!),
                eq(multipleChoicesTable.form_id, data[0].form_id!),
                notInArray(
                    multipleChoicesTable.id,
                    result.map((d) => d.id)
                )
            )
        )

    if (result.length === 0) {
        throw new Error(
            `Answers Multichoices section (${data.map((d) => d.id).join(',')}) not found`
        )
    }

    return { ids: result.map((d) => d.id) }
}
