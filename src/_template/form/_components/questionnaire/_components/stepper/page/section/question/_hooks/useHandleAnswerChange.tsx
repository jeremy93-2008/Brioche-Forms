import { IResponseWithAnswers } from '@/_server/_handlers/actions/response/scheme'
import { ChangeEvent } from 'react'
import { FieldPathValue, useFormContext } from 'react-hook-form'
import { v7 } from 'uuid'

interface IUseHandleAnswerChangeProps {
    answers: IResponseWithAnswers['answers']
    currentQuestionAnswer: IResponseWithAnswers['answers'][number] | undefined
    questionId: string
    questionType: string
}

export function useHandleAnswerChange(props: IUseHandleAnswerChangeProps) {
    const { answers, currentQuestionAnswer, questionId, questionType } = props

    const { setValue: setFormValue } = useFormContext<IResponseWithAnswers>()

    const setValue = <T extends keyof IResponseWithAnswers>(
        name: T,
        value: FieldPathValue<IResponseWithAnswers, T>
    ) => {
        setFormValue(name, value, { shouldDirty: true, shouldValidate: true })
    }

    const setAnswerById = (
        id: string | null | undefined = undefined,
        type: 'value' | 'choice_ids' | 'choice_free_text',
        value: string | string[]
    ) => {
        const currentAnswers = answers || []
        const currentAnswersWithoutCurrent = currentAnswers.filter(
            (answer) => answer.id !== id
        )
        const newAnswer: IResponseWithAnswers['answers'][number] = {
            id: id ?? v7(),
            question_id: questionId,
            question_type: questionType,
            value: type === 'value' ? (value as string) : null,
            choice_ids: type === 'choice_ids' ? (value as string[]) : null,
            choice_free_text:
                type === 'choice_free_text' ? (value as string) : null,
        }
        setValue('answers', [...currentAnswersWithoutCurrent, newAnswer])
    }

    const removeAnswerById = (id: string | null | undefined = undefined) => {
        const currentAnswers = answers || []
        const currentAnswersWithoutCurrent = currentAnswers.filter(
            (answer) => answer.id !== id
        )
        setValue('answers', [...currentAnswersWithoutCurrent])
    }

    const handleAnswerValueChange = (
        evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (evt.target.value === '')
            return removeAnswerById(currentQuestionAnswer?.id)
        setAnswerById(currentQuestionAnswer?.id, 'value', evt.target.value)
    }

    const handleOpinionScaleChange = (newVal: number) => () => {
        if (newVal > 10) {
            setAnswerById(currentQuestionAnswer?.id, 'value', '10')
            return
        } else if (newVal < 0) {
            setAnswerById(currentQuestionAnswer?.id, 'value', '0')
            return
        }
        setAnswerById(currentQuestionAnswer?.id, 'value', newVal.toString())
    }

    const handleRatingChange = (newVal: number) => () => {
        if (newVal > 5) {
            setAnswerById(currentQuestionAnswer?.id, 'value', '5')
            return
        } else if (newVal < 0) {
            setAnswerById(currentQuestionAnswer?.id, 'value', '0')
            return
        }
        setAnswerById(currentQuestionAnswer?.id, 'value', newVal.toString())
    }

    const handleSingleChoiceChange = (choiceId: string) => {
        setAnswerById(currentQuestionAnswer?.id, 'choice_ids', [choiceId])
    }

    const handleMultipleChoiceChange =
        (choiceId: string) => (checked: boolean) => {
            let newChoiceIds = currentQuestionAnswer?.choice_ids || []
            if (checked) {
                newChoiceIds = [...newChoiceIds, choiceId]
            } else {
                newChoiceIds = newChoiceIds.filter((id) => id !== choiceId)
            }
            if (newChoiceIds.length === 0)
                return removeAnswerById(currentQuestionAnswer?.id)
            setAnswerById(currentQuestionAnswer?.id, 'choice_ids', newChoiceIds)
        }

    const handleFreeTextChoiceChange =
        () => (evt: ChangeEvent<HTMLInputElement>) => {
            if (evt.target.value === '')
                return removeAnswerById(currentQuestionAnswer?.id)

            setAnswerById(
                currentQuestionAnswer?.id,
                'choice_free_text',
                evt.target.value
            )
        }

    return {
        handleAnswerValueChange,
        handleOpinionScaleChange,
        handleRatingChange,
        handleSingleChoiceChange,
        handleMultipleChoiceChange,
        handleFreeTextChoiceChange,
    }
}
