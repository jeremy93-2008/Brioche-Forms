'use server'

import {
    defineServerRequest,
    IMiddlewaresCtx,
} from '@/_server/__internals/defineServerRequest'
import type { IReturnAction } from '@/_server/_handlers/actions/types'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { getFullForms, IFullForm } from '@/_server/domains/form/getFullForms'
import { stackServerApp } from '@/_stack/server'
import { createSelectSchema } from 'drizzle-zod'
import { formsTable, IForm } from '../../../../../db/schema'

const schema = createSelectSchema(formsTable, {
    id: (schema) => schema.nullable(),
    author_id: (schema) => schema.nullable(),
    backgroundColor: (schema) => schema.nullable(),
    backgroundImage: (schema) => schema.nullable(),
    canModifyResponses: (schema) => schema.nullable(),
    createdAt: (schema) => schema.nullable(),
    updatedAt: (schema) => schema.nullable(),
    description: (schema) => schema.nullable(),
    folder_id: (schema) => schema.nullable(),
    headerImage: (schema) => schema.nullable(),
    isDraft: (schema) => schema.nullable(),
    isPublished: (schema) => schema.nullable(),
    responseLimit: (schema) => schema.nullable(),
    responseLimitDate: (schema) => schema.nullable(),
    title: (schema) => schema.nullable(),
}).partial()

async function getFullFormsHandler(
    _data: Partial<IForm>,
    ctx: IMiddlewaresCtx<IForm>
): Promise<IReturnAction<IFullForm[]>> {
    const user = await stackServerApp.getUser()
    const validatedFields = ctx.validatedFields

    const rawResult = await getFullForms(validatedFields.data!)

    const result = rawResult.filter(
        (form) => form.isPublished || form.author_id === user?.id
    )

    return { status: 'success', data: result }
}

export default defineServerRequest<
    Partial<IForm>,
    IFullForm[],
    IMiddlewaresCtx<IForm>
>(getFullFormsHandler, [requireValidation(schema)])
