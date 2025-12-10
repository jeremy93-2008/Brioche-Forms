'use server'

import {
    defineServerFunction,
    IMiddlewaresAccessCtx,
} from '@/_server/_internals/defineServerFunction'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireResourceAccess } from '@/_server/_middlewares/requireResourceAccess'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import type { IReturnAction } from '@/_server/actions/types'
import { createInsertSchema } from 'drizzle-zod'
import { v7 as uuidv7 } from 'uuid'
import { db } from '../../../../db'
import { ISection, sectionsTable } from '../../../../db/schema'

const schema = createInsertSchema(sectionsTable, {
    id: (schema) => schema.min(3),
    title: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    conditions: (schema) => schema.nullable(),
    description: (schema) => schema.nullable(),
    page_id: (schema) => schema.min(3),
    form_id: (schema) => schema.min(3),
})

async function create(
    _data: Partial<ISection>,
    ctx: IMiddlewaresAccessCtx<ISection>
): Promise<IReturnAction<Partial<ISection>>> {
    const validatedFields = ctx.validatedFields

    const sectionId = uuidv7()

    if (!validatedFields.data?.page_id || !validatedFields.data?.form_id)
        return {
            status: 'error',
            error: { message: 'Page ID and Form ID are required' },
        }

    await db.insert(sectionsTable).values({
        id: sectionId,
        title: validatedFields.data?.title || '',
        order: validatedFields.data?.order || '0',
        conditions: validatedFields.data?.conditions || '',
        page_id: validatedFields.data?.page_id,
        form_id: validatedFields.data?.form_id,
    })

    return {
        status: 'success',
        data: { id: sectionId },
    }
}

export default defineServerFunction<
    Partial<ISection>,
    IMiddlewaresAccessCtx<ISection>
>(create, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
