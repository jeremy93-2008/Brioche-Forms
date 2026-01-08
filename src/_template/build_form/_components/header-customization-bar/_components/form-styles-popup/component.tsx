import Brioche from '@/_assets/brioche.svg'
import {
    FormFieldEditDialog,
    FormFieldEditDialogContent,
    FormFieldEditDialogTrigger,
} from '@/_components/shared/form-field-edit-dialog/component.client'
import { FormGalleryUploadImageComponent } from '@/_components/shared/form-gallery-upload-image/component.client'
import { Button } from '@/_components/ui/button'
import { Field, FieldSet } from '@/_components/ui/field'
import { Input } from '@/_components/ui/input'
import { Label } from '@/_components/ui/label'
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
    CameraIcon,
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
            <FormFieldEditDialogContent<IForm> className="min-w-[620px]!">
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
                                <Label htmlFor="formStyle">Estilo</Label>
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
                                            <SelectTrigger id="formStyle">
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
                                <Label htmlFor="theme">Modo</Label>
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
                                            <SelectTrigger id="theme">
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
                                <Label htmlFor="backgroundColor">
                                    Color de fondo
                                </Label>
                                <Input
                                    id="backgroundColor"
                                    type="color"
                                    defaultValue={data.backgroundColor}
                                    {...register('backgroundColor')}
                                />
                            </Field>

                            <Field className="flex flex-row">
                                <Label className="flex-3">
                                    Imagen de cabecera
                                </Label>
                                <Controller
                                    control={control}
                                    name="headerImage"
                                    defaultValue={data.headerImage}
                                    render={({
                                        field: { value, onChange },
                                    }) => (
                                        <section className="flex flex-7 flex-col">
                                            <section className="flex flex-col justify-center items-end h-[250px]">
                                                {value ? (
                                                    <Image
                                                        src={value}
                                                        alt=""
                                                        width={300}
                                                        height={100}
                                                    />
                                                ) : (
                                                    <section className="w-[75%] h-[200px] flex flex-col items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                                                        <CameraIcon className="w-16 h-16" />
                                                        Sin vista previa
                                                    </section>
                                                )}
                                            </section>
                                            <FormGalleryUploadImageComponent
                                                selectedImageUrl={value ?? ''}
                                                afterUpload={(result) => {
                                                    if (
                                                        result.status ===
                                                        'success'
                                                    )
                                                        onChange(
                                                            result.data.url
                                                        )
                                                }}
                                            />
                                        </section>
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
