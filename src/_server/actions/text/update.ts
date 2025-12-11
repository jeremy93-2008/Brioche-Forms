'use server'
import {
    defineServerFunction,
    IMiddlewaresAccessCtx,
} from '@/_server/_internals/defineServerFunction'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireResourceAccess } from '@/_server/_middlewares/requireResourceAccess'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { type IReturnAction } from '@/_server/actions/types'
import { and, eq } from 'drizzle-orm'
import { createUpdateSchema } from 'drizzle-zod'
import { db } from '../../../../db'
import { IText, textsTable } from '../../../../db/schema'

const schema = createUpdateSchema(textsTable, {
    id: (schema) => schema.min(3),
    content: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    section_id: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
}).partial()

async function editText(
    _data: Partial<IText>,
    ctx: IMiddlewaresAccessCtx<IText>
): Promise<IReturnAction<Partial<IText>>> {
    const validatedFields = ctx.validatedFields

    if (!validatedFields!.data?.id || !validatedFields!.data.form_id)
        return {
            status: 'error',
            error: { message: 'Text ID and Form ID are required' },
        }

    const result = await db
        .update(textsTable)
        .set(validatedFields!.data)
        .where(
            and(
                eq(textsTable.id, validatedFields!.data.id),
                eq(textsTable.form_id, validatedFields!.data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        return {
            status: 'error',
            error: { message: 'Failed to create section' },
        }
    }

    return { status: 'success', data: result.rows[0] as unknown as IText }
}

export default defineServerFunction<
    Partial<IText>,
    IMiddlewaresAccessCtx<IText>
>(editText, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
