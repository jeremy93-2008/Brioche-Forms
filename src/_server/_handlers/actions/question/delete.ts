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
import { deleteQuestionSection } from '@/_server/domains/section/question/deleteQuestionSection'
import z from 'zod'

const schema = z.object({
    id: z.string().min(3),
    form_id: z.string().min(3),
})

export type IDeleteQuestion = z.infer<typeof schema>

async function deleteQuestionSectionHandler(
    _data: Partial<IDeleteQuestion>,
    ctx: IMiddlewaresAccessCtx<IDeleteQuestion>,
    env: ServerEnv
): Promise<IReturnAction<Partial<IDeleteQuestion>>> {
    const validatedFields = ctx.validatedFields

    const data = validatedFields.data! as IDeleteQuestion
    const formId = data.form_id!

    const result = await withFormContext(env)(formId, () =>
        deleteQuestionSection(data)
    )

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<IDeleteQuestion>,
    IMiddlewaresAccessCtx<IDeleteQuestion>
>(deleteQuestionSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write', 'delete']),
])
