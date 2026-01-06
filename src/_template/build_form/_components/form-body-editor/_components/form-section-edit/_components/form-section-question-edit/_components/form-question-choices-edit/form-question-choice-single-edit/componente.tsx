import { DragHandler } from '@/_components/dnd/dragHandle'
import { Button } from '@/_components/ui/button'
import { Checkbox } from '@/_components/ui/checkbox'
import { Input } from '@/_components/ui/input'
import { Label } from '@/_components/ui/label'
import { RadioGroupItem } from '@/_components/ui/radio-group'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/_components/ui/tooltip'
import { IQuestionTypeValues } from '@/_constants/question'
import { ChoiceWrapper } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/_components/form-question-choices-edit/form-question-choice-single-edit/ChoicesWrapper'
import { IFullChoices } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/_components/form-question-choices-edit/types'
import { IChoice } from '@db/types'
import { TrashIcon } from 'lucide-react'
import { useState } from 'react'

interface IFormQuestionChoiceSingleEditComponentProps {
    item: IFullChoices[number]
    onChange: (action: 'upsert' | 'delete', data: Partial<IChoice>) => void
    isFreeTextAvailable: boolean
    type: IQuestionTypeValues
}

export function FormQuestionChoiceSingleEditComponent(
    props: IFormQuestionChoiceSingleEditComponentProps
) {
    const { item, onChange, isFreeTextAvailable, type } = props

    const [value, setValue] = useState(item.content)

    const onChoiceChange = (
        action: 'upsert' | 'delete',
        params: Partial<IChoice>
    ) => {
        onChange(action, params)
        if (item.id === 'new') setValue('')
    }

    const onValueChange = () => {
        if (!value && item.id === 'new') return
        onChoiceChange('upsert', { ...item, content: value })
    }

    return (
        <ChoiceWrapper id={item.id} isDraggable={item.id !== 'new'}>
            {item.id !== 'new' && (
                <DragHandler
                    className="flex-0 p-2 pr-0"
                    iconClassName="!w-4 !h-4 stroke-secondary"
                />
            )}
            {type === 'single_choice' && (
                <RadioGroupItem
                    className="min-w-6 h-6 flex-0"
                    disabled
                    value={item.id}
                />
            )}
            {type === 'multiple_choice' && (
                <Checkbox
                    className="min-w-6 h-6 flex-0"
                    disabled
                    checked={false}
                />
            )}
            {item.is_free_text === 0 && (
                <>
                    <Input
                        className="flex-1"
                        placeholder="Añadir Opción..."
                        value={value}
                        onChange={(evt) => setValue(evt.target.value)}
                        onKeyUp={(evt) =>
                            evt.key === 'Enter' && onValueChange()
                        }
                        onBlur={() => onValueChange()}
                    />
                    {item.id === 'new' && isFreeTextAvailable && (
                        <Label className="inline-flex flex-0 items-center ml-2">
                            <Button
                                onClick={() =>
                                    onChoiceChange('upsert', {
                                        ...item,
                                        is_free_text: 1,
                                    })
                                }
                                variant="link"
                                size="sm"
                            >
                                Añadir opción de respuesta libre
                            </Button>
                        </Label>
                    )}
                </>
            )}
            {item.is_free_text === 1 && (
                <>
                    <Label className="inline-flex flex-0 items-center">
                        <span className="ml-2">Otro:</span>
                    </Label>
                    <Input
                        className="flex-1"
                        placeholder="Otra Respuesta (texto libre)"
                        disabled
                    />
                </>
            )}
            {item.id !== 'new' && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={() =>
                                onChoiceChange('delete', { id: item.id })
                            }
                            variant="destructive"
                            className="flex justify-center flex-0"
                        >
                            <TrashIcon size={16} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Eliminar opción de respuesta
                    </TooltipContent>
                </Tooltip>
            )}
        </ChoiceWrapper>
    )
}
