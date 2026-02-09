import { IResponseWithAnswers } from '@/_server/_handlers/actions/response/scheme'
import { getDbClient } from '@/_server/domains/_context/db.client'
import { responsesTable } from '@db/tables'
import { and, eq } from 'drizzle-orm'

export async function editResponse(data: Partial<IResponseWithAnswers>) {
    const responseId = data.id!

    await getDbClient()
        .tx.update(responsesTable)
        .set({
            id: responseId,
            form_id: data.form_id!,
            respondent_id: data.respondent_id!,
            respondent_name: data.respondent_name!,
            is_partial_response: data.is_partial_response || 0,
            submitted_at: new Date().getTime(),
        })
        .where(
            and(
                eq(responsesTable.id, responseId),
                eq(responsesTable.form_id, data.form_id!),
                eq(responsesTable.respondent_id, data.respondent_id!)
            )
        )

    return { id: responseId }
}
