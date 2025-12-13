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
import { withFormContext } from '@/_server/domains/_context/form/withFormContext'
import { deletePage } from '@/_server/domains/page/deletePage'
import z from 'zod'

const schema = z.object({
    id: z.string().min(3),
    form_id: z.string().min(3),
})

export type IDeletePage = z.infer<typeof schema>

async function deletePageHandler(
    _data: Partial<IDeletePage>,
    ctx: IMiddlewaresAccessCtx<IDeletePage>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IDeletePage>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Required<IDeletePage>
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, () => deletePage(data))

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<IDeletePage>,
    IMiddlewaresAccessCtx<IDeletePage>
>(deletePageHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write', 'delete']),
])
