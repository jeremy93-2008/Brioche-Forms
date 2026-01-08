import { LabelTooltipComponent } from '@/_components/shared/label-tooltip/component'
import { Field } from '@/_components/ui/field'
import { Switch } from '@/_components/ui/switch'
import { IForm } from '@db/types'
import { Control, Controller } from 'react-hook-form'

interface IDraftModeFieldProps {
    control: Control<Partial<IForm>>
    defaultValue: number
}

export function DraftModeFieldComponent(props: IDraftModeFieldProps) {
    const { control, defaultValue } = props

    return (
        <Field className="flex flex-row">
            <LabelTooltipComponent
                className="flex flex-16 items-center"
                labelText="Modo Borrador"
                tooltipContent={
                    <>
                        Cuando el modo borrador está <br />
                        activado, el formulario no se puede
                        <br />
                        compartir ni enviar hasta que se
                        <br />
                        publique. Este modo se desactiva
                        <br />
                        automáticamente al publicar el
                        <br />
                        formulario.
                    </>
                }
            />
            <Controller
                control={control}
                name="isDraft"
                defaultValue={defaultValue}
                render={({ field: { value, onChange } }) => (
                    <Switch
                        id="is_draft"
                        className="flex-1"
                        checked={value === 1}
                        onCheckedChange={(checked) => onChange(checked ? 1 : 0)}
                    />
                )}
            />
        </Field>
    )
}
