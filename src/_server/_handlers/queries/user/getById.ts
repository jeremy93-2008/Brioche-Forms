'use server'

import {
    defineServerRequest,
    IMiddlewaresCtx,
} from '@/_server/__internals/defineServerRequest'
import type { IReturnAction } from '@/_server/_handlers/actions/types'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { getUserById } from '@/_server/domains/user/getUserById'
import z from 'zod'

const schema = z.object({
    id: z.string().min(3),
})

export type IUserByIdRequest = z.infer<typeof schema>

export type IUserByIdResponse = {
    id: string
    name: string
    email: string
    profileImageUrl?: string
}

async function getUserHandlerById(
    _data: Partial<IUserByIdRequest>,
    ctx: IMiddlewaresCtx<Partial<IUserByIdRequest>>
): Promise<IReturnAction<IUserByIdResponse>> {
    const validateFields = ctx.validatedFields.data
    const userFound = await getUserById(validateFields?.id)

    return {
        status: 'success',
        data: {
            id: userFound.id,
            name: userFound.displayName ?? 'No name',
            email: userFound.primaryEmail ?? 'No email',
            profileImageUrl: userFound.profileImageUrl ?? undefined,
        },
    }
}

export default defineServerRequest<
    Partial<IUserByIdRequest>,
    IUserByIdResponse,
    IMiddlewaresCtx<IUserByIdRequest>
>(getUserHandlerById, [requireAuth(), requireValidation(schema)])
