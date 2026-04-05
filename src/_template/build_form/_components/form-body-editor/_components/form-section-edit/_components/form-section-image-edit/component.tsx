import { FormGalleryUploadImageComponent } from '@/_components/shared/form-gallery-upload-image/component.client'
import { Field, FieldSet } from '@/_components/ui/field'
import { Input } from '@/_components/ui/input'
import { Label } from '@/_components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/_components/ui/tabs'
import { AutoSaveContext } from '@/_provider/auto-save/auto-save-provider'
import { IMediaUploadResult } from '@/_server/_handlers/actions/media/upload'
import { IReturnAction } from '@/_server/_handlers/actions/types'

import { IFullForm } from '@/_server/domains/form/getFullForms'
import { IImage } from '@db/types'
import { clsx } from 'clsx'
import { CameraIcon } from 'lucide-react'
import { Dispatch, SetStateAction, use, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

interface IFormSectionImageEditComponentProps {
    data: IFullForm['pages'][0]['sections'][0]['images'][0]
}

export function FormSectionImageEditComponent(
    props: IFormSectionImageEditComponentProps
) {
    const { data } = props
    const { markDirty, markDirtyAndFlush } = use(AutoSaveContext)

    const { register, setValue, getValues } = useForm<IImage>({
        defaultValues: {
            id: data.id,
            section_id: data.section_id,
            form_id: data.form_id,
            order: data.order,
            url: data.url,
            caption: data.caption,
        },
    })

    const [displayedImageUrl, setDisplayedImageUrl] = useState<string>(
        data.url || ''
    )

    const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload')

    const buildDirtyEntry = useCallback(() => {
        const fields = getValues()
        return {
            type: 'image' as const,
            id: data.id,
            formId: data.form_id,
            sectionId: data.section_id,
            payload: {
                id: fields.id,
                form_id: fields.form_id,
                section_id: fields.section_id,
                url: fields.url,
                caption: fields.caption,
                order: fields.order,
            },
        }
    }, [data.id, data.form_id, data.section_id, getValues])

    const onLinkInputBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
        setDisplayedImageUrl(evt.currentTarget.value)
        markDirtyAndFlush(buildDirtyEntry())
    }

    const afterUpload = (result: IReturnAction<IMediaUploadResult>) => {
        if (result.status === 'success') {
            setDisplayedImageUrl(result.data.url)
            setValue('url', result.data.url, { shouldDirty: true })
            markDirtyAndFlush(buildDirtyEntry())
        }
    }

    return (
        <FieldSet className="relative flex-col">
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
                <section className="">
                    {displayedImageUrl ? (
                        <section className="flex flex-col h-[450px]">
                            <Label
                                className="block text-sm font-medium mt-2 mb-1"
                                htmlFor="url-image"
                            >
                                Imagen actual
                            </Label>
                            <img
                                className="rounded-lg h-full w-full object-contain"
                                src={displayedImageUrl}
                                alt="Image Preview"
                            />
                        </section>
                    ) : (
                        <section className="w-[480px] h-[420px] flex flex-col items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                            <CameraIcon className="w-16 h-16" />
                            Sin vista previa
                        </section>
                    )}
                </section>
            </section>
            <section className="flex justify-center mb-4 items-end gap-6">
                <Tabs
                    value={activeTab}
                    onValueChange={
                        setActiveTab as Dispatch<SetStateAction<string>>
                    }
                    className="flex-1"
                >
                    <TabsList>
                        <TabsTrigger value="upload">Usar galería</TabsTrigger>
                        <TabsTrigger value="url">Usar enlace</TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="upload"
                        className="flex flex-1 w-[40vw] flex-col gap-4"
                    >
                        <FormGalleryUploadImageComponent
                            selectedImageUrl={displayedImageUrl}
                            afterUpload={afterUpload}
                        />
                    </TabsContent>
                    <TabsContent
                        value="url"
                        className={clsx(
                            'flex flex-1 w-[40vw] flex-col gap-4',
                            activeTab !== 'url' ? 'hidden' : ''
                        )}
                        forceMount
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
                                {...register('url', {
                                    onBlur: onLinkInputBlur,
                                })}
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
                        {...register('caption', {
                            onChange: () => markDirty(buildDirtyEntry()),
                        })}
                    />
                </Field>
            </section>
        </FieldSet>
    )
}
