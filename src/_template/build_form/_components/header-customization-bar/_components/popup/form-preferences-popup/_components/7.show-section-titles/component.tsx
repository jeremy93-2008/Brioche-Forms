import { LabelTooltipComponent } from '@/_components/shared/label-tooltip/component'
import { Field } from '@/_components/ui/field'
import { Switch } from '@/_components/ui/switch'
import { IForm } from '@db/types'
import { Control, Controller } from 'react-hook-form'

interface ICustomMessagesFieldsProps {
    control: Control<Partial<IForm>>
    defaultValue: number
}

export function ShowSectionTitlesComponent(props: ICustomMessagesFieldsProps) {
    const { control, defaultValue } = props

    return (
        <Field className="flex flex-row">
            <LabelTooltipComponent
                className="flex flex-16 items-center"
                labelText="Mostrar títulos de sección"
                tooltipContent={
                    <>
                        Desactiva esta opción si no
                        <br />
                        deseas mostrar los títulos de las
                        <br />
                        secciones a los encuestados. Esto
                        <br />
                        puede ser útil si prefieres una
                        <br />
                        presentación más compacta del
                        <br />
                        cuestionario, especialmente en
                        <br />
                        dispositivos móviles o si los títulos
                        <br />
                        de las secciones no son esenciales para
                        <br />
                        la comprensión de las preguntas.
                    </>
                }
            />
            <Controller
                control={control}
                name="showSectionTitles"
                defaultValue={defaultValue}
                render={({ field: { value, onChange } }) => (
                    <Switch
                        id="show_section_titles"
                        className="flex-1"
                        checked={value === 1}
                        onCheckedChange={(checked) => onChange(checked ? 1 : 0)}
                    />
                )}
            />
        </Field>
    )
}
