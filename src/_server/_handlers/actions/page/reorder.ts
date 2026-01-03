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
import { batchUpdatePageOrders } from '@/_server/domains/page/batchUpdatePageOrders'
import { z } from 'zod'

const schema = z.object({
    form_id: z.string().min(3),
    updates: z
        .array(
            z.object({
                id: z.string().min(3),
                order: z.string().min(1),
            })
        )
        .min(1)
        .max(100),
})

export type IPageReorderInput = z.infer<typeof schema>
export type IPageReorderReturn = { updated: number }

async function reorderPagesHandler(
    _data: IPageReorderInput,
    ctx: IMiddlewaresAccessCtx<IPageReorderInput>,
    env: ServerEnv
): Promise<IReturnAction<IPageReorderReturn>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Required<IPageReorderInput>
    const { form_id, updates } = data

    const result = await withFormContext(env)(form_id, () =>
        batchUpdatePageOrders(form_id, updates)
    )

    return { status: 'success', data: result }
}

export default defineServerRequest<
    IPageReorderInput,
    IPageReorderReturn,
    IMiddlewaresAccessCtx<IPageReorderInput>
>(reorderPagesHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])