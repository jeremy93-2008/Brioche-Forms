import { IDeleteChoiceSingle } from '@/_server/_handlers/actions/question/choice/delete'
import { db } from '@db/index'
import { choicesTable } from '@db/tables'
import { and, eq, or } from 'drizzle-orm'

export async function deleteChoicesSection(data: IDeleteChoiceSingle[]) {
    if (data.length === 0) {
        throw new Error('No choices provided for deletion.')
    }
    const result = await db
        .delete(choicesTable)
        .where(
            or(
                ...data.map((d) => {
                    return and(
                        eq(choicesTable.id, d.id),
                        eq(choicesTable.form_id, d.form_id!)
                    )
                })
            )
        )
        .returning({ id: choicesTable.id })

    if (result.length === 0) {
        throw new Error(
            `Question Choice section (${data.map((d) => d.id).join(',')}) not found.`
        )
    }

    return { ids: result.map((d) => d.id) }
}
