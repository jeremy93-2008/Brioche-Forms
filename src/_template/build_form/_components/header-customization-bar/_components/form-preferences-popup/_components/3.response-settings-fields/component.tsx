import { LabelTooltipComponent } from '@/_components/shared/label-tooltip/component'
import { Field } from '@/_components/ui/field'
import { Switch } from '@/_components/ui/switch'
import { IForm } from '@db/types'
import { Control, Controller } from 'react-hook-form'

interface IResponseSettingsFieldsProps {
    control: Control<Partial<IForm>>
    data: IForm
}

export function ResponseSettingsFieldsComponent(
    props: IResponseSettingsFieldsProps
) {
    const { control, data } = props

    return (
        <>
            <Field className="flex flex-row">
                <LabelTooltipComponent
                    className="flex flex-16 items-center"
                    labelText="Los encuestados deben iniciar sesión"
                    tooltipContent={
                        <>
                            Obligar a los encuestados a iniciar
                            <br />
                            sesión con una cuenta antes de
                            <br />
                            enviar respuestas. Esto ayuda a
                            <br />
                            garantizar la autenticidad,
                            <br />
                            seguridad de las respuestas <br />y poder editarlas,
                            si se permite.
                        </>
                    }
                />
                <Controller
                    control={control}
                    name="mustLoginToRespond"
                    defaultValue={data.mustLoginToRespond}
                    render={({ field: { value, onChange } }) => (
                        <Switch
                            id="require_login_to_respond"
                            className="flex-1"
                            checked={value === 1}
                            onCheckedChange={(checked) =>
                                onChange(checked ? 1 : 0)
                            }
                        />
                    )}
                />
            </Field>
            <Field className="flex flex-row">
                <LabelTooltipComponent
                    className="flex flex-16 items-center"
                    labelText="Permitir respuestas"
                    tooltipContent={
                        <>
                            Si esta opción está desactivada,
                            <br />
                            los encuestados no podrán enviar
                            <br />
                            respuestas al formulario, aunque
                            <br />
                            puedan verlo.
                        </>
                    }
                />
                <Controller
                    control={control}
                    name="acceptResponses"
                    defaultValue={
                        data.isPublished === 1 &&
                        data.acceptResponses !== undefined
                            ? data.acceptResponses
                            : 0
                    }
                    render={({ field: { value, onChange } }) => (
                        <Switch
                            id="allow_responses"
                            className="flex-1"
                            checked={value === 1}
                            onCheckedChange={(checked) =>
                                onChange(checked ? 1 : 0)
                            }
                        />
                    )}
                />
            </Field>
            <Field className="flex flex-row">
                <LabelTooltipComponent
                    className="flex flex-16 items-center mb-1"
                    labelText="Acepta modificaciones de la respuesta"
                    tooltipContent={
                        <>
                            Permitir a los encuestados editar
                            <br />
                            sus respuestas después de enviarlas.
                            <br />
                            (Se activará la obligación de iniciar
                            <br />
                            sesión si no está ya activada).
                        </>
                    }
                />
                <Controller
                    control={control}
                    name="canModifyResponses"
                    defaultValue={data.canModifyResponses || 0}
                    render={({ field: { value, onChange } }) => (
                        <Switch
                            id="allow_response_edits"
                            className="flex-1"
                            checked={value === 1}
                            onCheckedChange={(checked) =>
                                onChange(checked ? 1 : 0)
                            }
                        />
                    )}
                />
            </Field>
        </>
    )
}
