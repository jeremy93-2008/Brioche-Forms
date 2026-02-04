import {
    IResponseWithAnswers,
    responseWithAnswersScheme,
} from '@/_server/_handlers/actions/response/scheme'
import { validateAnswersFromQuestions } from '@/_server/domains/_validator/validateAnswersFromQuestions'
import { IQuestion } from '@db/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Resolver } from 'react-hook-form'

export function useQuestionnaireResolver(
    questions: IQuestion[] = []
): Resolver<IResponseWithAnswers> {
    return (data: IResponseWithAnswers, schemaOptions, resolverOptions) => {
        const validateAnswers = validateAnswersFromQuestions(questions)

        const validAnswers = validateAnswers(data.answers)

        if (!validAnswers.isValid) {
            return {
                values: {},
                errors: {
                    answers: {
                        type: 'manual',
                        message: 'There are invalid answers in the response',
                        root: {
                            type: 'manual',
                            message: JSON.stringify(
                                validAnswers.invalidAnswers
                            ),
                        },
                    },
                },
            }
        }

        return zodResolver(responseWithAnswersScheme)(
            data,
            schemaOptions,
            resolverOptions
        )
    }
}
