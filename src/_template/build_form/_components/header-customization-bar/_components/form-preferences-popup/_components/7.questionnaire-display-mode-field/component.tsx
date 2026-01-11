import { LabelTooltipComponent } from '@/_components/shared/label-tooltip/component'
import { Field } from '@/_components/ui/field'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/_components/ui/select'
import { IForm } from '@db/types'
import { BookOpenIcon, CaseSensitiveIcon, StickyNoteIcon } from 'lucide-react'
import { Control, Controller } from 'react-hook-form'

interface QuestionnaireDisplayModeFieldProps {
    control: Control<Partial<IForm>>
    defaultValue: string
}

export function QuestionnaireDisplayModeFieldComponent(
    props: QuestionnaireDisplayModeFieldProps
) {
    const { control, defaultValue } = props

    return (
        <Field className="flex flex-row">
            <LabelTooltipComponent
                className="flex flex-16 items-center"
                labelText="Modo de visualización del cuestionario"
                tooltipContent={
                    <>
                        Selecciona cómo se mostrarán las
                        <br />
                        preguntas del cuestionario a los
                        <br />
                        encuestados. Existen diferentes modos
                        <br />
                        "Todas las páginas" para mostrar todas las
                        <br />
                        preguntas en una sola página. <br />
                        "Página por página" para mostrar cada
                        <br />
                        página por separado. Y "Sección por sección"
                        <br />
                        "Sección por sección" para mostrar cada
                        <br />
                        sección por separado.
                    </>
                }
            />
            <Controller
                control={control}
                name="questionnaireDisplayMode"
                defaultValue={defaultValue}
                render={({ field: { value, onChange } }) => (
                    <Select
                        value={value!}
                        onValueChange={(val) => onChange(val)}
                    >
                        <SelectTrigger className="flex-4">
                            <SelectValue placeholder="Modo de visualización" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all_pages">
                                    <BookOpenIcon />
                                    Todas las páginas
                                </SelectItem>
                                <SelectItem value="page_by_page">
                                    <StickyNoteIcon />
                                    Página por página
                                </SelectItem>
                                <SelectItem value="section_by_page">
                                    <CaseSensitiveIcon />
                                    Sección por página
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            />
        </Field>
    )
}
