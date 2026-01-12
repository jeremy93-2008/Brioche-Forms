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
import { deleteVideoSection } from '@/_server/domains/section/video/deleteVideoSection'
import z from 'zod'

const schema = z.object({
    id: z.string().min(3),
    form_id: z.string().min(3),
})

export type IDeleteVideo = z.infer<typeof schema>

async function deleteVideoSectionHandler(
    _data: Partial<IDeleteVideo>,
    ctx: IMiddlewaresAccessCtx<IDeleteVideo>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IDeleteVideo>>> {
    const validatedFields = ctx.validatedFields

    const data = validatedFields.data! as IDeleteVideo
    const formId = data.form_id!

    const result = await withFormBuildContext(env)(formId, () =>
        deleteVideoSection(data)
    )

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<IDeleteVideo>,
    IMiddlewaresAccessCtx<IDeleteVideo>
>(deleteVideoSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write', 'delete']),
])
