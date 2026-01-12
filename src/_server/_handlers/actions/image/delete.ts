'use server'
import {
    defineServerRequest,
    IMiddlewaresAccessCtx,
    ServerEnv,
} from '@/_server/__internals/defineServerRequest'
import { type IReturnAction } from '@/_server/_handlers/actions/types'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireResourceAccess } from '@/_server/_middlewares/requireResourceAccess'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { withFormBuildContext } from '@/_server/domains/_context/form/withFormBuildContext'
import { deleteImageSection } from '@/_server/domains/section/image/deleteImageSection'
import z from 'zod'

const schema = z.object({
    id: z.string().min(3),
    form_id: z.string().min(3),
})

export type IDeleteImage = z.infer<typeof schema>

async function deleteImageSectionHandler(
    _data: Partial<IDeleteImage>,
    ctx: IMiddlewaresAccessCtx<IDeleteImage>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IDeleteImage>>> {
    const validatedFields = ctx.validatedFields

    const data = validatedFields.data! as IDeleteImage
    const formId = data.form_id!

    const result = await withFormBuildContext(env)(formId, () =>
        deleteImageSection(data)
    )

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<IDeleteImage>,
    IMiddlewaresAccessCtx<IDeleteImage>
>(deleteImageSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write', 'delete']),
])
