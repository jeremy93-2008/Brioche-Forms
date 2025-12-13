'use server'
import {
    defineServerRequest,
    IMiddlewaresCtx,
} from '@/_server/__internals/defineServerRequest'
import { type IReturnAction } from '@/_server/_handlers/actions/types'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { createForm } from '@/_server/domains/form/createForm'
import { createInsertSchema } from 'drizzle-zod'
import { formsTable, IForm } from '../../../../../db/schema'

const schema = createInsertSchema(formsTable, {
    description: (schema) => schema.nullable(),
    createdAt: (schema) => schema.nullable(),
    updatedAt: (schema) => schema.nullable(),
    backgroundColor: (schema) => schema.nullable(),
    isDraft: (schema) => schema.nullable(),
    isPublished: (schema) => schema.nullable(),
    canModifyResponses: (schema) => schema.nullable(),
    author_id: (schema) => schema.nullable(),
}).partial()

export async function createFormHandler(
    _data: Partial<IForm>,
    ctx: IMiddlewaresCtx<Partial<IForm>>
): Promise<IReturnAction<Partial<IForm>>> {
    const user = ctx.user
    const validatedFields = ctx.validatedFields

    const result = await createForm(user, validatedFields.data!)

    return { status: 'success', data: result }
}

export default defineServerRequest<
    Partial<IForm>,
    IMiddlewaresCtx<Partial<IForm>>
>(createFormHandler, [requireAuth(), requireValidation(schema)])
