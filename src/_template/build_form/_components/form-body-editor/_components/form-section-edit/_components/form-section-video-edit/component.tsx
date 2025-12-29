import { Button } from '@/_components/ui/button'
import { Field, FieldSet } from '@/_components/ui/field'
import { Input } from '@/_components/ui/input'
import { Label } from '@/_components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/_components/ui/select'
import { ToastMessages } from '@/_constants/toast'
import { useServerActionState } from '@/_hooks/useServerActionState'
import EditVideoAction from '@/_server/_handlers/actions/video/update'
import { useVideoEmbedUrl } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-video-edit/_hooks/useVideoEmbedUrl'
import { showToastFromResult } from '@/_utils/showToastFromResult'
import { IVideo } from '@db/types'
import {
    SiTwitch,
    SiVimeo,
    SiYoutube,
    SiYoutubeshorts,
} from '@icons-pack/react-simple-icons'
import { BlocksIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export type IVideoProvider =
    | 'youtube'
    | 'youtubeShort'
    | 'vimeo'
    | 'twitch'
    | 'other'

const PROVIDER_PLACEHOLDERS = {
    youtube: 'https://youtube.com/watch?v=... o https://youtu.be/...',
    youtubeShort: 'https://youtube.com/shorts/...',
    vimeo: 'https://vimeo.com/123456789',
    twitch: 'https://twitch.tv/videos/123456789',
    other: 'URL del video',
}

type IEditableVideo = Pick<IVideo, 'url' | 'caption'>

interface IFormSectionVideoEditComponentProps {
    data: IVideo
}

export function FormSectionVideoEditComponent(
    props: IFormSectionVideoEditComponentProps
) {
    const { data } = props

    const { getVideoEmbedUrl, checkProvider } = useVideoEmbedUrl()
    const { register, getValues, formState, handleSubmit } =
        useForm<IEditableVideo>({
            defaultValues: { url: data.url, caption: data.caption },
        })

    const [displayedVideoUrl, setDisplayedVideoUrl] = useState<string>(
        data.url ?? ''
    )
    const [selectedProvider, setSelectedProvider] = useState<IVideoProvider>(
        data.url ? checkProvider(data.url) : 'youtube'
    )

    const embeddedUrl = getVideoEmbedUrl(displayedVideoUrl, selectedProvider)

    const { isPending, runAction } = useServerActionState(EditVideoAction)

    const onSaveContent = async (fields: IEditableVideo) => {
        const result = await runAction({
            id: data.id,
            form_id: data.form_id,
            section_id: data.section_id,
            url: fields.url,
            caption: fields.caption,
            order: 'latest',
        } as IVideo)

        setDisplayedVideoUrl(fields.url)

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
            <section className="mt-4 mb-2 flex flex-wrap gap-1">
                <h4 className="text-sm ml-2">
                    Vista previa del video embebido
                </h4>
                <div className="mt-2 py-3 w-full min-h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {displayedVideoUrl && embeddedUrl ? (
                        <iframe width="50%" height="350px" src={embeddedUrl} />
                    ) : (
                        <span>No hay vista previa disponible</span>
                    )}
                </div>
            </section>
            <Field className="flex flex-row">
                <Select value={selectedProvider} disabled>
                    <SelectTrigger className="w-60 flex-0">
                        <SelectValue placeholder="Proveedor de video" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="youtube">
                            <SiYoutube />
                            YouTube
                        </SelectItem>
                        <SelectItem value="youtubeShort">
                            <SiYoutubeshorts />
                            YouTube Shorts
                        </SelectItem>
                        <SelectItem value="vimeo">
                            <SiVimeo />
                            Vimeo
                        </SelectItem>
                        <SelectItem value="twitch">
                            <SiTwitch />
                            Twitch
                        </SelectItem>
                        <SelectItem value="other">
                            <BlocksIcon />
                            Otro
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    className="flex flex-1"
                    placeholder={`Por ejemplo: ${PROVIDER_PLACEHOLDERS[selectedProvider]}`}
                    {...register('url', {
                        onChange: () => {
                            const urlField = getValues('url')
                            const inferredProvider = checkProvider(urlField)
                            if (inferredProvider) {
                                setSelectedProvider(inferredProvider)
                                setDisplayedVideoUrl(urlField)
                            }
                        },
                        onBlur: () => {
                            const urlField = getValues('url')
                            setDisplayedVideoUrl(urlField)
                        },
                    })}
                />
            </Field>
            <Field className="flex mt-1">
                <Label
                    className="block text-sm font-medium mb-1"
                    htmlFor="video-caption"
                >
                    Leyenda del vídeo (opcional)
                </Label>
                <Input
                    id="video-caption"
                    className="flex flex-1"
                    {...register('caption')}
                />
            </Field>
        </FieldSet>
    )
}
