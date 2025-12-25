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
import { editMedia } from '@/_server/domains/media/editMedia'
import { editImageSection } from '@/_server/domains/section/image/editImageSection'
import { createUpdateSchema } from 'drizzle-zod'
import z from 'zod'
import { IImage, imagesTable } from '../../../../../db/schema'

const schema = createUpdateSchema(imagesTable, {
    id: (schema) => schema.min(3),
    url: (schema) => schema.nullable(),
    caption: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    section_id: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
})
    .extend({
        media_id: z.string().min(3),
    })
    .partial()

export type IImageExtended = IImage & { media_id?: string }

async function editImageSectionHandler(
    _data: Partial<IImageExtended>,
    ctx: IMiddlewaresAccessCtx<IImageExtended>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IImageExtended>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Partial<IImageExtended>
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, async () => {
        const editResult = await editImageSection(data)
        if (!data.url) return editResult
        await editMedia({
            url: data.url,
            used_in_form_id: data.form_id,
        })
        return editResult
    })

    return { status: 'success', data: { id: result.id! } }
}

export default defineServerRequest<
    Partial<IImageExtended>,
    IMiddlewaresAccessCtx<IImageExtended>
>(editImageSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
