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
import { createImageSection } from '@/_server/domains/section/image/createImageSection'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'
import { imagesTable } from '../../../../../db/schema'

const schema = createInsertSchema(imagesTable, {
    id: (schema) => schema.min(3),
    url: (schema) => schema.min(3),
    caption: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    section_id: (schema) => schema.min(3),
    form_id: (schema) => schema.min(3),
})

const extendSchema = schema.extend({
    page_id: z.string().min(3),
})

export type IImageWithPageId = z.infer<typeof extendSchema>

async function createImageSectionHandler(
    _data: Partial<IImageWithPageId>,
    ctx: IMiddlewaresAccessCtx<IImageWithPageId>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IImageWithPageId>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Required<IImageWithPageId>
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, async () => {
        const new_section = await createSection({
            title: 'Sección de Imagen',
            description: '',
            order: '0',
            conditions: '',
            page_id: data.page_id,
            form_id: data.form_id,
        })
        return await createImageSection({ ...data, section_id: new_section.id })
    })

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<IImageWithPageId>,
    IMiddlewaresAccessCtx<IImageWithPageId>
>(createImageSectionHandler, [
    requireAuth(),
    requireValidation(extendSchema),
    requireResourceAccess(['read', 'write']),
])
