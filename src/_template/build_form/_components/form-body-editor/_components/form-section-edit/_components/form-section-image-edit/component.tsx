import { Button } from '@/_components/ui/button'
import { Field, FieldSet } from '@/_components/ui/field'
import { Input } from '@/_components/ui/input'
import { Label } from '@/_components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/_components/ui/tabs'
import { ToastMessages } from '@/_constants/toast'
import { useServerActionState } from '@/_hooks/useServerActionState'
import EditImageAction from '@/_server/_handlers/actions/image/update'
import { IImageUploadResult } from '@/_server/_handlers/actions/image/upload'
import { IReturnAction } from '@/_server/_handlers/actions/types'

import { IFullForm } from '@/_server/domains/form/getFullForms'
import { FormGalleryUploadImageComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-image-edit/_components/form-gallery-upload-image/component'
import { showToastFromResult } from '@/_utils/showToastFromResult'
import { IImage } from '@db/types'
import { CameraIcon } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'

interface IFormSectionImageEditComponentProps {
    data: IFullForm['pages'][0]['sections'][0]['images'][0]
}

export function FormSectionImageEditComponent(
    props: IFormSectionImageEditComponentProps
) {
    const { data } = props

    const { register, formState, handleSubmit, resetField } = useForm<IImage>()

    const { isPending, runAction } = useServerActionState(EditImageAction)

    const [displayedImageUrl, setDisplayedImageUrl] = useState<string>(
        data.url || ''
    )

    const [activeTab, setActiveTab] = useState<'upload' | 'url'>('url')

    const onSaveContent = async (fields: IImage) => {
        const result = await runAction({
            id: data.id,
            form_id: data.form_id,
            section_id: data.section_id,
            url: fields.url,
            caption: fields.caption,
            order: fields.order,
        } as IImage)

        setDisplayedImageUrl(fields.url || '')

        showToastFromResult(result, ToastMessages.genericSuccess)
    }

    const afterUpload = (result: IReturnAction<IImageUploadResult>) => {
        if (result.status === 'success') {
            setDisplayedImageUrl(result.data.image_url)
            setActiveTab('url')
            resetField('url', { defaultValue: result.data.image_url })
        }
    }

    return (
        <FieldSet className="relative flex-col">
            <section className="absolute flex justify-end -top-8 right-0">
                <Button
                    onClick={handleSubmit(onSaveContent)}
                    className="mb-4"
                    size="sm"
                    isLoading={isPending}
                    disabled={!formState.isDirty}
                >
                    Guardar
                </Button>
            </section>
            <input type="hidden" id="id" value={data.id} {...register('id')} />
            <input
                type="hidden"
                id="form_id"
                value={data.form_id}
                {...register('form_id')}
            />
            <input
                type="hidden"
                id="section_id"
                value={data.section_id}
                {...register('section_id')}
            />
            <input
                type="hidden"
                id="order"
                value={data.order}
                {...register('order')}
            />
            <section className="flex justify-center mb-4">
                {displayedImageUrl ? (
                    <section className="flex flex-col">
                        <Label
                            className="block text-sm font-medium mt-2 mb-1"
                            htmlFor="url-image"
                        >
                            Imagen actual
                        </Label>
                        <img
                            className="rounded-lg"
                            src={displayedImageUrl}
                            alt="Image Preview"
                            width={400}
                            height={300}
                        />
                    </section>
                ) : (
                    <section className="w-[400px] h-[300px] flex flex-col items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                        <CameraIcon className="w-16 h-16" />
                        No Image Preview
                    </section>
                )}
            </section>
            <section className="flex justify-center mb-4 items-end gap-6">
                <Tabs
                    value={activeTab}
                    onValueChange={
                        setActiveTab as Dispatch<SetStateAction<string>>
                    }
                    className="flex-1"
                    defaultValue="url"
                >
                    <TabsList>
                        <TabsTrigger value="upload">
                            Galería / Subir imagen
                        </TabsTrigger>
                        <TabsTrigger value="url">Usar enlace</TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="upload"
                        className="flex flex-1 w-[40vw] flex-col gap-4"
                    >
                        <FormGalleryUploadImageComponent
                            data={data}
                            afterUpload={afterUpload}
                        />
                    </TabsContent>
                    <TabsContent
                        value="url"
                        className="flex flex-1 w-[40vw] flex-col gap-4"
                    >
                        <Field>
                            <Label
                                className="block text-sm font-medium mb-1"
                                htmlFor="url-image"
                            >
                                Enlace de la imagen
                            </Label>
                            <Input
                                id="url-image"
                                className="text-primary"
                                defaultValue={data.url}
                                {...register('url')}
                            />
                        </Field>
                    </TabsContent>
                </Tabs>
                <Field>
                    <Label
                        className="block text-sm font-medium mb-1"
                        htmlFor="caption-image"
                    >
                        Leyenda de la imagen
                    </Label>
                    <Input
                        id="caption-image"
                        defaultValue={data.caption ?? ''}
                        {...register('caption')}
                    />
                </Field>
            </section>
        </FieldSet>
    )
}
