'use server'
import {
    defineServerRequest,
    IMiddlewaresAccessCtx,
    ServerEnv,
} from '@/_server/__internals/defineServerRequest'
import { type IReturnAction } from '@/_server/_handlers/actions/types'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireResourceAccess } from '@/_server/_middlewares/requireResourceAccess'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { withFormContext } from '@/_server/domains/_context/form/withFormContext'
import { editPage } from '@/_server/domains/page/editPage'
import { createUpdateSchema } from 'drizzle-zod'
import { IPage, pagesTable } from '../../../../../db/schema'

const schema = createUpdateSchema(pagesTable, {
    id: (schema) => schema.min(3),
    title: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    conditions: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
}).partial()

async function editPageHandler(
    _data: Partial<IPage>,
    ctx: IMiddlewaresAccessCtx<IPage>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IPage>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Required<IPage>
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, () => editPage(data))

    return { status: 'success', data: result }
}

export default defineServerRequest<
    Partial<IPage>,
    IMiddlewaresAccessCtx<IPage>
>(editPageHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
