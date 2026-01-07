import {
    IReturnState,
    useServerActionState,
} from '@/_hooks/useServerActionState'
import createFormAction from '@/_server/_handlers/actions/form/create'
import { IForm } from '@db/types'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface IUseServerActionCreateFormReturn {
    redirectToNewForm?: boolean
}

export function useServerActionCreateForm(
    params?: IUseServerActionCreateFormReturn
) {
    const { redirectToNewForm = true } = params || {}
    const router = useRouter()

    const afterCallback = (state: IReturnState<Partial<IForm>>) => {
        if (!redirectToNewForm) return
        if (state.status === 'success') {
            router.push('/form/' + state.data.id)
        } else if (state.status === 'error') {
            toast.error('Error al crear el formulario: ' + state.error?.message)
        }
    }

    return useServerActionState<Partial<IForm>>(createFormAction, afterCallback)
}
