import { Field, FieldGroup, FieldLabel, FieldSet } from '@/_components/ui/field'
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
import CreateQuestionAction from '@/_server/_handlers/actions/question/create'
import { CreateNewSectionButtonComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/_components/shared/create-new-section-button/component'
import { ICreateNewSectionButtonProps } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/_components/shared/types'
import { useAfterSaveNewSectionOptimistic } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/hooks/useAfterSaveNewSectionOptimistic'
import { BadgeQuestionMarkIcon } from 'lucide-react'
import { Controller } from 'react-hook-form'

export function CreateNewQuestionButtonComponent(
    props: ICreateNewSectionButtonProps
) {
    const { formId, pageId } = props

    const { afterSave } = useAfterSaveNewSectionOptimistic({
        contentType: 'questions',
    })

    return (
        <CreateNewSectionButtonComponent
            buttonText="Nueva pregunta"
            buttonIcon={<BadgeQuestionMarkIcon className="w-10! h-10!" />}
            dialogTitle="Crear nueva pregunta"
            serverAction={CreateQuestionAction}
            afterSave={afterSave}
        >
            {(form) => (
                <FieldSet>
                    <input
                        type="hidden"
                        id="form_id"
                        value={formId}
                        {...form.register('form_id')}
                    />
                    <input
                        type="hidden"
                        id="page_id"
                        value={pageId}
                        {...form.register('page_id')}
                    />
                    <input
                        type="hidden"
                        id="name"
                        value="Pregunta"
                        {...form.register('name')}
                    />
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="content">
                                Contenido de la pregunta
                            </FieldLabel>
                            <Textarea
                                className="resize-none"
                                id="content"
                                placeholder="Escriba su pregunta..."
                                {...form.register('content')}
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Tipo de pregunta</FieldLabel>
                            <Controller
                                control={form.control}
                                name="type"
                                defaultValue={QuestionTypes[0].value}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        value={value}
                                        onValueChange={onChange}
                                    >
                                        <SelectTrigger className="w-72">
                                            <SelectValue placeholder="Selecciona un espacio de trabajo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {QuestionTypes.map(
                                                    (questionType) => (
                                                        <SelectItem
                                                            key={
                                                                questionType.value
                                                            }
                                                            value={
                                                                questionType.value
                                                            }
                                                        >
                                                            {questionType.icon}
                                                            {questionType.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>
            )}
        </CreateNewSectionButtonComponent>
    )
}
