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
import { upsertChoicesSection } from '@/_server/domains/section/question/choices/upsertChoicesSection'
import { editQuestionSection } from '@/_server/domains/section/question/editQuestionSection'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import z from 'zod'
import {
    choicesTable,
    IChoice,
    IQuestion,
    questionsTable,
} from '../../../../../db/schema'

const schema = createUpdateSchema(questionsTable, {
    id: (schema) => schema.min(3),
    name: (schema) => schema.nullable(),
    type: (schema) => schema.nullable(),
    is_required: (schema) => schema.nullable(),
    content: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    section_id: (schema) => schema.nullable(),
    form_id: (schema) => schema.min(3),
}).partial()

const singleChoiceSchema = createInsertSchema(choicesTable, {
    id: (schema) => schema.min(3),
    content: (schema) => schema.min(0),
    order: (schema) => schema.nullable(),
    question_id: (schema) => schema.min(1),
    form_id: (schema) => schema.min(3),
})

const extendSchema = schema.extend({
    choices: z.array(singleChoiceSchema).min(0).max(30),
})

type IQuestionInput = z.infer<typeof extendSchema>

async function editQuestionSectionHandler(
    _data: Partial<IQuestionInput>,
    ctx: IMiddlewaresAccessCtx<IQuestionInput>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IQuestion>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Partial<IQuestionInput>
    const formId = data.form_id!

    const result = await withFormBuildContext(env)(formId, async () => {
        const { choices, ...questionData } = data
        const question = await editQuestionSection(
            questionData as Partial<IQuestion>
        )
        await upsertChoicesSection(choices as IChoice[])
        return question
    })

    return { status: 'success', data: result }
}

export default defineServerRequest<
    Partial<IQuestionInput>,
    Partial<IQuestion>,
    IMiddlewaresAccessCtx<IQuestionInput>
>(editQuestionSectionHandler, [
    requireAuth(),
    requireValidation(extendSchema),
    requireResourceAccess(['read', 'write']),
])
