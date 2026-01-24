import { getDbClient } from '@/_server/domains/_context/db.client'
import { isTempId } from '@/_utils/temp-id'
import { answersTable } from '@db/tables'
import { IAnswer } from '@db/types'
import { and, eq, notInArray, sql } from 'drizzle-orm'
import { v7 as uuidv7 } from 'uuid'

export async function upsertAnswersResponse(data: IAnswer[]) {
    if (data.length === 0) {
        throw new Error('No Answers provided for upsert.')
    }

    const result = await getDbClient()
        .tx.insert(answersTable)
        .values(
            data.map((answer) => ({
                id: isTempId(answer.id) ? uuidv7() : answer.id,
                response_id: answer.response_id,
                question_id: answer.question_id,
                form_id: answer.form_id,
                type: answer.type,
                choice_id: answer.choice_id,
                choice_free_text: answer.choice_free_text,
                short_answer: answer.short_answer,
                long_answer: answer.long_answer,
                date_answer: answer.date_answer,
            }))
        )
        .onConflictDoUpdate({
            target: answersTable.id,
            set: {
                type: sql.raw(`excluded.${answersTable.type.name}`),
                choice_id: sql.raw(`excluded.${answersTable.choice_id.name}`),
                choice_free_text: sql.raw(
                    `excluded.${answersTable.choice_free_text.name}`
                ),
                short_answer: sql.raw(
                    `excluded.${answersTable.short_answer.name}`
                ),
                long_answer: sql.raw(
                    `excluded.${answersTable.long_answer.name}`
                ),
                date_answer: sql.raw(
                    `excluded.${answersTable.date_answer.name}`
                ),
            },
        })
        .returning({ id: answersTable.id })

    await getDbClient()
        .tx.delete(answersTable)
        .where(
            and(
                eq(answersTable.response_id, data[0].response_id!),
                eq(answersTable.question_id, data[0].question_id!),
                eq(answersTable.form_id, data[0].form_id!),
                notInArray(
                    answersTable.id,
                    result.map((d) => d.id)
                )
            )
        )

    if (result.length === 0) {
        throw new Error(
            `Response Answers section (${data.map((d) => d.id).join(',')}) not found`
        )
    }

    return { ids: result.map((d) => d.id) }
}
