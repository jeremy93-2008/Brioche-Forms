import { ITextWithPageId } from '@/_server/_handlers/actions/text/create'
import { createSection } from '@/_server/domains/section/createSection'
import { v7 as uuidv7 } from 'uuid'
import { db } from '../../../../../db'
import { textsTable } from '../../../../../db/tables'

interface ITextSectionOpts {
    withNewSection?: boolean
}

export async function createTextSection(
    data: ITextWithPageId,
    opts: ITextSectionOpts
) {
    const textId = uuidv7()

    let sectionId = data.section_id

    if (!data.section_id && !opts.withNewSection)
        throw new Error(
            'Section ID is required when not creating a new section'
        )

    if (opts.withNewSection) {
        sectionId = uuidv7()
        await createSection({
            id: sectionId,
            title: 'Sección de Texto',
            description: '',
            order: data.order ?? '0',
            conditions: '',
            page_id: data.page_id,
            form_id: data.form_id,
        })
    }

    await db.insert(textsTable).values({
        id: textId,
        order: data?.order ?? '0',
        content: data?.content ?? '',
        section_id: sectionId!,
        form_id: data?.form_id,
    })

    return { id: textId }
}
