import { getDbClient } from '@/_server/domains/_context/db.client'
import { isTempId } from '@/_utils/temp-id'
import { choicesTable } from '@db/tables'
import { IChoice } from '@db/types'
import { and, eq, notInArray, sql } from 'drizzle-orm'
import { v7 as uuidv7 } from 'uuid'

export async function upsertChoicesSection(data: IChoice[]) {
    if (data.length === 0) {
        throw new Error('No choices provided for creation.')
    }

    const result = await getDbClient()
        .tx.insert(choicesTable)
        .values(
            data.map((choice) => ({
                id: isTempId(choice.id) ? uuidv7() : choice.id,
                content: choice.content,
                order: choice.order ?? 'latest',
                question_id: choice.question_id,
                form_id: choice.form_id,
                is_free_text: choice.is_free_text ?? 0,
            }))
        )
        .onConflictDoUpdate({
            target: choicesTable.id,
            set: {
                content: sql.raw(`excluded.${choicesTable.content.name}`),
                is_free_text: sql.raw(
                    `excluded.${choicesTable.is_free_text.name}`
                ),
                order: sql.raw(`excluded."${choicesTable.order.name}"`),
            },
        })
        .returning({ id: choicesTable.id })

    await getDbClient()
        .tx.delete(choicesTable)
        .where(
            and(
                eq(choicesTable.question_id, data[0].question_id!),
                eq(choicesTable.form_id, data[0].form_id!),
                notInArray(
                    choicesTable.id,
                    result.map((d) => d.id)
                )
            )
        )

    if (result.length === 0) {
        throw new Error(
            `Question Choice section (${data.map((d) => d.id).join(',')}) not found`
        )
    }

    return { ids: result.map((d) => d.id) }
}
