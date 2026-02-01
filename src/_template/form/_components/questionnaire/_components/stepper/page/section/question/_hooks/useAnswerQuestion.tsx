import { IResponseWithAnswers } from '@/_server/_handlers/actions/response/scheme'
import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'

interface IUseAnswerQuestionProps {
    questionId: string
}

export function useAnswerQuestion(props: IUseAnswerQuestionProps) {
    const watchedAnswers = useWatch<IResponseWithAnswers>({
        name: 'answers',
    }) as IResponseWithAnswers['answers']

    const currentQuestionAnswer = useMemo(
        () =>
            watchedAnswers?.find(
                (answer) => answer.question_id === props.questionId
            ),
        [props.questionId, watchedAnswers]
    )

    const currentSingleChoiceAnswer = useMemo(
        () =>
            currentQuestionAnswer?.question_type === 'single_choice'
                ? currentQuestionAnswer?.choice_ids?.[0]
                : '',
        [currentQuestionAnswer]
    )

    const currentMultipleChoiceAnswers = useMemo(
        () =>
            currentQuestionAnswer?.question_type === 'multiple_choice'
                ? currentQuestionAnswer?.choice_ids || []
                : [],
        [currentQuestionAnswer]
    )

    return {
        answers: watchedAnswers,
        currentQuestionAnswer,
        currentSingleChoiceAnswer,
        currentMultipleChoiceAnswers,
    }
}
