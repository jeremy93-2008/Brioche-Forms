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
import { createVideoSection } from '@/_server/domains/section/video/createVideoSection'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'
import { videosTable } from '../../../../../db/schema'

const schema = createInsertSchema(videosTable, {
    id: (schema) => schema.min(3),
    url: (schema) => schema.min(3),
    caption: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    section_id: (schema) => schema.min(3),
    form_id: (schema) => schema.min(3),
})

const extendSchema = schema
    .extend({
        title: z.string().nullable(),
        page_id: z.string().min(3),
    })
    .partial()

export type IVideoWithPageId = z.infer<typeof extendSchema>

async function createVideoSectionHandler(
    _data: Partial<IVideoWithPageId>,
    ctx: IMiddlewaresAccessCtx<IVideoWithPageId>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IVideoWithPageId>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Required<IVideoWithPageId>
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, async () => {
        const new_section = await createSection({
            title: data.title ?? 'Video',
            description: '',
            order: 'latest',
            conditions: '',
            page_id: data.page_id,
            form_id: data.form_id,
        })
        const video_section = await createVideoSection({
            ...data,
            section_id: new_section.id,
        })

        return { section_id: new_section.id, video_id: video_section.id }
    })

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<IVideoWithPageId>,
    IMiddlewaresAccessCtx<IVideoWithPageId>
>(createVideoSectionHandler, [
    requireAuth(),
    requireValidation(extendSchema),
    requireResourceAccess(['read', 'write']),
])
