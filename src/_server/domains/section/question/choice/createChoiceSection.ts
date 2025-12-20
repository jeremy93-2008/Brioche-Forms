import { getDbClient } from '@/_server/domains/_context/form/withFormContext'
import { v7 as uuidv7 } from 'uuid'
import { choicesTable } from '@db/tables'
import { IChoice } from '@db/types'

export async function createChoiceSection(data: IChoice) {
    const choiceId = uuidv7()

    const result = await getDbClient()
        .tx.insert(choicesTable)
        .values({
            id: choiceId,
            content: data.content,
            order: data.order ?? 'latest',
            question_id: data.question_id,
            form_id: data.form_id,
        })

    if (result.rowsAffected === 0) {
        throw new Error(
            `Question Choice section ${data.id} not created. Due to unknown error.`
        )
    }

    return { id: choiceId }
}
