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
import { editQuestionSection } from '@/_server/domains/section/question/editQuestionSection'
import { createUpdateSchema } from 'drizzle-zod'
import { IQuestion, questionsTable } from '../../../../../db/schema'

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

async function editQuestionSectionHandler(
    _data: Partial<IQuestion>,
    ctx: IMiddlewaresAccessCtx<IQuestion>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IQuestion>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Partial<IQuestion>
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, () =>
        editQuestionSection(data)
    )

    return { status: 'success', data: result }
}

export default defineServerRequest<
    Partial<IQuestion>,
    IMiddlewaresAccessCtx<IQuestion>
>(editQuestionSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
