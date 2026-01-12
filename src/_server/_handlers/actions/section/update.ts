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
import { withFormBuildContext } from '@/_server/domains/_context/form/withFormBuildContext'
import { editSection } from '@/_server/domains/section/editSection'
import { createUpdateSchema } from 'drizzle-zod'
import { ISection, sectionsTable } from '../../../../../db/schema'

const schema = createUpdateSchema(sectionsTable, {
    id: (schema) => schema.min(3),
    title: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    conditions: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
}).partial()

async function editSectionHandler(
    _data: Partial<ISection>,
    ctx: IMiddlewaresAccessCtx<ISection>,
    env: ServerEnv
): Promise<IReturnAction<Partial<ISection>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Required<ISection>
    const formId = data.form_id!

    const result = await withFormBuildContext(env)(formId, () =>
        editSection(data)
    )

    return { status: 'success', data: result }
}

export default defineServerRequest<
    Partial<ISection>,
    IMiddlewaresAccessCtx<ISection>
>(editSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
