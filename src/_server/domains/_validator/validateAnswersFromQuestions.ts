import { IResponseWithAnswers } from '@/_server/_handlers/actions/response/scheme'
import { IQuestion } from '@db/types'

export interface IInvalidAnswers {
    question_id: string
    message: string
}

export function validateAnswersFromQuestions(questions: IQuestion[]) {
    return (answers: IResponseWithAnswers['answers']) => {
        const invalidAnswers = [] as IInvalidAnswers[]

        const isEveryRequiredQuestionsAnswered = questions
            .filter((q) => q.is_required)
            .every((q) => {
                const hasAnswer = !!answers.find((a) => a.question_id === q.id)
                if (!hasAnswer)
                    invalidAnswers.push({
                        question_id: q.id,
                        message: 'Required question not answered',
                    })
                return hasAnswer
            })

        const isEveryShortAnswersCorrect = answers.every((a) => {
            if (a.question_type === 'short_answer:rating') {
                const num = Number(a.value)
                const isValid = Number.isInteger(num) && num >= 0 && num <= 5
                if (!isValid)
                    invalidAnswers.push({
                        question_id: a.question_id,
                        message: 'Invalid rating value',
                    })
                return isValid
            } else if (a.question_type === 'short_answer:opinion_scale') {
                const num = Number(a.value)
                const isValid = Number.isInteger(num) && num >= 0 && num <= 10
                if (!isValid)
                    invalidAnswers.push({
                        question_id: a.question_id,
                        message: 'Invalid opinion scale value',
                    })
                return isValid
            } else if (a.question_type === 'short_answer:email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                const isValid = emailRegex.test(a.value || '')
                if (!isValid)
                    invalidAnswers.push({
                        question_id: a.question_id,
                        message: 'Invalid email format',
                    })
                return isValid
            } else if (a.question_type === 'short_answer:phone') {
                const phoneRegex = /^\+?[1-9]\d{1,14}$/
                const isValid = phoneRegex.test(a.value || '')
                if (!isValid)
                    invalidAnswers.push({
                        question_id: a.question_id,
                        message: 'Invalid phone number format',
                    })
                return isValid
            }
            return true
        })

        return {
            isValid:
                isEveryRequiredQuestionsAnswered && isEveryShortAnswersCorrect,
            invalidAnswers: structuredClone(invalidAnswers),
        }
    }
}
