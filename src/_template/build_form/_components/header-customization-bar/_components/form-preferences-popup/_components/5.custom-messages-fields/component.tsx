import { LabelTooltipComponent } from '@/_components/shared/label-tooltip/component'
import { Field } from '@/_components/ui/field'
import { Input } from '@/_components/ui/input'
import { IForm } from '@db/types'
import { Control, Controller } from 'react-hook-form'

interface ICustomMessagesFieldsProps {
    control: Control<Partial<IForm>>
    data: IForm
}

export function CustomMessagesFieldsComponent(
    props: ICustomMessagesFieldsProps
) {
    const { control, data } = props

    return (
        <>
            <Field className="flex flex-row">
                <LabelTooltipComponent
                    className="flex flex-12 items-center"
                    labelText="Mensaje de confirmación personalizado"
                    tooltipContent={
                        <>
                            Personalizar el mensaje que los
                            <br />
                            encuestados ven después de enviar
                            <br />
                            el formulario.
                        </>
                    }
                />
                <Controller
                    control={control}
                    name="messageAfterSubmit"
                    defaultValue={data.messageAfterSubmit || ''}
                    render={({ field: { value, onChange } }) => (
                        <Input
                            type="text"
                            placeholder="Gracias por completar el formulario."
                            className="flex-12"
                            value={value!}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    )}
                />
            </Field>
            <Field className="flex flex-row">
                <LabelTooltipComponent
                    className="flex flex-12 items-center"
                    labelText="Mensaje de no aceptación de respuestas"
                    tooltipContent={
                        <>
                            Personalizar el mensaje que los
                            <br />
                            encuestados ven cuando el formulario
                            <br />
                            no está aceptando respuestas.
                        </>
                    }
                />
                <Controller
                    control={control}
                    name="messageIfNotAcceptResponses"
                    defaultValue={data.messageIfNotAcceptResponses || ''}
                    render={({ field: { value, onChange } }) => (
                        <Input
                            type="text"
                            placeholder="Gracias por su interés, pero este formulario no está aceptando respuestas en este momento."
                            className="flex-12"
                            value={value!}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    )}
                />
            </Field>
            <Field className="flex flex-row">
                <LabelTooltipComponent
                    className="flex flex-12 items-center"
                    labelText="Mensaje de límite de respuestas alcanzado"
                    tooltipContent={
                        <>
                            Personalizar el mensaje que los
                            <br />
                            encuestados ven cuando el formulario
                            <br />
                            ha alcanzado su límite de respuestas.
                        </>
                    }
                />
                <Controller
                    control={control}
                    name="messageIfLimitReached"
                    defaultValue={data.messageIfLimitReached || ''}
                    render={({ field: { value, onChange } }) => (
                        <Input
                            type="text"
                            placeholder="Gracias por su interés, pero este formulario ha alcanzado su límite de respuestas."
                            className="flex-12"
                            value={value!}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    )}
                />
            </Field>
        </>
    )
}