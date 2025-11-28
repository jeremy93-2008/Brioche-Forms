'use server'
import { v7 as uuidv7 } from 'uuid'
import { db } from '../../../../db'
import { formsTable, IForm } from '../../../../db/schema'
import { createInsertSchema } from 'drizzle-zod'
import { type IReturnAction } from '@/_server/_actions/types'
import { IAuthCtx, requireAuth } from '@/_server/_middlewares/requireAuth'
import {
    IValidationCtx,
    requireValidation,
} from '@/_server/_middlewares/requireValidation'
import { defineServerAction } from '@/_server/_internals/defineServerAction'

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
    data: Partial<IForm>,
    ctx: ICreateFormCtx
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

type ICreateFormCtx = IAuthCtx & IValidationCtx<Partial<IForm>>

export default defineServerAction<Partial<IForm>, ICreateFormCtx>(createForm, [
    requireAuth(),
    requireValidation(schema),
])
