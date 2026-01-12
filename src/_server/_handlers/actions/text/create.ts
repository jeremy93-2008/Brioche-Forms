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
import { withFormBuildContext } from '@/_server/domains/_context/form/withFormBuildContext'
import { createSection } from '@/_server/domains/section/createSection'
import { createTextSection } from '@/_server/domains/section/text/createTextSection'
import { textsTable } from '@db/tables'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'

const schema = createInsertSchema(textsTable, {
    id: (schema) => schema.nullable(),
    content: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    section_id: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
})

const extendSchema = schema
    .extend({
        title: z.string().nullable(),
        page_id: z.string().min(3),
    })
    .partial()

export type ITextWithPageId = z.infer<typeof extendSchema>

async function createTextSectionHandler(
    _data: Partial<ITextWithPageId>,
    ctx: IMiddlewaresAccessCtx<ITextWithPageId>,
    env: ServerEnv
): Promise<IReturnAction<Partial<ITextWithPageId>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Required<ITextWithPageId>
    const formId = data.form_id!

    const result = await withFormBuildContext(env)(formId, async () => {
        const new_section = await createSection({
            title: data.title ?? 'Texto',
            description: '',
            order: data.order ?? 'latest',
            conditions: '',
            page_id: data.page_id,
            form_id: data.form_id,
        })
        const new_text_section = await createTextSection({
            ...data,
            order: 'latest',
            section_id: new_section.id,
        })
        return { section_id: new_section.id, text_id: new_text_section.id }
    })

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<ITextWithPageId>,
    IMiddlewaresAccessCtx<ITextWithPageId>
>(createTextSectionHandler, [
    requireAuth(),
    requireValidation(extendSchema),
    requireResourceAccess(['read', 'write']),
])
