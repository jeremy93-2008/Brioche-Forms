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
import { createSection } from '@/_server/domains/section/createSection'
import { createInsertSchema } from 'drizzle-zod'
import { ISection, sectionsTable } from '../../../../../db/schema'

const schema = createInsertSchema(sectionsTable, {
    id: (schema) => schema.min(3),
    title: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    conditions: (schema) => schema.nullable(),
    description: (schema) => schema.nullable(),
    page_id: (schema) => schema.min(3),
    form_id: (schema) => schema.min(3),
})

async function createSectionHandler(
    _data: Partial<ISection>,
    ctx: IMiddlewaresAccessCtx<ISection>,
    env: ServerEnv
): Promise<IReturnAction<Partial<ISection>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Required<ISection>
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, () => createSection(data))

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<ISection>,
    IMiddlewaresAccessCtx<ISection>
>(createSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
