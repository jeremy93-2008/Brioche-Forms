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
import { createChoiceSection } from '@/_server/domains/section/question/choice/createChoiceSection'
import { createInsertSchema } from 'drizzle-zod'
import { choicesTable } from '@db/tables'
import { IChoice } from '@db/types'

const schema = createInsertSchema(choicesTable, {
    id: (schema) => schema.nullable(),
    content: (schema) => schema.min(3),
    order: (schema) => schema.nullable(),
    question_id: (schema) => schema.min(1),
    form_id: (schema) => schema.min(3),
})

async function createChoiceSectionHandler(
    _data: Partial<IChoice>,
    ctx: IMiddlewaresAccessCtx<IChoice>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IChoice>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Required<IChoice>
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, async () =>
        createChoiceSection(data)
    )

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<IChoice>,
    IMiddlewaresAccessCtx<IChoice>
>(createChoiceSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
