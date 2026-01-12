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
import { upsertChoicesSection } from '@/_server/domains/section/question/choices/upsertChoicesSection'
import { choicesTable } from '@db/tables'
import { IChoice } from '@db/types'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'

const singleSchema = createInsertSchema(choicesTable, {
    id: (schema) => schema.nullable(),
    content: (schema) => schema.min(3),
    order: (schema) => schema.nullable(),
    question_id: (schema) => schema.min(1),
    form_id: (schema) => schema.min(3),
})

const schema = z.object({
    form_id: z.string().min(3),
    data: z.array(singleSchema).min(0).max(30),
})

export type IChoiceInput = z.infer<typeof schema>
export type IChoiceReturn = { ids: string[] }

async function upsertChoicesSectionHandler(
    _data: IChoiceInput,
    ctx: IMiddlewaresAccessCtx<IChoiceInput>,
    env: ServerEnv
): Promise<IReturnAction<IChoiceReturn>> {
    const validatedFields = ctx.validatedFields
    const validatedData = validatedFields.data!
    const formId = validatedData.form_id!

    if (validatedData.data?.every((d) => d.form_id !== formId)) {
        throw new Error('All choices must belong to the same form.')
    }

    const result = await withFormBuildContext(env)(formId, async () =>
        upsertChoicesSection(validatedData.data as IChoice[])
    )

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    IChoiceInput,
    IChoiceReturn,
    IMiddlewaresAccessCtx<IChoiceInput>
>(upsertChoicesSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
