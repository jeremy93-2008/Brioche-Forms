import { ToastMessages } from '@/_constants/toast'
import { type IReturnAction } from '@/_server/_handlers/actions/types'

export function showLogFromResult<T>(
    result: IReturnAction<T>,
    successMessage: string,
    errorMessage?: string
) {
    if (process.env.NODE_ENV == 'production') return
    if (result.status === 'success') {
        console.log(successMessage)
    } else if (result.status === 'error') {
        console.error(errorMessage, result.error.trace)
    } else {
        console.warn(ToastMessages.jokeWarning)
    }
}
