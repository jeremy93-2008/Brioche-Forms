import { DndProvider } from '@/_components/dnd/dnd-provider'
import { RadioGroup } from '@/_components/ui/radio-group'
import { IQuestionTypeValues } from '@/_constants/question'
import { FormQuestionChoiceSingleEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/_components/form-question-choices-edit/form-question-choice-single-edit/componente'
import { SortableChoiceItem } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/_components/form-question-choices-edit/_components/sortable-choice-item'
import { IFullChoices } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/_components/form-question-choices-edit/types'
import { calculateNewOrders, normalizeOrders } from '@/_utils/fractional-indexing'
import { createTempId } from '@/_utils/temp-id'
import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { IChoice } from '@db/types'
import { Fragment, useMemo } from 'react'

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

    // Normalize and sort choices by order (handles 'latest' values)
    const sortedChoices = useMemo(() => {
        const normalized = normalizeOrders(data)
        return normalized.sort((a, b) => a.order.localeCompare(b.order))
    }, [data])

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

    // Handle drag end - reorder choices using fractional indexing
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const activeId = active.id as string
        const overId = over.id as string

        const oldIndex = sortedChoices.findIndex((c) => c.id === activeId)
        const newIndex = sortedChoices.findIndex((c) => c.id === overId)

        if (oldIndex === -1 || newIndex === -1) return

        // Calculate new order using fractional indexing
        const newOrders = calculateNewOrders(sortedChoices, activeId, overId)

        // Reorder array and apply new order values
        const reordered = arrayMove([...sortedChoices], oldIndex, newIndex).map(
            (item) => {
                const orderUpdate = newOrders.find((o) => o.id === item.id)
                return orderUpdate ? { ...item, order: orderUpdate.order } : item
            }
        )

        onDataChange(reordered)
    }

    const QuestionWrapper = type === 'single_choice' ? RadioGroup : Fragment

    const isFreeTextAvailable = data.every((item) => item.is_free_text === 0)

    return (
        <section>
            <DndProvider onDragEnd={handleDragEnd}>
                <SortableContext
                    items={sortedChoices.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <QuestionWrapper>
                        {sortedChoices.map((item) => (
                            <SortableChoiceItem
                                key={item.id}
                                item={item}
                                type={type}
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
                </SortableContext>
            </DndProvider>
        </section>
    )
}
