import { RadioGroup } from '@/_components/ui/radio-group'
import { IQuestionTypeValues } from '@/_constants/question'
import { FormQuestionChoiceSingleEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/_components/form-question-choices-edit/form-question-choice-single-edit/componente'
import { IFullChoices } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/_components/form-question-choices-edit/types'
import { createTempId } from '@/_utils/temp-id'
import { IChoice } from '@db/types'
import { Fragment } from 'react'

interface IFormQuestionChoicesEditComponentProps {
    data: IFullChoices
    onDataChange: (data: IFullChoices) => void
    questionId: string
    formId: string
    type: IQuestionTypeValues
}

export function FormQuestionChoicesEditComponent(
    props: IFormQuestionChoicesEditComponentProps
) {
    const { data, onDataChange, questionId, formId, type } = props

    const onChoiceChange = (
        action: 'upsert' | 'delete',
        params: Partial<IChoice>
    ) => {
        if (action === 'delete') {
            return onDataChange(data.filter((item) => item.id !== params.id))
        }

        if (params.id === 'new') {
            // Create new choice
            const newChoice: IFullChoices[number] = {
                id: createTempId(),
                content: params.content || '',
                question_id: questionId,
                form_id: formId,
                order: 'latest',
                is_free_text: params.is_free_text || 0,
                multipleChoices: [],
            }
            onDataChange([...data, newChoice])
        } else {
            // Update existing choice
            onDataChange(
                data.map((item) =>
                    item.id === params.id ? { ...item, ...params } : item
                )
            )
        }
    }

    const QuestionWrapper = type === 'single_choice' ? RadioGroup : Fragment

    const isFreeTextAvailable = data.every((item) => item.is_free_text === 0)

    return (
        <section>
            <QuestionWrapper>
                {data.map((item) => (
                    <FormQuestionChoiceSingleEditComponent
                        key={item.id}
                        item={item}
                        type={type}
                        isFreeTextAvailable={isFreeTextAvailable}
                        onChange={onChoiceChange}
                    />
                ))}
                {/* New Question Choice - outside sortable context */}
                <FormQuestionChoiceSingleEditComponent
                    item={{
                        id: 'new',
                        content: '',
                        question_id: questionId,
                        form_id: formId,
                        order: 'latest',
                        is_free_text: 0,
                        multipleChoices: [],
                    }}
                    type={type}
                    isFreeTextAvailable={isFreeTextAvailable}
                    onChange={onChoiceChange}
                />
            </QuestionWrapper>
        </section>
    )
}
