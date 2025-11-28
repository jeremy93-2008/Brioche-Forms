import { ZodObject, ZodSafeParseResult } from 'zod'
import { IMapCtx } from '@/_server/_internals/types'

export function requireValidation<TCtx extends IValidationCtx<any>>(
    schema: ZodObject
) {
    return async <TData>(data: TData, ctx: IMapCtx<TCtx>) => {
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
