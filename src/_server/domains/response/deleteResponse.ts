import { IResponseWithAnswers } from '@/_server/_handlers/actions/response/create'
import { getDbClient } from '@/_server/domains/_context/db.client'
import { responsesTable } from '@db/tables'
import { and, eq } from 'drizzle-orm'
import { v7 as uuidv7 } from 'uuid'

export async function deleteResponse(
    data: Partial<IResponseWithAnswers>,
    userId: string
) {
    const responseId = uuidv7()

    await getDbClient()
        .tx.delete(responsesTable)
        .where(
            and(
                eq(responsesTable.id, responseId),
                eq(responsesTable.form_id, data.form_id!),
                eq(responsesTable.respondent_id, data.respondent_id!),
                eq(responsesTable.respondent_id, userId)
            )
        )

    return { id: responseId }
}
