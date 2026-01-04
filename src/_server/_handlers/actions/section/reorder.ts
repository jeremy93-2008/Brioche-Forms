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
import { editSectionOrders } from '@/_server/domains/section/editSectionOrders'
import { z } from 'zod'

const schema = z.object({
    form_id: z.string().min(3),
    updates: z
        .array(
            z.object({
                id: z.string().min(3),
                order: z.string().min(1),
                page_id: z.string().min(3).optional(), // For cross-page moves
            })
        )
        .min(1)
        .max(100),
})

export type ISectionReorderInput = z.infer<typeof schema>
export type ISectionReorderReturn = { updated: number }

async function reorderSectionsHandler(
    _data: ISectionReorderInput,
    ctx: IMiddlewaresAccessCtx<ISectionReorderInput>,
    env: ServerEnv
): Promise<IReturnAction<ISectionReorderReturn>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Required<ISectionReorderInput>
    const { form_id, updates } = data

    const result = await withFormContext(env)(form_id, () =>
        editSectionOrders(form_id, updates)
    )

    return { status: 'success', data: result }
}

export default defineServerRequest<
    ISectionReorderInput,
    ISectionReorderReturn,
    IMiddlewaresAccessCtx<ISectionReorderInput>
>(reorderSectionsHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write']),
])
