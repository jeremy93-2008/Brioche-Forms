import { ServerEnv } from '@/_server/__internals/defineServerRequest'

export function withFormContext(env: ServerEnv) {
    return async <T>(
        formId: string,
        callback: () => T | Promise<T>
    ): Promise<T> => {
        const result = await callback()
        await env.events.dispatch('formUpdated', formId)
        return result
    }
}
