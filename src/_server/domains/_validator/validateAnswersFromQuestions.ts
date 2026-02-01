import { IResponseWithAnswers } from '@/_server/_handlers/actions/response/scheme'
import { GetQuestionsByFormId } from '@/_server/domains/question/getQuestionsByFormId'

export function validateAnswersFromQuestions(formId: string) {
    return async (answers: IResponseWithAnswers['answers']) => {
        const questions = await GetQuestionsByFormId(formId)

        const isEveryRequiredQuestionsAnswered = questions
            .filter((q) => q.is_required)
            .every((q) => !!answers.find((a) => a.question_id === q.id))

        const isEveryShortAnswersCorrect = answers.every((a) => {
            if (a.question_type === 'short_answer:rating') {
                const num = Number(a.value)
                return Number.isInteger(num) && num >= 0 && num <= 5
            } else if (a.question_type === 'short_answer:opinion_scale') {
                const num = Number(a.value)
                return Number.isInteger(num) && num >= 0 && num <= 10
            } else if (a.question_type === 'short_answer:email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                return emailRegex.test(a.value || '')
            } else if (a.question_type === 'short_answer:phone') {
                const phoneRegex = /^\+?[1-9]\d{1,14}$/
                return phoneRegex.test(a.value || '')
            }
        })

        return isEveryRequiredQuestionsAnswered && isEveryShortAnswersCorrect
    }
}
