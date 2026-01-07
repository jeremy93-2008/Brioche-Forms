import { SortableItemContext } from '@/_components/dnd/sortableItem'
import { Button } from '@/_components/ui/button'
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
import { ToastMessages } from '@/_constants/toast'
import { useServerActionState } from '@/_hooks/useServerActionState'
import EditQuestionAction from '@/_server/_handlers/actions/question/update'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { FormQuestionChoicesEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/_components/form-question-choices-edit/component'
import { showToastFromResult } from '@/_utils/showToastFromResult'
import { IQuestion } from '@db/types'
import { ChevronsUpDown, EllipsisIcon } from 'lucide-react'
import { use } from 'react'
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

    const { register, control, formState, handleSubmit } =
        useForm<IQuestionWithChoices>({
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

    const { isPending, runAction } = useServerActionState(EditQuestionAction)

    const onSaveContent = async (fields: IQuestionWithChoices) => {
        const result = await runAction({
            id: data.id,
            form_id: data.form_id,
            section_id: data.section_id,
            name: fields.name,
            order: fields.order,
            content: fields.content,
            type: fields.type,
            is_required: fields.is_required,
            choices: fields.choices,
        } as IQuestionWithChoices)

        showToastFromResult(result, ToastMessages.genericSuccess)
    }

    const currentQuestionType = useWatch({ name: 'type', control })

    const sortableItem = use(SortableItemContext)

    return (
        <FieldSet className="relative flex-col">
            <section className="absolute flex justify-end -top-8 right-0">
                <Button
                    onClick={handleSubmit(onSaveContent)}
                    className="mb-4"
                    size="sm"
                    isLoading={isPending}
                    disabled={!formState.isDirty}
                >
                    Guardar
                </Button>
            </section>
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
                {...register('name')}
            />
            <input
                type="hidden"
                id="order"
                value={data.order}
                {...register('order')}
            />
            <section className="absolute flex justify-end top-[-25px] right-32">
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
                                }}
                            />
                        )}
                    />
                    <span className="ml-2">Requerido</span>
                </Label>
            </section>
            <Field className="mt-4 mb-2">
                <Label
                    className="block text-sm font-medium mb-1"
                    htmlFor={`question-content-${data.id}`}
                >
                    Contenido de la pregunta
                </Label>
                <Textarea
                    id={`question-content-${data.id}`}
                    defaultValue={data.content}
                    {...register('content')}
                />
            </Field>
            <Field className="mb-2">
                <Label
                    className="block text-sm font-medium mb-1"
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
                            onValueChange={onChange}
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
                <Field className="mb-4">
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
                                                onDataChange={onChange}
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
        </FieldSet>
    )
}
