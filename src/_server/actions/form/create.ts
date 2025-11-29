'use server'
import {
    defineServerFunction,
    IMiddlewaresCtx,
} from '@/_server/_internals/defineServerFunction'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { type IReturnAction } from '@/_server/actions/types'
import { createInsertSchema } from 'drizzle-zod'
import { v7 as uuidv7 } from 'uuid'
import { db } from '../../../../db'
import { formsTable, IForm } from '../../../../db/schema'

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

    const result = await db.insert(formsTable).values({
        id: form_id,
        title: validatedFields.data?.title || 'Untitled Form',
        description: validatedFields.data?.description || '',
        createdAt: validatedFields.data?.createdAt ?? Date.now(),
        updatedAt: validatedFields.data?.updatedAt ?? Date.now(),
        backgroundColor: validatedFields.data?.backgroundColor ?? '#FFFFFF',
        isDraft: validatedFields.data?.isDraft ?? 1,
        isPublished: validatedFields.data?.isPublished ?? 0,
        canModifyResponses: validatedFields.data?.canModifyResponses ?? 1,
        author_id: user.id,
    })

    if (result.rowsAffected === 0) {
        return {
            status: 'error',
            error: { message: 'Failed to create form' },
        }
    }

    return { status: 'success', data: { id: form_id } }
}

export default defineServerFunction<
    Partial<IForm>,
    IMiddlewaresCtx<Partial<IForm>>
>(createForm, [requireAuth(), requireValidation(schema)])
