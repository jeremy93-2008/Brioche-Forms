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
import z from 'zod'

const schema = z.object({
    form_id: z.string(),
    respondent_id: z.string(),
    respondent_name: z.string(),
    is_partial_response: z.number(),
    answers: z.array(
        z.object({
            question_id: z.string(),
            question_type: z.string(),
            value: z.string().nullable(),
            choice_ids: z.array(z.string()).nullable(),
            choice_free_text: z.string().nullable(),
        })
    ),
})

export type IResponseWithAnswers = z.infer<typeof schema>

export type IResponseWithAnswersReturn = { id: string }

async function createResponseSectionHandler(
    _data: Partial<IResponseWithAnswers>,
    ctx: IMiddlewaresAccessCtx<IResponseWithAnswers>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IResponseWithAnswersReturn>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Required<IResponseWithAnswers>
    const formId = data.form_id

    return {
        status: 'success',
        data: { id: 'response-id-placeholder' },
    }
}

export default defineServerRequest<
    Partial<IResponseWithAnswers>,
    Partial<IResponseWithAnswersReturn>,
    IMiddlewaresAccessCtx<IResponseWithAnswers>
>(createResponseSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
