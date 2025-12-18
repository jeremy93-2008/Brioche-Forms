import { IQuestionWithPageId } from '@/_server/_handlers/actions/question/create'
import { v7 as uuidv7 } from 'uuid'
import { db } from '../../../../../db'
import { questionsTable } from '../../../../../db/tables'

export async function createQuestionSection(data: IQuestionWithPageId) {
    const questionId = uuidv7()

    const sectionId = data.section_id

    const result = await db.insert(questionsTable).values({
        id: questionId,
        name: data.name,
        content: data?.content ?? '',
        type: data.type,
        is_required: data?.is_required ?? 0,
        order: data?.order ?? 'latest',
        section_id: sectionId!,
        form_id: data?.form_id,
    })

    if (result.rowsAffected === 0) {
        throw new Error(
            `Question section ${data.id} not created. Due to unknown error.`
        )
    }

    return { id: questionId }
}
