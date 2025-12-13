'use server'

import {
    defineServerRequest,
    IMiddlewaresAccessCtx,
    ServerEnv,
} from '@/_server/__internals/defineServerRequest'
import type { IReturnAction } from '@/_server/_handlers/actions/types'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireResourceAccess } from '@/_server/_middlewares/requireResourceAccess'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { withFormContext } from '@/_server/domains/_context/form/withFormContext'
import { createPage } from '@/_server/domains/page/createPage'
import { createInsertSchema } from 'drizzle-zod'
import { IPage, pagesTable } from '../../../../../db/schema'

const schema = createInsertSchema(pagesTable, {
    id: (schema) => schema.nullable(),
    title: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    conditions: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
}).partial()

async function createPageHandler(
    _data: Partial<IPage>,
    ctx: IMiddlewaresAccessCtx<IPage>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IPage>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data!
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, () => createPage(data))

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<IPage>,
    IMiddlewaresAccessCtx<IPage>
>(createPageHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
