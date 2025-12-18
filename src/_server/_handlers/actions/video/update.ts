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
import { editVideoSection } from '@/_server/domains/section/video/editVideoSection'
import { createUpdateSchema } from 'drizzle-zod'
import { IText, videosTable } from '../../../../../db/schema'

const schema = createUpdateSchema(videosTable, {
    id: (schema) => schema.min(3),
    url: (schema) => schema.nullable(),
    caption: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    section_id: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
}).partial()

async function editVideoSectionHandler(
    _data: Partial<IText>,
    ctx: IMiddlewaresAccessCtx<IText>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IText>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Partial<IText>
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, () =>
        editVideoSection(data)
    )

    return { status: 'success', data: result }
}

export default defineServerRequest<
    Partial<IText>,
    IMiddlewaresAccessCtx<IText>
>(editVideoSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
