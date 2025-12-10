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
import z from 'zod'
import { db } from '../../../../db'
import { pagesTable, sectionsTable } from '../../../../db/schema'

const schema = z.object({
    id: z.string().min(3),
    form_id: z.string().min(3),
})

export type IDeleteSection = z.infer<typeof schema>

async function deleteSection(
    _data: Partial<IDeleteSection>,
    ctx: IMiddlewaresAccessCtx<IDeleteSection>
): Promise<IReturnAction<Partial<IDeleteSection>>> {
    const validatedFields = ctx.validatedFields

    if (!validatedFields!.data?.id || !validatedFields!.data.form_id)
        return {
            status: 'error',
            error: { message: 'Page ID and Form ID are required' },
        }

    const result = await db
        .delete(sectionsTable)
        .where(
            and(
                eq(pagesTable.id, validatedFields!.data.id),
                eq(pagesTable.form_id, validatedFields!.data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        return {
            status: 'error',
            error: { message: 'Failed to delete section' },
        }
    }

    return {
        status: 'success',
        data: {
            id: validatedFields!.data.id,
            form_id: validatedFields!.data.form_id,
        },
    }
}

export default defineServerFunction<
    Partial<IDeleteSection>,
    IMiddlewaresAccessCtx<IDeleteSection>
>(deleteSection, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write', 'delete']),
])
