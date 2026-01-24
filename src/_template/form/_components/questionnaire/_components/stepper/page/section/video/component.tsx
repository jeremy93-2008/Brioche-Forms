import { useVideoEmbedUrl } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-video-edit/_hooks/useVideoEmbedUrl'
import { IVideo } from '@db/types'

interface IVideoSectionComponentProps {
    data: IVideo
}

export function VideoSectionComponent(props: IVideoSectionComponentProps) {
    const { data } = props

    const { getVideoEmbedUrl } = useVideoEmbedUrl()

    return (
        <div className="w-full flex flex-col items-center justify-center p-4">
            <iframe
                className="w-2/3 min-w-[460px] min-h-[380px] h-[20vh]"
                src={getVideoEmbedUrl(data.url)}
            />
            <span className="mt-3">{data.caption}</span>
        </div>
    )
}
