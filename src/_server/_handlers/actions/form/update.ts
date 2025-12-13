'use server'
import {
    defineServerRequest,
    IMiddlewaresAccessCtx,
} from '@/_server/__internals/defineServerRequest'
import { type IReturnAction } from '@/_server/_handlers/actions/types'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireResourceAccess } from '@/_server/_middlewares/requireResourceAccess'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { editForm } from '@/_server/domains/form/editForm'
import { createUpdateSchema } from 'drizzle-zod'
import { formsTable, IForm } from '../../../../../db/schema'

const schema = createUpdateSchema(formsTable, {
    id: (schema) => schema.min(3),
    description: (schema) => schema.nullable(),
    createdAt: (schema) => schema.nullable(),
    updatedAt: (schema) => schema.nullable(),
    backgroundColor: (schema) => schema.nullable(),
    isDraft: (schema) => schema.nullable(),
    isPublished: (schema) => schema.nullable(),
    canModifyResponses: (schema) => schema.nullable(),
    author_id: (schema) => schema.nullable(),
}).partial()

async function updateFormHandler(
    _data: Partial<IForm>,
    ctx: IMiddlewaresAccessCtx<Partial<IForm>>
): Promise<IReturnAction<Partial<IForm>>> {
    const user = ctx.user
    const validatedFields = ctx.validatedFields

    const result = await editForm(user, validatedFields!.data!)

    return { status: 'success', data: result as unknown as IForm }
}

export default defineServerRequest<
    Partial<IForm>,
    IMiddlewaresAccessCtx<Partial<IForm>>
>(updateFormHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write'], { form_id_field: 'id' }),
])
