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
import { deleteSection } from '@/_server/domains/section/deleteSection'
import z from 'zod'

const schema = z.object({
    id: z.string().min(3),
    form_id: z.string().min(3),
})

export type IDeleteSection = z.infer<typeof schema>

async function deleteSectionHandler(
    _data: Partial<IDeleteSection>,
    ctx: IMiddlewaresAccessCtx<IDeleteSection>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IDeleteSection>>> {
    const validatedFields = ctx.validatedFields
    const data = validatedFields.data! as Required<IDeleteSection>
    const formId = data.form_id!

    const result = await withFormBuildContext(env)(formId, () =>
        deleteSection(data)
    )

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<IDeleteSection>,
    IMiddlewaresAccessCtx<IDeleteSection>
>(deleteSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write', 'delete']),
])
