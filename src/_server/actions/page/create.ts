'use server'

import {
    defineServerFunction,
    IMiddlewaresCtx,
} from '@/_server/_internals/defineServerFunction'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import type { IReturnAction } from '@/_server/actions/types'
import { createInsertSchema } from 'drizzle-zod'
import { v7 as uuidv7 } from 'uuid'
import { db } from '../../../../db'
import { IPage, pagesTable } from '../../../../db/schema'

const schema = createInsertSchema(pagesTable, {
    id: (schema) => schema.nullable(),
    title: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    conditions: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
})

async function create(
    _data: Partial<IPage>,
    ctx: IMiddlewaresCtx<IPage>
): Promise<IReturnAction<Partial<IPage>>> {
    const validatedFields = ctx.validatedFields

    const pageId = uuidv7()

    if (!validatedFields.data?.form_id)
        return {
            status: 'error',
            error: { message: 'Form ID is required' },
        }

    await db.insert(pagesTable).values({
        id: pageId,
        title: validatedFields.data?.title || '',
        order: validatedFields.data?.order || '0',
        conditions: validatedFields.data?.conditions || '',
        form_id: validatedFields.data?.form_id,
    })

    return {
        status: 'success',
        data: { id: pageId },
    }
}

export default defineServerFunction<Partial<IPage>, IMiddlewaresCtx<IPage>>(
    create,
    [requireAuth(), requireValidation(schema)]
)
