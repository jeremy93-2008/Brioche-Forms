import { IResponseWithAnswers } from '@/_server/_handlers/actions/response/scheme'
import { IInvalidAnswers } from '@/_server/domains/_validator/validateAnswersFromQuestions'
import { useFormState } from 'react-hook-form'

export function useQuestionAnswerError() {
    const { errors } = useFormState<IResponseWithAnswers>()

    const invalidAnswersArray: IInvalidAnswers[] = JSON.parse(
        errors.answers?.root?.message ?? '[]'
    )

    const invalidAnswers = invalidAnswersArray.reduce(
        (obj, invalid) => {
            const { question_id, ...rest } = invalid
            obj[question_id] = { ...rest }
            return obj
        },
        {} as Record<string, Omit<IInvalidAnswers, 'question_id'>>
    )

    return {
        invalidAnswers: invalidAnswers,
    }
}
