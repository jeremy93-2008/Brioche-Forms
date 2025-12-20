import { Button } from '@/_components/ui/button'
import { Field, FieldSet } from '@/_components/ui/field'
import { Input } from '@/_components/ui/input'
import { Label } from '@/_components/ui/label'
import { ToastMessages } from '@/_constants/toast'
import { useServerActionState } from '@/_hooks/useServerActionState'
import EditImageAction from '@/_server/_handlers/actions/image/update'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { showToastFromResult } from '@/_utils/showToastFromResult'
import { IImage } from '@db/types'
import { CameraIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface IFormSectionImageEditComponentProps {
    data: IFullForm['pages'][0]['sections'][0]['images'][0]
}

export function FormSectionImageEditComponent(
    props: IFormSectionImageEditComponentProps
) {
    const { data } = props

    const [displayedImageUrl, setDisplayedImageUrl] = useState<string>(
        data.url || ''
    )

    const { register, formState, handleSubmit } = useForm<IImage>()
    const { isPending, runAction } = useServerActionState(EditImageAction)

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
                    <img
                        className="rounded-lg"
                        src={displayedImageUrl}
                        alt="Image Preview"
                        width={400}
                        height={300}
                    />
                ) : (
                    <section className="w-[400px] h-[300px] flex flex-col items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                        <CameraIcon className="w-16 h-16" />
                        No Image Preview
                    </section>
                )}
            </section>
            <Field className="mt-4 mb-2">
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
            <Field className="mb-4">
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
        </FieldSet>
    )
}
