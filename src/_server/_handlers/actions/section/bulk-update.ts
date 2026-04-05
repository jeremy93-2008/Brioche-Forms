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
import {
    bulkEditSections,
    IBulkEditInput,
} from '@/_server/domains/section/bulkEditSections'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import z from 'zod'
import {
    choicesTable,
    imagesTable,
    questionsTable,
    textsTable,
    videosTable,
} from '../../../../../db/schema'

const textSchema = createUpdateSchema(textsTable, {
    id: (schema) => schema.min(3),
    content: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    section_id: (schema) => schema.nullable(),
    form_id: (schema) => schema.nullable(),
}).partial()

const imageSchema = createUpdateSchema(imagesTable, {
    id: (schema) => schema.min(3),
    url: (schema) => schema.nullable(),
    caption: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    section_id: (schema) => schema.nullable(),
    form_id: (schema) => schema.nullable(),
})
    .extend({
        media_id: z.string().min(3).optional(),
    })
    .partial()

const videoSchema = createUpdateSchema(videosTable, {
    id: (schema) => schema.min(3),
    url: (schema) => schema.nullable(),
    caption: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    section_id: (schema) => schema.nullable(),
    form_id: (schema) => schema.nullable(),
}).partial()

const questionSchema = createUpdateSchema(questionsTable, {
    id: (schema) => schema.min(3),
    name: (schema) => schema.nullable(),
    type: (schema) => schema.nullable(),
    is_required: (schema) => schema.nullable(),
    content: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    section_id: (schema) => schema.nullable(),
    form_id: (schema) => schema.nullable(),
}).partial()

const choiceSchema = createInsertSchema(choicesTable, {
    id: (schema) => schema.min(3),
    content: (schema) => schema.min(0),
    order: (schema) => schema.nullable(),
    question_id: (schema) => schema.min(1),
    form_id: (schema) => schema.min(3),
})

const bulkSchema = z.object({
    form_id: z.string().min(3),
    texts: z.array(textSchema).optional(),
    images: z.array(imageSchema).optional(),
    videos: z.array(videoSchema).optional(),
    questions: z
        .array(
            z.object({
                question: questionSchema,
                choices: z.array(choiceSchema).min(0).max(30).optional(),
            })
        )
        .optional(),
})

type IBulkInput = z.infer<typeof bulkSchema>

async function bulkUpdateHandler(
    _data: IBulkInput,
    ctx: IMiddlewaresAccessCtx<IBulkInput>,
    env: ServerEnv
): Promise<IReturnAction<{ updated: boolean }>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as IBulkEditInput
    const formId = data.form_id

    await withFormBuildContext(env)(formId, () => bulkEditSections(data))

    return { status: 'success', data: { updated: true } }
}

export default defineServerRequest<
    IBulkInput,
    { updated: boolean },
    IMiddlewaresAccessCtx<IBulkInput>
>(bulkUpdateHandler, [
    requireAuth(),
    requireValidation(bulkSchema),
    requireResourceAccess(['read', 'write']),
])
