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
import { deleteTextSection } from '@/_server/domains/section/text/deleteTextSection'
import z from 'zod'

const schema = z.object({
    id: z.string().min(3),
    form_id: z.string().min(3),
})

export type IDeleteText = z.infer<typeof schema>

async function deleteTextSectionHandler(
    _data: Partial<IDeleteText>,
    ctx: IMiddlewaresAccessCtx<IDeleteText>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IDeleteText>>> {
    const validatedFields = ctx.validatedFields

    const data = validatedFields.data! as IDeleteText
    const formId = data.form_id!

    const result = await withFormBuildContext(env)(formId, () =>
        deleteTextSection(data)
    )

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<IDeleteText>,
    IMiddlewaresAccessCtx<IDeleteText>
>(deleteTextSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write', 'delete']),
])
