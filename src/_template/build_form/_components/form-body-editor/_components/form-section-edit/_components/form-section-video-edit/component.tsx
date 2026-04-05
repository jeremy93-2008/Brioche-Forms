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
import { AutoSaveContext } from '@/_provider/auto-save/auto-save-provider'
import { useVideoEmbedUrl } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-video-edit/_hooks/useVideoEmbedUrl'
import { IVideo } from '@db/types'
import {
    SiTwitch,
    SiVimeo,
    SiYoutube,
    SiYoutubeshorts,
} from '@icons-pack/react-simple-icons'
import { BlocksIcon } from 'lucide-react'
import { use, useCallback, useState } from 'react'
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
    const { markDirty, markDirtyAndFlush } = use(AutoSaveContext)

    const { getVideoEmbedUrl, checkProvider } = useVideoEmbedUrl()
    const { register, getValues } = useForm<IEditableVideo>({
        defaultValues: { url: data.url, caption: data.caption },
    })

    const [displayedVideoUrl, setDisplayedVideoUrl] = useState<string>(
        data.url ?? ''
    )
    const [selectedProvider, setSelectedProvider] = useState<IVideoProvider>(
        data.url ? checkProvider(data.url) : 'youtube'
    )

    const embeddedUrl = getVideoEmbedUrl(displayedVideoUrl, selectedProvider)

    const buildDirtyEntry = useCallback(() => {
        const fields = getValues()
        return {
            type: 'video' as const,
            id: data.id,
            formId: data.form_id,
            sectionId: data.section_id,
            payload: {
                id: data.id,
                form_id: data.form_id,
                section_id: data.section_id,
                url: fields.url,
                caption: fields.caption,
                order: data.order,
            },
        }
    }, [data.id, data.form_id, data.section_id, data.order, getValues])

    return (
        <FieldSet className="relative flex-col">
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
                            setDisplayedVideoUrl(getValues('url'))
                            markDirtyAndFlush(buildDirtyEntry())
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
                    {...register('caption', {
                        onChange: () => markDirty(buildDirtyEntry()),
                    })}
                />
            </Field>
        </FieldSet>
    )
}
