'use client'

import { DragHandle } from '@/_components/dnd/drag-handle'
import { SortableItem } from '@/_components/dnd/sortable-item'
import { Button } from '@/_components/ui/button'
import { Checkbox } from '@/_components/ui/checkbox'
import { Field } from '@/_components/ui/field'
import { Input } from '@/_components/ui/input'
import { Label } from '@/_components/ui/label'
import { RadioGroupItem } from '@/_components/ui/radio-group'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/_components/ui/tooltip'
import { IQuestionTypeValues } from '@/_constants/question'
import { IFullChoices } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/_components/form-question-choices-edit/types'
import { IChoice } from '@db/types'
import { TrashIcon } from 'lucide-react'
import { useState } from 'react'

interface ISortableChoiceItemProps {
    item: IFullChoices[number]
    onChange: (action: 'upsert' | 'delete', data: Partial<IChoice>) => void
    type: IQuestionTypeValues
}

/**
 * Sortable wrapper for a single choice item in the question choices editor.
 * Includes a drag handle (grip icon) for reordering via drag and drop.
 */
export function SortableChoiceItem({
    item,
    onChange,
    type,
}: ISortableChoiceItemProps) {
    const [value, setValue] = useState(item.content)

    const onChoiceChange = (
        action: 'upsert' | 'delete',
        params: Partial<IChoice>
    ) => {
        onChange(action, params)
    }

    const onValueChange = () => {
        if (!value) return
        onChoiceChange('upsert', { ...item, content: value })
    }

    return (
        <SortableItem id={item.id} useHandle>
            <Field className="flex flex-row items-center mb-2 group">
                {/* Drag Handle - visible on hover */}
                <DragHandle
                    id={item.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity mr-1 flex-0"
                    iconSize={14}
                />

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
            </Field>
        </SortableItem>
    )
}
