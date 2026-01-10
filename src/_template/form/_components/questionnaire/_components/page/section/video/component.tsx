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
            <iframe src={getVideoEmbedUrl(data.url)} />
            <span>{data.caption}</span>
        </div>
    )
}
