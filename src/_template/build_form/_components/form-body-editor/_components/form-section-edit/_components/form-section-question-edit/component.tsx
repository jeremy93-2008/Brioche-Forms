import { Button } from '@/_components/ui/button'
import { Checkbox } from '@/_components/ui/checkbox'
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
import { showToastFromResult } from '@/_utils/showToastFromResult'
import { IQuestion } from '@db/types'
import { Controller, useForm } from 'react-hook-form'

interface IFormSectionQuestionEditComponentProps {
    data: IFullForm['pages'][0]['sections'][0]['questions'][0]
}

export function FormSectionQuestionEditComponent(
    props: IFormSectionQuestionEditComponentProps
) {
    const { data } = props

    const { register, control, formState, handleSubmit } = useForm<IQuestion>()
    const { isPending, runAction } = useServerActionState(EditQuestionAction)

    const onSaveContent = async (fields: IQuestion) => {
        const result = await runAction({
            id: data.id,
            form_id: data.form_id,
            section_id: data.section_id,
            name: fields.name,
            order: fields.order,
            content: fields.content,
            type: fields.type,
            is_required: fields.is_required.toString() === 'on' ? 1 : 0,
        } as IQuestion)

        showToastFromResult(result, ToastMessages.genericSuccess)
    }

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
            <Field className="mt-4 mb-2">
                <Label
                    className="block text-sm font-medium mb-1"
                    htmlFor="question-content"
                >
                    Contenido de la pregunta
                </Label>
                <Textarea
                    id="question-content"
                    defaultValue={data.content}
                    {...register('content')}
                />
            </Field>
            <Field className="mb-4">
                <Label
                    className="block text-sm font-medium mb-1"
                    htmlFor="question-type"
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
                            <SelectTrigger id="question-type" className="w-72">
                                <SelectValue placeholder="Selecciona un espacio de trabajo" />
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
            <Field className="mb-4">
                <Label className="inline-flex items-center">
                    <Checkbox
                        className="form-checkbox"
                        defaultChecked={data.is_required === 1}
                        {...register('is_required')}
                    />
                    <span className="ml-2">Requerido</span>
                </Label>
            </Field>
        </FieldSet>
    )
}
