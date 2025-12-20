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
import { createQuestionSection } from '@/_server/domains/section/question/createQuestionSection'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'
import { questionsTable } from '../../../../../db/schema'

const schema = createInsertSchema(questionsTable, {
    id: (schema) => schema.nullable(),
    name: (schema) => schema.min(3),
    type: (schema) => schema.min(3),
    is_required: (schema) => schema.nullable(),
    content: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    section_id: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
})

const extendSchema = schema
    .extend({
        page_id: z.string().min(3),
    })
    .partial()

export type IQuestionWithPageId = z.infer<typeof extendSchema>

async function createQuestionSectionHandler(
    _data: Partial<IQuestionWithPageId>,
    ctx: IMiddlewaresAccessCtx<IQuestionWithPageId>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IQuestionWithPageId>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Required<IQuestionWithPageId>
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, async () => {
        const new_section = await createSection({
            title: 'Pregunta',
            description: '',
            order: 'latest',
            conditions: '',
            page_id: data.page_id,
            form_id: data.form_id,
        })
        const question_section = await createQuestionSection({
            ...data,
            section_id: new_section.id,
        })

        return { section_id: new_section.id, question_id: question_section.id }
    })

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<IQuestionWithPageId>,
    IMiddlewaresAccessCtx<IQuestionWithPageId>
>(createQuestionSectionHandler, [
    requireAuth(),
    requireValidation(extendSchema),
    requireResourceAccess(['read', 'write']),
])
