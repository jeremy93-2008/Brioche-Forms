import { IVideoProvider } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-video-edit/component'

export function useVideoEmbedUrl() {
    const getVideoEmbedUrl = (
        url: string,
        provider: IVideoProvider = 'youtube'
    ) => {
        let embedUrl = ''

        if (provider === 'youtube') {
            const youtubeRegex =
                /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
            const match = url.match(youtubeRegex)
            if (match && match[1]) {
                embedUrl = `https://www.youtube.com/embed/${match[1]}`
            }
        } else if (provider === 'youtubeShort') {
            const youtubeShortsRegex =
                /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
            const match = url.match(youtubeShortsRegex)
            if (match && match[1]) {
                embedUrl = `https://www.youtube.com/embed/${match[1]}`
            }
        } else if (provider === 'vimeo') {
            const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/
            const match = url.match(vimeoRegex)
            if (match && match[1]) {
                embedUrl = `https://player.vimeo.com/video/${match[1]}`
            }
        } else if (provider === 'twitch') {
            const twitchRegex =
                /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/videos\/(\d+)/
            const match = url.match(twitchRegex)
            if (match && match[1]) {
                embedUrl = `https://player.twitch.tv/?video=${match[1]}&parent=example.com`
            }
        } else {
            embedUrl = url
        }

        return embedUrl
    }

    const checkProvider = (url: string): IVideoProvider => {
        if (
            url.toLowerCase().includes('youtube.com/shorts/') ||
            url.toLowerCase().includes('youtu.be/')
        ) {
            return 'youtubeShort'
        } else if (url.toLowerCase().includes('youtube.com')) {
            return 'youtube'
        } else if (url.toLowerCase().includes('vimeo.com')) {
            return 'vimeo'
        } else if (url.toLowerCase().includes('twitch.tv')) {
            return 'twitch'
        }
        return 'other'
    }

    return { getVideoEmbedUrl, checkProvider }
}
