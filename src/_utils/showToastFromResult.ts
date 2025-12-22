import { ToastMessages } from '@/_constants/toast'
import { type IReturnAction } from '@/_server/_handlers/actions/types'
import { toast } from 'sonner'

export function showToastFromResult<T>(
    result: IReturnAction<T>,
    successMessage: string,
    errorMessage?: string
) {
    if (result.status === 'success') {
        toast.success(successMessage)
    } else if (result.status === 'error') {
        toast.error(
            errorMessage ?? result.error.message ?? ToastMessages.genericError
        )
        if (process.env.NODE_ENV !== 'production') {
            console.error(result.error.trace)
        }
    } else {
        toast.warning(ToastMessages.jokeWarning)
    }
}
