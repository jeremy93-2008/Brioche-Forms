'use server'
import {
    defineServerRequest,
    IMiddlewaresAccessCtx,
    ServerEnv,
} from '@/_server/__internals/defineServerRequest'
import { type IReturnAction } from '@/_server/_handlers/actions/types'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireResourceAccess } from '@/_server/_middlewares/requireResourceAccess'
import { withFormContext } from '@/_server/domains/_context/form/withFormContext'
import { editImageSection } from '@/_server/domains/section/image/editImageSection'
import { put } from '@vercel/blob'

export interface IImageUpload {
    id: string
    form_id: string
    upload_image?: File
}

export interface IImageUploadResult {
    id: string
    form_id: string
    image_url: string
}

async function uploadImageSectionHandler(
    data: IImageUpload,
    _ctx: IMiddlewaresAccessCtx<IImageUpload>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IImageUploadResult>>> {
    if (!data.upload_image) throw new Error('No image file provided')

    // Here you would handle the file upload logic
    const blob = await put(data.upload_image.name, data.upload_image, {
        access: 'public',
        addRandomSuffix: true,
    })
    const imageUrl = blob.url

    const result = await withFormContext(env)(data.form_id, () =>
        editImageSection({
            id: data.id,
            form_id: data.form_id,
            url: imageUrl,
        })
    )

    return {
        status: 'success',
        data: {
            id: result.id,
            form_id: data.form_id,
            image_url: imageUrl,
        },
    }
}

export default defineServerRequest<
    FormData,
    IImageUpload,
    IImageUploadResult,
    IMiddlewaresAccessCtx<IImageUpload>
>(uploadImageSectionHandler, [
    requireAuth(),
    requireResourceAccess(['read', 'write']),
])
