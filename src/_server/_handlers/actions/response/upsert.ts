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
import { withTransactionContext } from '@/_server/domains/_context/withTransactionContext'
import { upsertMultiChoicesAnswer } from '@/_server/domains/response/answers/multichoicea/upsertMultiChoicesAnswer'
import { upsertAnswersResponse } from '@/_server/domains/response/answers/upsertAnswersResponse'
import { createResponse } from '@/_server/domains/response/createResponse'
import { editResponse } from '@/_server/domains/response/editResponse'
import { IMultipleChoice } from '@db/types'
import z from 'zod'

const schema = z.object({
    id: z.string().nullable(),
    form_id: z.string(),
    respondent_id: z.string(),
    respondent_name: z.string(),
    is_partial_response: z.number(),
    answers: z.array(
        z.object({
            id: z.string().nullable(),
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

async function upsertResponseSectionHandler(
    _data: IResponseWithAnswers,
    ctx: IMiddlewaresAccessCtx<IResponseWithAnswers>,
    env: ServerEnv
): Promise<IReturnAction<IResponseWithAnswersReturn>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Required<IResponseWithAnswers>
    const formId = data.form_id

    const result = await withTransactionContext()(async () => {
        const response = data.id
            ? await editResponse({
                  id: data.id,
                  respondent_id: data.respondent_id,
                  respondent_name: data.respondent_name,
                  form_id: formId,
                  is_partial_response: data.is_partial_response,
              })
            : await createResponse({
                  respondent_id: data.respondent_id,
                  respondent_name: data.respondent_name,
                  form_id: formId,
                  is_partial_response: data.is_partial_response,
              })

        const resultAnswers = await upsertAnswersResponse(
            data.answers.map((ans, idx) => ({
                id: ans.id ?? 'temp-' + idx,
                form_id: formId,
                response_id: response.id,
                question_id: ans.question_id,
                type: ans.question_type,
                choice_id:
                    ans.question_type === 'single_choice' && ans.choice_ids
                        ? ans.choice_ids[0]
                        : null,
                choice_free_text:
                    ans.question_type === 'single_choice' ||
                    ans.question_type === 'multiple_choice'
                        ? ans.choice_free_text
                        : null,
                short_answer:
                    ans.question_type === 'short_answer' ? ans.value : null,
                long_answer:
                    ans.question_type === 'long_answer' ? ans.value : null,
                date_answer:
                    ans.question_type === 'short_answer:date'
                        ? Number(ans.value)
                        : null,
            }))
        )

        await upsertMultiChoicesAnswer(
            data.answers
                .map((ans, idx) => {
                    return ans.choice_ids
                        ? ans.choice_ids.map(
                              (choice_id): IMultipleChoice => ({
                                  id: 'temp-ch' + idx + '-' + choice_id,
                                  answer_id: resultAnswers.ids[idx],
                                  choice_id,
                                  form_id: formId,
                              })
                          )
                        : []
                })
                .flat()
        )
        return response
    })

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    IResponseWithAnswers,
    IResponseWithAnswersReturn,
    IMiddlewaresAccessCtx<IResponseWithAnswers>
>(upsertResponseSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
