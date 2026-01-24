import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { IResponseWithAnswers } from '@/_server/_handlers/actions/response/upsert'
import { ICurrentRespondent } from '@/_template/form/_components/questionnaire/_hooks/useGetCurrentRespondent'
import { use } from 'react'

export function useFormResponseValueByUser(
    user?: ICurrentRespondent | null
): IResponseWithAnswers | null {
    const { data } = use(SingleFormSelectedContext)!

    if (!user) return null

    const currentResponseByUser = data.responses.find(
        (response) => response.respondent_id === user.id
    )

    if (!currentResponseByUser)
        return {
            id: null,
            respondent_id: user.id,
            respondent_name: user.name,
            is_partial_response: data.savePartialResponses,
            form_id: data.id,
            answers: [],
        }

    return {
        id: currentResponseByUser.id,
        respondent_id: currentResponseByUser.respondent_id,
        respondent_name: currentResponseByUser.respondent_name,
        is_partial_response: currentResponseByUser.is_partial_response,
        form_id: currentResponseByUser.form_id,
        answers: currentResponseByUser.answers.map((answer) => {
            return {
                id: answer.id,
                question_id: answer.question_id,
                question_type: answer.type,
                choice_ids: [
                    answer.choice_id,
                    ...answer.multipleChoices.map((mc) => mc.choice_id),
                ].filter((c) => c != null),
                choice_free_text: answer.choice_free_text || null,
                value:
                    answer.long_answer ||
                    answer.short_answer ||
                    (answer.date_answer ? String(answer.date_answer) : '') ||
                    '',
            }
        }),
    }
}
