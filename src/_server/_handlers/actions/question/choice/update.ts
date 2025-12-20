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
import { editChoiceSection } from '@/_server/domains/section/question/choice/editChoiceSection'
import { createUpdateSchema } from 'drizzle-zod'
import { choicesTable } from '@db/tables'
import { IChoice } from '@db/types'

const schema = createUpdateSchema(choicesTable, {
    id: (schema) => schema.min(3),
    content: (schema) => schema.nullable(),
    order: (schema) => schema.nullable(),
    question_id: (schema) => schema.min(1),
    form_id: (schema) => schema.min(3),
}).partial()

async function editQuestionSectionHandler(
    _data: Partial<IChoice>,
    ctx: IMiddlewaresAccessCtx<IChoice>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IChoice>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Partial<IChoice>
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, () =>
        editChoiceSection(data)
    )

    return { status: 'success', data: result }
}

export default defineServerRequest<
    Partial<IChoice>,
    IMiddlewaresAccessCtx<IChoice>
>(editQuestionSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
