import { SectionConstants } from '@/_server/_constants/section'
import { db } from '@db/index'
import { formsTable, pagesTable, sectionsTable, textsTable } from '@db/tables'
import { IForm } from '@db/types'
import { CurrentServerUser } from '@stackframe/stack'
import { v7 as uuidv7 } from 'uuid'

export async function createForm(
    user: CurrentServerUser,
    data: Partial<IForm>
) {
    const form_id = uuidv7()
    const page_id = uuidv7()
    const section_id = uuidv7()
    const text_id = uuidv7()

    const result = await db.transaction(async (tx) => {
        const form_result = await tx.insert(formsTable).values({
            id: form_id,
            title: data.title || 'Formulario sin título',
            description: data.description || '',
            createdAt: data.createdAt ?? Date.now(),
            updatedAt: data.updatedAt ?? Date.now(),
            backgroundColor: data.backgroundColor ?? '#FFFFFF',
            isDraft: data.isDraft ?? 1,
            isPublished: data.isPublished ?? 0,
            canModifyResponses: data.canModifyResponses ?? 1,
            acceptResponses: 1,
            messageIfNotAcceptResponses:
                'Este formulario no acepta respuestas en este momento.',
            author_id: user.id,
            author_name: user.displayName ?? '',
        })

        await tx.insert(pagesTable).values({
            id: page_id,
            title: 'Página 1',
            order: 'latest',
            form_id,
        })

        await tx.insert(sectionsTable).values({
            id: section_id,
            title: 'Sección 1',
            description: '',
            order: 'latest',
            page_id,
            form_id,
        })

        await tx.insert(textsTable).values({
            id: text_id,
            section_id,
            content: SectionConstants.firstTimeContent,
            order: 'latest',
            form_id,
        })

        return form_result
    })

    if (result.rowsAffected === 0) {
        throw Error('Failed to create form')
    }

    return { id: form_id }
}
