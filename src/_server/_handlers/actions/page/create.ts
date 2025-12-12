'use server'

import {
    defineServerRequest,
    IMiddlewaresAccessCtx,
} from '@/_server/__internals/defineServerRequest'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireResourceAccess } from '@/_server/_middlewares/requireResourceAccess'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import type { IReturnAction } from '@/_server/_handlers/actions/types'
import { eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { v7 as uuidv7 } from 'uuid'
import { db } from '../../../../../db'
import { formsTable, IPage, pagesTable } from '../../../../../db/schema'

const schema = createInsertSchema(pagesTable, {
    id: (schema) => schema.nullable(),
    title: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    conditions: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
}).partial()

async function create(
    _data: Partial<IPage>,
    ctx: IMiddlewaresAccessCtx<IPage>
): Promise<IReturnAction<Partial<IPage>>> {
    const validatedFields = ctx.validatedFields

    const pageId = uuidv7()

    if (!validatedFields.data?.form_id)
        return {
            status: 'error',
            error: { message: 'Form ID is required' },
        }

    await db.transaction(async (tx) => {
        if (!validatedFields.data?.form_id) return

        await tx.insert(pagesTable).values({
            id: pageId,
            title: validatedFields.data?.title || '',
            order: validatedFields.data?.order || '0',
            conditions: validatedFields.data?.conditions || '',
            form_id: validatedFields.data?.form_id,
        })
        await tx
            .update(formsTable)
            .set({
                updatedAt: new Date().getTime(),
            })
            .where(eq(formsTable.id, validatedFields.data?.form_id))
    })

    return {
        status: 'success',
        data: { id: pageId },
    }
}

export default defineServerRequest<
    Partial<IPage>,
    IMiddlewaresAccessCtx<IPage>
>(create, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
