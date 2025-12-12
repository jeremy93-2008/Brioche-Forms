'use server'
import {
    defineServerRequest,
    IMiddlewaresAccessCtx,
} from '@/_server/__internals/defineServerRequest'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireResourceAccess } from '@/_server/_middlewares/requireResourceAccess'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { type IReturnAction } from '@/_server/_handlers/actions/types'
import { eq } from 'drizzle-orm'
import { createUpdateSchema } from 'drizzle-zod'
import { db } from '../../../../../db'
import { formsTable, IForm } from '../../../../../db/schema'

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
    ctx: IMiddlewaresAccessCtx<Partial<IForm>>
): Promise<IReturnAction<Partial<IForm>>> {
    const validatedFields = ctx.validatedFields

    if (!validatedFields!.data?.id)
        return {
            status: 'error',
            error: { message: 'Form ID is required' },
        }

    const result = await db
        .update(formsTable)
        .set({ ...validatedFields!.data, updatedAt: new Date().getTime() })
        .where(eq(formsTable.id, validatedFields!.data?.id))

    if (result.rowsAffected === 0) {
        return {
            status: 'error',
            error: { message: 'Failed to create form' },
        }
    }

    return { status: 'success', data: result.rows[0] as unknown as IForm }
}

export default defineServerRequest<
    Partial<IForm>,
    IMiddlewaresAccessCtx<Partial<IForm>>
>(editForm, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write'], { form_id_field: 'id' }),
])
