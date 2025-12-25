'use server'
import {
    defineServerRequest,
    IMiddlewaresAccessCtx,
    ServerEnv,
} from '@/_server/__internals/defineServerRequest'
import { type IReturnAction } from '@/_server/_handlers/actions/types'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { createMedia } from '@/_server/domains/media/createMedia'
import { put } from '@vercel/blob'

export interface IMediaUpload {
    upload_media?: File
}

export interface IMediaUploadResult {
    id: string
    url: string
}

async function uploadMediaHandler(
    data: IMediaUpload,
    ctx: IMiddlewaresAccessCtx<IMediaUpload>,
    _env: ServerEnv
): Promise<IReturnAction<Partial<IMediaUploadResult>>> {
    if (!data.upload_media) throw new Error('No media file provided')

    // Here you would handle the file upload logic
    const blob = await put(data.upload_media.name, data.upload_media, {
        access: 'public',
        addRandomSuffix: true,
    })
    const mediaUrl = blob.url

    // Create media record in the database
    const result = await createMedia(ctx.user, {
        url: mediaUrl,
        type: 'image',
    })

    // Return the result
    return {
        status: 'success',
        data: {
            id: result.id,
            url: mediaUrl,
        },
    }
}

export default defineServerRequest<
    FormData,
    IMediaUpload,
    IMediaUploadResult,
    IMiddlewaresAccessCtx<IMediaUpload>
>(uploadMediaHandler, [requireAuth()])
