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
import { ISection, pagesTable, sectionsTable } from '../../../../db/schema'

const schema = createUpdateSchema(pagesTable, {
    id: (schema) => schema.min(3),
    title: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    conditions: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
}).partial()

async function editSection(
    _data: Partial<ISection>,
    ctx: IMiddlewaresAccessCtx<ISection>
): Promise<IReturnAction<Partial<ISection>>> {
    const validatedFields = ctx.validatedFields

    if (!validatedFields!.data?.id || !validatedFields!.data.form_id)
        return {
            status: 'error',
            error: { message: 'Section ID and Form ID are required' },
        }

    const result = await db
        .update(sectionsTable)
        .set(validatedFields!.data)
        .where(
            and(
                eq(sectionsTable.id, validatedFields!.data.id),
                eq(sectionsTable.form_id, validatedFields!.data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        return {
            status: 'error',
            error: { message: 'Failed to create section' },
        }
    }

    return { status: 'success', data: result.rows[0] as unknown as ISection }
}

export default defineServerFunction<
    Partial<ISection>,
    IMiddlewaresAccessCtx<ISection>
>(editSection, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
