import { SectionConstants } from '@/_server/_constants/section'
import { ITextWithPageId } from '@/_server/_handlers/actions/text/create'
import { getDbClient } from '@/_server/domains/_context/db.client'
import { textsTable } from '@db/tables'
import { v7 as uuidv7 } from 'uuid'

export async function createTextSection(data: ITextWithPageId) {
    const textId = uuidv7()

    const sectionId = data.section_id

    const result = await getDbClient()
        .tx.insert(textsTable)
        .values({
            id: textId,
            order: data?.order ?? 'latest',
            content: data?.content ?? SectionConstants.defaultContent,
            section_id: sectionId!,
            form_id: data.form_id!,
        })

    if (result.rowsAffected === 0) {
        throw new Error(
            `Text section ${data.id} not created. Due to unknown error.`
        )
    }

    return { id: textId }
}
