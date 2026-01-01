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
import { deleteChoicesSection } from '@/_server/domains/section/question/choices/deleteChoicesSection'
import z from 'zod'

const singleSchema = z.object({
    id: z.string().min(3),
    form_id: z.string().min(3),
})

const schema = z.object({
    form_id: z.string().min(3),
    data: z.array(singleSchema).min(1).max(30),
})

export type IDeleteChoiceSingle = z.infer<typeof singleSchema>
export type IDeleteChoices = z.infer<typeof schema>
export type IChoiceReturn = { ids: string[] }

async function deleteChoicesSectionHandler(
    _data: IDeleteChoices,
    ctx: IMiddlewaresAccessCtx<IDeleteChoices>,
    env: ServerEnv
): Promise<IReturnAction<IChoiceReturn>> {
    const validatedFields = ctx.validatedFields

    const validatedData = validatedFields.data! as IDeleteChoices
    const formId = validatedData.form_id!

    const result = await withFormContext(env)(formId, () =>
        deleteChoicesSection(validatedData.data)
    )

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    IDeleteChoices,
    IChoiceReturn,
    IMiddlewaresAccessCtx<IDeleteChoices>
>(deleteChoicesSectionHandler, [
    requireAuth(),
    requireValidation(schema),
    requireResourceAccess(['read', 'write', 'delete']),
])
