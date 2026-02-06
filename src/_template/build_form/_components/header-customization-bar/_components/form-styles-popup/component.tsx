import Brioche from '@/_assets/brioche.svg'
import {
    FormFieldEditDialog,
    FormFieldEditDialogContent,
    FormFieldEditDialogTrigger,
} from '@/_components/shared/form-field-edit-dialog/component.client'
import { LabelTooltipComponent } from '@/_components/shared/label-tooltip/component'
import { Button } from '@/_components/ui/button'
import { ColorPicker } from '@/_components/ui/color-picker'
import { Field, FieldSet } from '@/_components/ui/field'
import { ImagePicker } from '@/_components/ui/image-picker'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/_components/ui/select'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import updateFormAction from '@/_server/_handlers/actions/form/update'
import { IForm } from '@db/types'
import {
    CircleIcon,
    MoonIcon,
    Paintbrush2,
    SunIcon,
    SunMoonIcon,
} from 'lucide-react'
import Image from 'next/image'
import { use } from 'react'
import { Controller } from 'react-hook-form'

export function FormStylesPopupComponent() {
    const { data } = use(SingleFormSelectedContext)!

    return (
        <FormFieldEditDialog
            title="Estilos del formulario"
            serverAction={updateFormAction}
        >
            <FormFieldEditDialogTrigger>
                <Button variant="link">
                    <Paintbrush2 />
                    Estilos
                </Button>
            </FormFieldEditDialogTrigger>
            <FormFieldEditDialogContent<IForm> className="w-[602px]! max-w-[602px]!">
                {({ register, control }) => (
                    <>
                        <div className="pointer-events-none absolute bg-linear-to-b from-card to-card/0 h-2 w-full -mt-1 left-0" />
                        <FieldSet className="max-h-[45vh] min-h-[300px] px-3 py-6 overflow-y-auto">
                            <input
                                type="hidden"
                                value={data.id}
                                {...register('id')}
                            />
                            <Field className="flex flex-row">
                                <LabelTooltipComponent
                                    className="flex flex-1"
                                    labelText="Estilo"
                                    htmlFor="formStyle"
                                    tooltipContent={
                                        <>
                                            El modo Brioche es el modo
                                            <br />
                                            Por defecto, y es el modo de
                                            <br />
                                            está aplicación. El modo estándar es
                                            un
                                            <br />
                                            modo más tradicional, con un diseño
                                            <br />
                                            más simple y minimalista. Puedes
                                            <br />
                                            cambiar entre ambos modos para ver
                                            <br />
                                            cuál se adapta mejor a tus
                                            <br />
                                            necesidades y preferencias.
                                        </>
                                    }
                                />
                                <Controller
                                    control={control}
                                    name="formStyle"
                                    defaultValue={data.formStyle || 'brioche'}
                                    render={({
                                        field: { value, onChange },
                                    }) => (
                                        <Select
                                            value={value}
                                            onValueChange={onChange}
                                        >
                                            <SelectTrigger
                                                className="flex-[0.96]"
                                                id="formStyle"
                                            >
                                                <SelectValue placeholder="Seleccionar estilo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="standard">
                                                        <CircleIcon className="fill-slate-500 stroke-transparent" />
                                                        Estándar
                                                    </SelectItem>
                                                    <SelectItem value="brioche">
                                                        <Image
                                                            src={Brioche}
                                                            alt="Brioche Imagen"
                                                            width={16}
                                                            height={16}
                                                        />
                                                        Brioche
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            <Field className="flex flex-row">
                                <LabelTooltipComponent
                                    className="flex flex-1"
                                    labelText="Modo"
                                    htmlFor="theme"
                                    tooltipContent={
                                        <>
                                            El modo claro es ideal
                                            <br />
                                            para entornos bien iluminados, ya
                                            que
                                            <br />
                                            utiliza colores claros y brillantes.
                                            <br />
                                            El modo oscuro es perfecto para
                                            <br />
                                            entornos con poca luz, ya que
                                            utiliza
                                            <br />
                                            colores oscuros que reducen la
                                            fatiga
                                            <br />
                                            visual. El modo sistema se adapta al
                                            <br />
                                            tema de tu dispositivo, cambiando
                                            <br />
                                            automáticamente entre claro y oscuro
                                            <br />
                                            según la configuración de tu
                                            sistema.
                                        </>
                                    }
                                />
                                <Controller
                                    control={control}
                                    name="theme"
                                    defaultValue={data.theme || 'system'}
                                    render={({
                                        field: { value, onChange },
                                    }) => (
                                        <Select
                                            value={value}
                                            onValueChange={onChange}
                                        >
                                            <SelectTrigger
                                                className="flex-[0.96]"
                                                id="theme"
                                            >
                                                <SelectValue placeholder="Seleccionar modo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="light">
                                                        <SunIcon />
                                                        Claro
                                                    </SelectItem>
                                                    <SelectItem value="dark">
                                                        <MoonIcon />
                                                        Oscuro
                                                    </SelectItem>
                                                    <SelectItem value="system">
                                                        <SunMoonIcon />
                                                        Sistema
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            <Field className="flex flex-row">
                                <LabelTooltipComponent
                                    className="flex flex-[1.08] min-w-[220px]"
                                    labelText="Color de fondo"
                                    htmlFor="backgroundColor"
                                    tooltipContent={
                                        <>
                                            Elige un color de fondo para tu
                                            <br />
                                            formulario. Puedes seleccionar un
                                            <br />
                                            color sólido o un degradado, según
                                            <br />
                                            tus preferencias. El color de fondo
                                            <br />
                                            puede ayudar a mejorar la apariencia
                                            de tu
                                            <br />
                                            formulario y hacerlo más atractivo
                                            <br />
                                            para los usuarios.
                                        </>
                                    }
                                />
                                <Controller
                                    control={control}
                                    name="backgroundColor"
                                    defaultValue={data.backgroundColor}
                                    render={({
                                        field: { value, onChange },
                                    }) => (
                                        <ColorPicker
                                            className="flex-1"
                                            background={value ?? ''}
                                            setBackground={onChange}
                                        />
                                    )}
                                />
                            </Field>

                            <Field className="flex flex-row">
                                <LabelTooltipComponent
                                    className="flex flex-[1.08]"
                                    labelText="Imagen de cabecera"
                                    htmlFor="headerImage"
                                    tooltipContent={
                                        <>
                                            Puedes subir una imagen de cabecera
                                            <br />
                                            para personalizar aún más tu
                                            <br />
                                            formulario. La imagen de cabecera se
                                            <br />
                                            mostrará en la parte superior del
                                            <br />
                                            formulario, y puede ser una forma
                                            <br />
                                            efectiva de captar la atención de
                                            los
                                            <br />
                                            usuarios y hacer que tu formulario
                                            se
                                            <br />
                                            destaque.
                                        </>
                                    }
                                />
                                <Controller
                                    control={control}
                                    name="headerImage"
                                    defaultValue={data.headerImage}
                                    render={({
                                        field: { value, onChange },
                                    }) => (
                                        <ImagePicker
                                            className="flex-1"
                                            image={value ?? ''}
                                            setImage={onChange}
                                        />
                                    )}
                                />
                            </Field>
                        </FieldSet>
                        <div className="pointer-events-none absolute bg-linear-to-t from-card to-card/0 h-2 w-full -mt-1 left-0" />
                    </>
                )}
            </FormFieldEditDialogContent>
        </FormFieldEditDialog>
    )
}
