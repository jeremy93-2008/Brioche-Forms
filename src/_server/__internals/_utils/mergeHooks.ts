import { IBasicEnv } from '@/_server/__internals/createServer'

export function mergeHooks(
    envHooks: IBasicEnv['hooks'],
    pluginHooks: Partial<IBasicEnv['hooks']>
) {
    for (const hookName in pluginHooks) {
        if (pluginHooks.hasOwnProperty(hookName)) {
            const hooksArray = pluginHooks[hookName as keyof typeof pluginHooks]
            if (Array.isArray(hooksArray)) {
                envHooks[hookName as keyof typeof envHooks].push(...hooksArray)
            }
        }
    }
}
