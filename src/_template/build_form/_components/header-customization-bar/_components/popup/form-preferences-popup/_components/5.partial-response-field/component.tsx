import { LabelTooltipComponent } from '@/_components/shared/label-tooltip/component'
import { Field } from '@/_components/ui/field'
import { Switch } from '@/_components/ui/switch'
import { IForm } from '@db/types'
import { Control, Controller } from 'react-hook-form'

interface PartialResponseFieldProps {
    control: Control<Partial<IForm>>
    defaultValue: number
}

export function PartialResponseFieldComponent(
    props: PartialResponseFieldProps
) {
    const { control, defaultValue } = props

    return (
        <Field className="flex flex-row">
            <LabelTooltipComponent
                className="flex flex-16 items-center"
                labelText="Aceptar respuestas parciales"
                tooltipContent={
                    <>
                        Permitir que los encuestados guarden sus
                        <br />
                        respuestas y continúen más tarde.
                    </>
                }
            />
            <Controller
                control={control}
                name="savePartialResponses"
                defaultValue={defaultValue}
                render={({ field: { value, onChange } }) => (
                    <Switch
                        id="save-partial-responses"
                        className="flex-1"
                        checked={value === 1}
                        onCheckedChange={(checked) => onChange(checked ? 1 : 0)}
                    />
                )}
            />
        </Field>
    )
}
