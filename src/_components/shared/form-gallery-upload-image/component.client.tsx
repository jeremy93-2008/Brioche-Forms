import { FormGalleryMediaDeleteItem } from '@/_components/shared/form-gallery-upload-image/form-gallery-media-delete-item/component.client'
import { Button } from '@/_components/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/_components/ui/collapsible'
import { Field } from '@/_components/ui/field'
import { Input } from '@/_components/ui/input'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/_components/ui/tooltip'
import { ToastMessages } from '@/_constants/toast'
import { useAsyncApi } from '@/_hooks/useAsyncApi/useAsyncApi'
import { useServerActionState } from '@/_hooks/useServerActionState'
import { http_api } from '@/_lib/http_api'

import UploadMediaAction, {
    IMediaUploadResult,
} from '@/_server/_handlers/actions/media/upload'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import { showToastFromResult } from '@/_utils/showToastFromResult'
import { IMedia } from '@db/types'
import { ChevronsUpDown, Circle, CircleCheckBig } from 'lucide-react'
import Image from 'next/image'
import { FormEvent, useState } from 'react'

interface IFormGalleryUploadImageComponentProps {
    selectedImageUrl: string
    afterUpload: (result: IReturnAction<IMediaUploadResult>) => void
}

export function FormGalleryUploadImageComponent(
    props: IFormGalleryUploadImageComponentProps
) {
    const { selectedImageUrl, afterUpload } = props
    const { isPending, runAction } = useServerActionState<
        FormData,
        IMediaUploadResult
    >(UploadMediaAction)

    const { result: mediasResult, mutate } = useAsyncApi(http_api.media.get, {})

    const [isUploadEnabled, setIsUploadEnabled] = useState<boolean>(false)

    const onChangeFile = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const files = evt.currentTarget.files
        setIsUploadEnabled(!!files && files.length > 0)
    }

    const handleSelectFile =
        (item: Partial<IMedia>) => (evt: React.MouseEvent) => {
            evt.preventDefault()
            evt.stopPropagation()
            afterUpload({
                status: 'success',
                data: {
                    id: item.id!,
                    url: item.url ?? '',
                },
            })
        }

    const onSaveUpload = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        const fd = new FormData(evt.currentTarget)
        const result = await runAction(fd)

        afterUpload(result)

        showToastFromResult(result, ToastMessages.genericSuccess)

        await mutate()
    }

    return (
        <section className="flex flex-col">
            <form onSubmit={onSaveUpload}>
                <Collapsible defaultOpen={false}>
                    <CollapsibleTrigger className="flex items-center justify-between mb-2 w-full cursor-pointer">
                        <section className="flex items-baseline">
                            <h3 className="text-xs mt-2 mb-2">Galería</h3>
                            <sub className="ml-1 text-[10px]">
                                (
                                {mediasResult?.status === 'success'
                                    ? mediasResult.data.length
                                    : 0}{' '}
                                Imágenes disponibles)
                            </sub>
                        </section>
                        <ChevronsUpDown className="w-4! h-4!" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <section className="flex flex-wrap gap-1 overflow-y-auto mt-1 mb-3 py-2 px-3 max-h-96 border border-b-4 rounded-lg">
                            {mediasResult?.status === 'success' &&
                                mediasResult.data.map((item) => (
                                    <div
                                        onClick={handleSelectFile(item)}
                                        key={item.id}
                                        className="group relative w-[31%] cursor-pointer aspect-square hover:bg-border rounded-lg"
                                    >
                                        <Image
                                            src={item.url}
                                            alt={item.url || 'Image'}
                                            fill
                                            className="object-contain px-3 py-3 "
                                        />
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <section className="absolute hidden group-hover:block left-2 top-2">
                                                    <FormGalleryMediaDeleteItem
                                                        afterDelete={() =>
                                                            mutate()
                                                        }
                                                        item={item}
                                                    />
                                                </section>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Borrar la imagen
                                            </TooltipContent>
                                        </Tooltip>
                                        {selectedImageUrl === item.url ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <CircleCheckBig
                                                        onClick={handleSelectFile(
                                                            {}
                                                        )}
                                                        className="absolute right-2 top-2 text-green-500"
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Deseleccionar esta imagen
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Circle
                                                        onClick={handleSelectFile(
                                                            item
                                                        )}
                                                        className="absolute hidden group-hover:block right-2 top-2 text-gray-400 hover:text-gray-200"
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Seleccionar esta imagen
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>
                                ))}
                        </section>
                    </CollapsibleContent>
                </Collapsible>
                <section className="flex items-end gap-2">
                    <Field>
                        <Input
                            id="upload_media"
                            name="upload_media"
                            className="text-primary"
                            type="file"
                            accept=".jpg, .jpeg, .png, .svg, .webp, .gif"
                            onChange={onChangeFile}
                        />
                    </Field>
                    <Button
                        isLoading={isPending}
                        type="submit"
                        disabled={!isUploadEnabled}
                    >
                        Subir
                    </Button>
                </section>
            </form>
        </section>
    )
}
