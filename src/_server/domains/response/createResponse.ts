import { getDbClient } from '@/_server/domains/_context/db.client'
import { responsesTable } from '@db/tables'
import { IResponse } from '@db/types'
import { v7 as uuidv7 } from 'uuid'

export async function createResponse(data: Partial<IResponse>) {
    const responseId = uuidv7()

    await getDbClient()
        .tx.insert(responsesTable)
        .values({
            id: responseId,
            form_id: data.form_id!,
            respondent_id: data.respondent_id!,
            respondent_name: data.respondent_name!,
            is_partial_response: data.is_partial_response || 0,
            submitted_at: new Date().getTime(),
        })

    return { id: responseId }
}
