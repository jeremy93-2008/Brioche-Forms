'use server'
import { db } from '../../../../db'
import { formsTable, IForm } from '../../../../db/schema'
import { createUpdateSchema } from 'drizzle-zod'
import { type IReturnAction } from '@/_server/_actions/types'
import { defineServerAction } from '@/_server/_internals/defineServerAction'
import { IAuthCtx, requireAuth } from '@/_server/_middlewares/requireAuth'
import {
    IValidationCtx,
    requireValidation,
} from '@/_server/_middlewares/requireValidation'
import { eq } from 'drizzle-orm'

const schema = createUpdateSchema(formsTable, {
    description: (schema) => schema.nullable(),
    createdAt: (schema) => schema.nullable(),
    updatedAt: (schema) => schema.nullable(),
    backgroundColor: (schema) => schema.nullable(),
    isDraft: (schema) => schema.nullable(),
    isPublished: (schema) => schema.nullable(),
    canModifyResponses: (schema) => schema.nullable(),
    author_id: (schema) => schema.nullable(),
}).partial()

async function editForm(
    _data: Partial<IForm>,
    ctx: IEditFormCtx
): Promise<IReturnAction<Partial<IForm>>> {
    const validatedFields = ctx.validatedFields

    if (!validatedFields!.data?.id)
        return {
            status: 'error',
            error: { message: 'Form ID is required' },
        }

    const result = await db
        .update(formsTable)
        .set(validatedFields!.data)
        .where(eq(formsTable.id, validatedFields!.data?.id))

    if (result.rowsAffected === 0) {
        return {
            status: 'error',
            error: { message: 'Failed to create form' },
        }
    }

    return { status: 'success', data: result.rows[0] as unknown as IForm }
}

type IEditFormCtx = IAuthCtx & IValidationCtx<Partial<IForm>>

export default defineServerAction<Partial<IForm>, IEditFormCtx>(editForm, [
    requireAuth(),
    requireValidation(schema),
])
