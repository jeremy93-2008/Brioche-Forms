import { getDbClient } from '@/_server/domains/_context/db.client'
import { questionsTable } from '@db/tables'
import { IQuestion } from '@db/types'
import { and, eq } from 'drizzle-orm'

export async function GetQuestionsByFormId(
    formId: string
): Promise<IQuestion[]> {
    return await getDbClient().tx.query.questionsTable.findMany({
        where: and(eq(questionsTable.form_id, formId)),
    })
}
