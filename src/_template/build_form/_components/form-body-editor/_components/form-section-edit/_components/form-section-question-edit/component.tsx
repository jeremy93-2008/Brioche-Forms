import { SortableItemContext } from '@/_components/dnd/sortableItem'
import { Checkbox } from '@/_components/ui/checkbox'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/_components/ui/collapsible'
import { Field, FieldSet } from '@/_components/ui/field'
import { Label } from '@/_components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/_components/ui/select'
import { Textarea } from '@/_components/ui/textarea'
import { QuestionTypes } from '@/_constants/question'
import { AutoSaveContext } from '@/_provider/auto-save/auto-save-provider'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { FormQuestionChoicesEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/_components/form-question-choices-edit/component'
import { IQuestion } from '@db/types'
import { Button } from '@/_components/ui/button'
import { ChevronsUpDown, EllipsisIcon, MinusIcon, PlusIcon } from 'lucide-react'
import { use, useCallback, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

export type IQuestionWithChoices = IQuestion & {
    choices: IFullForm['pages'][0]['sections'][0]['questions'][0]['choices']
}

interface IFormSectionQuestionEditComponentProps {
    data: IFullForm['pages'][0]['sections'][0]['questions'][0]
}

export function FormSectionQuestionEditComponent(
    props: IFormSectionQuestionEditComponentProps
) {
    const { data } = props

    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
    const { markDirty, flushNow } = use(AutoSaveContext)

    const { register, control, getValues } = useForm<IQuestionWithChoices>({
        defaultValues: {
            id: data.id,
            form_id: data.form_id,
            section_id: data.section_id,
            name: data.name,
            order: data.order,
            content: data.content,
            type: data.type,
            is_required: data.is_required,
            choices: data.choices,
        },
    })

    const emitDirty = useCallback(() => {
        const fields = getValues()
        markDirty({
            type: 'question',
            id: data.id,
            formId: data.form_id,
            sectionId: data.section_id,
            payload: {
                question: {
                    id: fields.id,
                    form_id: fields.form_id,
                    section_id: fields.section_id,
                    name: fields.name,
                    order: fields.order,
                    content: fields.content,
                    type: fields.type,
                    is_required: fields.is_required,
                },
                choices: fields.choices,
            },
        })
    }, [data.id, data.form_id, data.section_id, getValues, markDirty])

    const currentQuestionType = useWatch({ name: 'type', control })

    const sortableItem = use(SortableItemContext)

    return (
        <FieldSet className="relative flex-col mx-3">
            <input type="hidden" id="id" value={data.id} {...register('id')} />
            <input
                type="hidden"
                id="form_id"
                value={data.form_id}
                {...register('form_id')}
            />
            <input
                type="hidden"
                id="section_id"
                value={data.section_id}
                {...register('section_id')}
            />
            <input
                type="hidden"
                id="name"
                value={data.name}
                {...register('name', {
                    onChange: () => emitDirty(),
                })}
            />
            <input
                type="hidden"
                id="order"
                value={data.order}
                {...register('order')}
            />
            <section className="absolute flex justify-end top-[-25px] right-0">
                <Label className="inline-flex items-center">
                    <Controller
                        control={control}
                        name="is_required"
                        render={({ field: { onChange, value } }) => (
                            <Checkbox
                                className="form-checkbox"
                                checked={value === 1}
                                onCheckedChange={(checked) => {
                                    onChange(checked ? 1 : 0)
                                    setTimeout(() => {
                                        emitDirty()
                                        flushNow()
                                    }, 0)
                                }}
                            />
                        )}
                    />
                    <span className="ml-2">Requerido</span>
                </Label>
            </section>
            <Field className="mt-3">
                <Label
                    className="block text-sm font-medium"
                    htmlFor={`question-type-${data.id}`}
                >
                    Tipo de pregunta
                </Label>
                <Controller
                    control={control}
                    name="type"
                    render={({ field: { onChange, value } }) => (
                        <Select
                            defaultValue={data.type}
                            value={value}
                            onValueChange={(newValue) => {
                                onChange(newValue)
                                setTimeout(() => {
                                    emitDirty()
                                    flushNow()
                                }, 0)
                            }}
                        >
                            <SelectTrigger
                                id={`question-type-${data.id}`}
                                className="w-72"
                            >
                                <SelectValue placeholder="Selecciona un tipo de pregunta" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {QuestionTypes.map((questionType) => (
                                        <SelectItem
                                            key={questionType.value}
                                            value={questionType.value}
                                        >
                                            {questionType.icon}
                                            {questionType.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
            </Field>
            {(currentQuestionType === 'single_choice' ||
                currentQuestionType === 'multiple_choice') && (
                <Field>
                    {!sortableItem?.isSorting && (
                        <Collapsible defaultOpen>
                            <CollapsibleTrigger>
                                <Label className="flex text-sm font-medium cursor-pointer">
                                    Lista de Respuestas disponibles
                                    <h6 className="text-xs">
                                        ({data.choices.length} respuestas)
                                    </h6>
                                    <ChevronsUpDown className="w-4! h-4!" />
                                </Label>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <Controller
                                    control={control}
                                    name="choices"
                                    render={({
                                        field: { value, onChange },
                                    }) => (
                                        <section className="mt-4">
                                            <FormQuestionChoicesEditComponent
                                                data={value}
                                                onDataChange={(newChoices) => {
                                                    onChange(newChoices)
                                                    setTimeout(() => emitDirty(), 0)
                                                }}
                                                questionId={data.id}
                                                formId={data.form_id}
                                                type={currentQuestionType}
                                            />
                                        </section>
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>
                    )}
                    {sortableItem?.isSorting && (
                        <div>
                            <Label className="flex text-sm font-medium cursor-pointer">
                                Lista de Respuestas disponibles
                                <h6 className="text-xs">
                                    ({data.choices.length} respuestas)
                                </h6>
                            </Label>
                            <EllipsisIcon className="w-8 h-8 mx-auto mt-4 mb-6 stroke-secondary" />
                        </div>
                    )}
                </Field>
            )}
            <Field>
                <Collapsible
                    open={isDescriptionExpanded}
                    onOpenChange={setIsDescriptionExpanded}
                >
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="link"
                            className="flex text-xs font-medium mb-1"
                        >
                            {!isDescriptionExpanded ? (
                                <>
                                    <PlusIcon />
                                    Añadir una descripción adicional para la
                                    pregunta
                                </>
                            ) : (
                                <>
                                    <MinusIcon />
                                    Descripción adicional para la pregunta
                                </>
                            )}
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <Textarea
                            id={`question-content-${data.id}`}
                            className="text-xs"
                            defaultValue={data.content}
                            {...register('content', {
                                onChange: () => emitDirty(),
                            })}
                        />
                    </CollapsibleContent>
                </Collapsible>
            </Field>
        </FieldSet>
    )
}
