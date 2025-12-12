'use server'
import { SectionConstants } from '@/_server/_constants/section'
import {
    defineServerRequest,
    IMiddlewaresCtx,
} from '@/_server/__internals/defineServerRequest'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { type IReturnAction } from '@/_server/_handlers/actions/types'
import { stackServerApp } from '@/_stack/server'
import { createInsertSchema } from 'drizzle-zod'
import { v7 as uuidv7 } from 'uuid'
import { db } from '../../../../../db'
import {
    formsTable,
    IForm,
    pagesTable,
    sectionsTable,
    textsTable,
} from '../../../../../db/schema'

const schema = createInsertSchema(formsTable, {
    description: (schema) => schema.nullable(),
    createdAt: (schema) => schema.nullable(),
    updatedAt: (schema) => schema.nullable(),
    backgroundColor: (schema) => schema.nullable(),
    isDraft: (schema) => schema.nullable(),
    isPublished: (schema) => schema.nullable(),
    canModifyResponses: (schema) => schema.nullable(),
    author_id: (schema) => schema.nullable(),
}).partial()

export async function createForm(
    _data: Partial<IForm>,
    ctx: IMiddlewaresCtx<Partial<IForm>>
): Promise<IReturnAction<Partial<IForm>>> {
    const user = ctx.user
    const validatedFields = ctx.validatedFields

    const form_id = uuidv7()
    const page_id = uuidv7()
    const section_id = uuidv7()
    const text_id = uuidv7()

    const stackUser = await stackServerApp.getUser(user.id)

    const result = await db.transaction(async (tx) => {
        const form_result = await tx.insert(formsTable).values({
            id: form_id,
            title: validatedFields.data?.title || 'Untitled Form',
            description: validatedFields.data?.description || '',
            createdAt: validatedFields.data?.createdAt ?? Date.now(),
            updatedAt: validatedFields.data?.updatedAt ?? Date.now(),
            backgroundColor: validatedFields.data?.backgroundColor ?? '#FFFFFF',
            isDraft: validatedFields.data?.isDraft ?? 1,
            isPublished: validatedFields.data?.isPublished ?? 0,
            canModifyResponses: validatedFields.data?.canModifyResponses ?? 1,
            acceptResponses: 1,
            messageIfNotAcceptResponses:
                'Este formulario no acepta respuestas en este momento.',
            author_id: user.id,
            author_name: stackUser?.displayName ?? '',
        })

        await tx.insert(pagesTable).values({
            id: page_id,
            title: 'Página 1',
            order: '0',
            form_id,
        })

        await tx.insert(sectionsTable).values({
            id: section_id,
            title: 'Sección 1',
            description: '',
            order: '0',
            page_id,
            form_id,
        })

        await tx.insert(textsTable).values({
            id: text_id,
            section_id,
            content: SectionConstants.defaultContent,
            order: '0',
            form_id,
        })

        return form_result
    })

    if (result.rowsAffected === 0) {
        return {
            status: 'error',
            error: { message: 'Failed to create form' },
        }
    }

    return { status: 'success', data: { id: form_id } }
}

export default defineServerRequest<
    Partial<IForm>,
    IMiddlewaresCtx<Partial<IForm>>
>(createForm, [requireAuth(), requireValidation(schema)])
