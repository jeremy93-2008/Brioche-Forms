import { LabelTooltipComponent } from '@/_components/shared/label-tooltip/component'
import { Field } from '@/_components/ui/field'
import { Input } from '@/_components/ui/input'
import { IForm } from '@db/types'
import { Control, Controller } from 'react-hook-form'

interface IResponseLimitsFieldsProps {
    control: Control<Partial<IForm>>
    data: IForm
}

export function ResponseLimitsFieldsComponent(
    props: IResponseLimitsFieldsProps
) {
    const { control, data } = props

    return (
        <>
            <Field className="flex flex-row">
                <LabelTooltipComponent
                    className="flex flex-16 items-center"
                    labelText="Límite de respuestas"
                    tooltipContent={
                        <>
                            Establecer un número máximo de
                            <br />
                            respuestas que el formulario puede
                            <br />
                            aceptar. Una vez alcanzado este
                            <br />
                            límite, el formulario dejará de
                            <br />
                            aceptar nuevas respuestas.
                        </>
                    }
                />
                <Controller
                    control={control}
                    name="responseLimit"
                    defaultValue={
                        data.responseLimit !== undefined
                            ? data.responseLimit
                            : Infinity
                    }
                    render={({ field: { value, onChange } }) => (
                        <Input
                            type="number"
                            min={1}
                            placeholder="Ilimitado"
                            className="flex-4"
                            value={
                                value === Infinity ? '' : value ? value : ''
                            }
                            onChange={(e) => {
                                const val = e.target.value
                                onChange(val)
                            }}
                        />
                    )}
                />
            </Field>
            <Field className="flex flex-row">
                <LabelTooltipComponent
                    className="flex flex-16 items-center"
                    labelText="Fecha de finalización de respuestas"
                    tooltipContent={
                        <>
                            Establecer una fecha y hora
                            <br />
                            específicas después de las cuales el
                            <br />
                            formulario dejará de aceptar nuevas
                            <br />
                            respuestas.
                        </>
                    }
                />
                <Controller
                    control={control}
                    name="responseLimitDate"
                    defaultValue={data.responseLimitDate || Infinity}
                    render={({ field: { value, onChange } }) => (
                        <Input
                            type="datetime-local"
                            className="flex-7"
                            value={
                                value && value !== Infinity
                                    ? new Date(value).toISOString().slice(0, 16)
                                    : ''
                            }
                            onChange={(e) =>
                                onChange(new Date(e.target.value).getTime())
                            }
                        />
                    )}
                />
            </Field>
        </>
    )
}