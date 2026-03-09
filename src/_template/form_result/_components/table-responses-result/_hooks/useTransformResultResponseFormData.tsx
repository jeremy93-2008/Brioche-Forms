import { IFullForm, IFullQuestion } from '@/_server/domains/form/getFullForms'
import { IResultResponse } from '@/_template/form_result/types'
import { IAnswerType } from '@db/types'

export function useTransformResultResponseFormData(
    data: IFullForm
): IResultResponse[] {
    const questions: IFullQuestion[] = data.pages
        .map((page) => page.sections.map((section) => section.questions[0]))
        .flat()
        .filter((question) => question != null)

    return data.responses.map((response) => {
        return {
            respondent_name: response.respondent_name,
            is_partial_response: response.is_partial_response,
            submitted_at: response.submitted_at,
            questions: questions.map((question) => {
                const answer = response.answers.find(
                    (ans) => ans.question_id === question.id
                )
                const choices = answer
                    ? [
                          (question.type as IAnswerType) === 'single_choice'
                              ? answer.choice
                              : null,
                          ...((question.type as IAnswerType) ===
                          'multiple_choice'
                              ? answer.multipleChoices.map((c) => c.choice)
                              : []),
                      ].filter((c) => c != null)
                    : []

                return {
                    name: question.name,
                    content: question.content,
                    type: question.type as IAnswerType,
                    answer: answer
                        ? (answer.short_answer ??
                          answer.long_answer ??
                          answer.date_answer ??
                          null)
                        : null,
                    choices: choices.map((choice) => {
                        return {
                            content: choice.content,
                            is_free_text: choice.is_free_text,
                            free_text_answer:
                                answer && choice.is_free_text
                                    ? answer.choice_free_text
                                    : null,
                        }
                    }),
                }
            }),
        }
    })
}
