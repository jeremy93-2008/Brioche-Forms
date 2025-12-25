'use server'

import {
    defineServerRequest,
    IMiddlewaresCtx,
} from '@/_server/__internals/defineServerRequest'
import type { IReturnAction } from '@/_server/_handlers/actions/types'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { getMedias } from '@/_server/domains/media/getMedias'
import { eq, like } from 'drizzle-orm'
import z from 'zod'
import { IMedia } from '../../../../../db/schema'

const schema = z
    .object({
        id: z.string().min(3),
        url: z.string().min(1).max(255).optional(),
        form_id: z.string().min(3).optional(),
    })
    .partial()

export type IMediaWhere = z.infer<typeof schema>

async function getMediasHandler(
    _data: Partial<IMediaWhere>,
    ctx: IMiddlewaresCtx<Partial<IMediaWhere>>
): Promise<IReturnAction<IMedia[]>> {
    const user = ctx.user
    const validateFields = ctx.validatedFields.data

    const result = await getMedias(user, {
        id: {
            comparison: eq,
            value: validateFields?.id ? validateFields.id : undefined,
        },
        url: {
            comparison: like,
            value: validateFields?.url ? validateFields.url : undefined,
        },
        form_id: {
            comparison: eq,
            value: validateFields?.form_id ? validateFields.form_id : undefined,
        },
    })

    return { status: 'success', data: result }
}

export default defineServerRequest<
    Partial<IMediaWhere>,
    IMedia[],
    IMiddlewaresCtx<IMedia>
>(getMediasHandler, [requireAuth(), requireValidation(schema)])
