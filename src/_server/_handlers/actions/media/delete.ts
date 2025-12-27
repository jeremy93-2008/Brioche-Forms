'use server'
import {
    defineServerRequest,
    IMiddlewaresAccessCtx,
    ServerEnv,
} from '@/_server/__internals/defineServerRequest'
import { type IReturnAction } from '@/_server/_handlers/actions/types'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { deleteMedia } from '@/_server/domains/media/deleteMedia'
import { getMedias } from '@/_server/domains/media/getMedias'
import { del } from '@vercel/blob'
import { eq } from 'drizzle-orm'
import z from 'zod'

const schema = z.object({
    id: z.string().min(3),
})

export type IDeleteMedia = z.infer<typeof schema> & { deleted?: boolean }

async function deleteMediaHandler(
    data: Partial<IDeleteMedia>,
    ctx: IMiddlewaresAccessCtx<IDeleteMedia>,
    _env: ServerEnv
): Promise<IReturnAction<Partial<IDeleteMedia>>> {
    const medias = await getMedias(ctx.user, {
        id: {
            comparison: eq,
            value: data.id!,
        },
    })

    if (medias.length > 0) {
        await del(medias[0].url)
    }

    const result = await deleteMedia(ctx.user, data.id!)

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<IDeleteMedia>,
    IMiddlewaresAccessCtx<IDeleteMedia>
>(deleteMediaHandler, [requireAuth(), requireValidation(schema)])
