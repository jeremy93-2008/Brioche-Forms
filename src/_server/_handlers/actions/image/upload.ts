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
import { IImage } from '@db/types'

interface IImageUpload {
    id: string
    form_id: string
}

async function uploadImageSectionHandler(
    _data: FormData,
    ctx: IMiddlewaresAccessCtx<IImageUpload>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IImageUpload>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Partial<IImage>
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, () =>
        editImageSection(data)
    )

    return { status: 'success', data: result }
}

export default defineServerRequest<
    FormData,
    Partial<IImageUpload>,
    IMiddlewaresAccessCtx<IImageUpload>
>(uploadImageSectionHandler, [
    requireAuth(),
    requireResourceAccess(['read', 'write']),
])
