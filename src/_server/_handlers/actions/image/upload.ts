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
import { editImageSection } from '@/_server/domains/section/image/editImageSection'
import { createUpdateSchema } from 'drizzle-zod'
import { IImage, imagesTable } from '../../../../../db/schema'

const schema = createUpdateSchema(imagesTable, {
    id: (schema) => schema.min(3),
    url: (schema) => schema.nullable(),
    caption: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    section_id: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
}).partial()

async function uploadImageSectionHandler(
    _data: Partial<IImage>,
    ctx: IMiddlewaresAccessCtx<IImage>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IImage>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Partial<IImage>
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, () =>
        editImageSection(data)
    )

    return { status: 'success', data: result }
}

export default defineServerRequest<
    Partial<IImage>,
    IMiddlewaresAccessCtx<IImage>
>(editImageSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
