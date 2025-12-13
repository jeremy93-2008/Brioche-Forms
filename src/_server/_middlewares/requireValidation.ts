import { IMapCtx } from '@/_server/__internals/types'
import { ZodObject, ZodSafeParseResult } from 'zod'

export function requireValidation<TCtx extends IValidationCtx<any>>(
    schema: ZodObject
) {
    return async function executeValidation<TData>(
        data: TData,
        ctx: IMapCtx<TCtx>
    ) {
        const validatedFields = schema.safeParse(data)
        ctx.set('validatedFields', validatedFields)
        if (!validatedFields.success) {
            return {
                status: 'error',
                error: {
                    message: validatedFields.error.message,
                },
            } as const
        }
    }
}

export type IValidationCtx<T> = {
    validatedFields: ZodSafeParseResult<T>
}
