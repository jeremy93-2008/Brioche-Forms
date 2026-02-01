import z from 'zod'

export const responseWithAnswersScheme = z.object({
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
export type IResponseWithAnswers = z.infer<typeof responseWithAnswersScheme>
export type IResponseWithAnswersReturn = { id: string }
