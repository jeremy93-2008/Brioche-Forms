import { IReturnState } from '@/_hooks/useServerAction/types'
import { IReturnAction } from '@/_server/_actions/types'
import { useState } from 'react'

export function useServerAction<K, T>(
    serverFn: (arg: K) => Promise<IReturnAction<T>>,
    initialState: IReturnState<T>,
    afterCallback?: (data: IReturnState<T>) => void
) {
    const [actionState, setActionState] =
        useState<IReturnState<T>>(initialState)

    const runAction = async (arg: K) => {
        setActionState({ status: 'loading' })
        const result = await serverFn(arg)
        setActionState(result)
        if (afterCallback) {
            afterCallback(result)
        }
    }

    return {
        isPending: actionState.status === 'loading',
        runAction,
        handleAction: (arg: K) => () => runAction(arg),
        actionState,
    }
}

export const initialServerState: IReturnState<any> = {
    status: 'idle',
}
