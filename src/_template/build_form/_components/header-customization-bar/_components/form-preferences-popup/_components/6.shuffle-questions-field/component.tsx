import { LabelTooltipComponent } from '@/_components/shared/label-tooltip/component'
import { Field } from '@/_components/ui/field'
import { Switch } from '@/_components/ui/switch'
import { IForm } from '@db/types'
import { Control, Controller } from 'react-hook-form'

interface ShuffleQuestionsFieldProps {
    control: Control<Partial<IForm>>
    defaultValue: number
}

export function ShuffleQuestionsFieldComponent(
    props: ShuffleQuestionsFieldProps
) {
    const { control, defaultValue } = props

    return (
        <Field className="flex flex-row">
            <LabelTooltipComponent
                className="flex flex-16 items-center"
                labelText="Reordenar preguntas aleatoriamente"
                tooltipContent={
                    <>
                        Mostrar las preguntas en un orden
                        <br />
                        aleatorio para cada encuestado.
                    </>
                }
            />
            <Controller
                control={control}
                name="shuffleQuestions"
                defaultValue={defaultValue}
                render={({ field: { value, onChange } }) => (
                    <Switch
                        id="shuffle-questions"
                        className="flex-1"
                        checked={value === 1}
                        onCheckedChange={(checked) => onChange(checked ? 1 : 0)}
                    />
                )}
            />
        </Field>
    )
}
