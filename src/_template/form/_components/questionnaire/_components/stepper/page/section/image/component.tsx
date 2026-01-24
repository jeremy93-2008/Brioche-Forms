import { IVideo } from '@db/types'

interface IImageSectionComponentProps {
    data: IVideo
}

export function ImageSectionComponent(props: IImageSectionComponentProps) {
    const { data } = props

    return (
        <div className="w-full flex flex-col items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.url} alt={data.caption ?? ''} />
            <span className="mt-3">{data.caption}</span>
        </div>
    )
}
