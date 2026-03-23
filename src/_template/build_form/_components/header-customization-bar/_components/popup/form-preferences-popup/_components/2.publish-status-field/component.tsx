import { LabelTooltipComponent } from '@/_components/shared/label-tooltip/component'
import { Field } from '@/_components/ui/field'
import { Switch } from '@/_components/ui/switch'
import { IForm } from '@db/types'
import { Control, Controller } from 'react-hook-form'

interface IPublishStatusFieldProps {
    control: Control<Partial<IForm>>
    defaultValue: number
}

export function PublishStatusFieldComponent(props: IPublishStatusFieldProps) {
    const { control, defaultValue } = props

    return (
        <Field className="flex flex-row">
            <LabelTooltipComponent
                className="flex flex-16 items-center"
                labelText="Formulario publicado"
                tooltipContent={
                    <>
                        Cuando un formulario está publicado,
                        <br />
                        los encuestados pueden acceder a él
                        <br />
                        y enviar respuestas. Si no está
                        <br />
                        publicado, solo usted y sus
                        <br />
                        colaboradores con permisos
                        <br />
                        de edición podrán verlo y editarlo.
                    </>
                }
            />
            <Controller
                control={control}
                name="isPublished"
                defaultValue={defaultValue}
                render={({ field: { value, onChange } }) => (
                    <Switch
                        id="form_is_published"
                        className="flex-1"
                        checked={value === 1}
                        onCheckedChange={(checked) => onChange(checked ? 1 : 0)}
                    />
                )}
            />
        </Field>
    )
}