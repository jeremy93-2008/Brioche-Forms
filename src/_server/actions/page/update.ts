'use server'
import {
    defineServerFunction,
    IMiddlewaresCtx,
} from '@/_server/_internals/defineServerFunction'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { type IReturnAction } from '@/_server/actions/types'
import { and, eq } from 'drizzle-orm'
import { createUpdateSchema } from 'drizzle-zod'
import { db } from '../../../../db'
import { formsTable, IPage, pagesTable } from '../../../../db/schema'

const schema = createUpdateSchema(pagesTable, {
    id: (schema) => schema.min(3),
    title: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    conditions: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
}).partial()

async function editPage(
    _data: Partial<IPage>,
    ctx: IMiddlewaresCtx<IPage>
): Promise<IReturnAction<Partial<IPage>>> {
    const user = ctx.user
    const validatedFields = ctx.validatedFields

    if (!validatedFields!.data?.id)
        return {
            status: 'error',
            error: { message: 'Form ID is required' },
        }

    const parentForm = await db
        .select()
        .from(formsTable)
        .where(
            and(
                eq(formsTable.id, validatedFields!.data.form_id!),
                eq(formsTable.author_id, user.id)
            )
        )
        .limit(1)
        .get()

    if (!parentForm)
        return {
            status: 'error',
            error: {
                message:
                    'Form not found or you do not have permission to edit it',
            },
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
            error: { message: 'Failed to create form' },
        }
    }

    return { status: 'success', data: result.rows[0] as unknown as IPage }
}

export default defineServerFunction<Partial<IPage>, IMiddlewaresCtx<IPage>>(
    editPage,
    [requireAuth(), requireValidation(schema)]
)
