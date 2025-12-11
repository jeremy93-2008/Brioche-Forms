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
import { ISection, IText, textsTable } from '../../../../db/schema'

const schema = createInsertSchema(textsTable, {
    id: (schema) => schema.min(3),
    content: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    section_id: (schema) => schema.min(3),
    form_id: (schema) => schema.min(3),
})

async function create(
    _data: Partial<IText>,
    ctx: IMiddlewaresAccessCtx<IText>
): Promise<IReturnAction<Partial<ISection>>> {
    const validatedFields = ctx.validatedFields

    const textId = uuidv7()

    if (!validatedFields.data?.section_id || !validatedFields.data?.form_id)
        return {
            status: 'error',
            error: { message: 'Section ID and Form ID are required' },
        }

    await db.insert(textsTable).values({
        id: textId,
        order: validatedFields.data?.order ?? '0',
        content: validatedFields.data?.content ?? '',
        section_id: validatedFields.data?.section_id ?? '',
        form_id: validatedFields.data?.form_id,
    })

    return {
        status: 'success',
        data: { id: textId },
    }
}

export default defineServerFunction<
    Partial<IText>,
    IMiddlewaresAccessCtx<IText>
>(create, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
