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
import z from 'zod'
import { db } from '../../../../../db'
import { pagesTable } from '../../../../../db/schema'

const schema = z.object({
    id: z.string().min(3),
    form_id: z.string().min(3),
})

export type IDeletePage = z.infer<typeof schema>

async function deletePage(
    _data: Partial<IDeletePage>,
    ctx: IMiddlewaresAccessCtx<IDeletePage>
): Promise<IReturnAction<Partial<IDeletePage>>> {
    const validatedFields = ctx.validatedFields

    if (!validatedFields!.data?.id || !validatedFields!.data.form_id)
        return {
            status: 'error',
            error: { message: 'Page ID and Form ID are required' },
        }

    const result = await db
        .delete(pagesTable)
        .where(
            and(
                eq(pagesTable.id, validatedFields!.data.id),
                eq(pagesTable.form_id, validatedFields!.data.form_id!)
            )
        )

    if (result.rowsAffected === 0) {
        return {
            status: 'error',
            error: { message: 'Failed to delete page' },
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

export default defineServerRequest<
    Partial<IDeletePage>,
    IMiddlewaresAccessCtx<IDeletePage>
>(deletePage, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write', 'delete']),
])
