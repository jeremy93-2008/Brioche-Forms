import { IReturnAction } from '@/_server/_handlers/actions/types'
import GetMedias from '@/_server/_handlers/queries/media/get'
import { IMedia } from '@db/types'

export const http_api = {
    media: {
        get: { _key: 'media.get', fn: GetMedias } as ISingleApiRequest<
            IMedia[],
            Partial<IMedia>
        >,
    },
} as const

// Types
export type ISingleApiRequest<TData = any, TInput = any> = {
    _key: string
    fn: (args: TInput | undefined) => Promise<IReturnAction<TData>>
}
