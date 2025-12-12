'use server'
import {
    defineServerRequest,
    IMiddlewaresAccessCtx,
} from '@/_server/__internals/defineServerRequest'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireResourceAccess } from '@/_server/_middlewares/requireResourceAccess'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { type IReturnAction } from '@/_server/_handlers/actions/types'
import { and, eq } from 'drizzle-orm'
import { createUpdateSchema } from 'drizzle-zod'
import { db } from '../../../../../db'
import { IPage, pagesTable } from '../../../../../db/schema'

const schema = createUpdateSchema(pagesTable, {
    id: (schema) => schema.min(3),
    title: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    conditions: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
}).partial()

async function editPage(
    _data: Partial<IPage>,
    ctx: IMiddlewaresAccessCtx<IPage>
): Promise<IReturnAction<Partial<IPage>>> {
    const validatedFields = ctx.validatedFields

    if (!validatedFields!.data?.id || !validatedFields!.data.form_id)
        return {
            status: 'error',
            error: { message: 'Page ID and Form ID are required' },
        }

    const result = await db
        .update(pagesTable)
        .set(validatedFields!.data)
        .where(
            and(
                eq(pagesTable.id, validatedFields!.data.id),
                eq(pagesTable.form_id, validatedFields!.data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        return {
            status: 'error',
            error: { message: 'Failed to create page' },
        }
    }

    return { status: 'success', data: result.rows[0] as unknown as IPage }
}

export default defineServerRequest<
    Partial<IPage>,
    IMiddlewaresAccessCtx<IPage>
>(editPage, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
