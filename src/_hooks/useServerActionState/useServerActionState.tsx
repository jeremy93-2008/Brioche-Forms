import {
    IReturnState,
    IUseServerActionStateReturn,
    IUseServerActionUniqueStateReturn,
} from '@/_hooks/useServerActionState/types'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import { useState } from 'react'

/**
 * React hook to manage the lifecycle of a typed server action.
 *
 * It keeps track of the current action state (idle/loading/success/error),
 * exposes a `runAction` function to trigger the server action, and a
 * `handleAction` helper ready to be used directly in event handlers (e.g. onClick).
 *
 * @template K - Type of the argument ansd payload passed to the server action.
 * @param serverFn - Server action function that receives an argument of type K and returns an IReturnAction<T>.
 * @param afterCallback - Optional callback invoked after each server action completion with the final state.
 * @param initialState - Optional initial action state before any request is made.
 * @returns An object with:
 * - `isPending`: boolean flag indicating if the action is currently in 'loading' state.
 * - `runAction`: function to trigger the server action imperatively.
 * - `handleAction`: curried version of runAction, convenient for event handlers.
 * - `actionState`: the latest IReturnState<T> representing the action result.
 */
export function useServerActionState<K>(
    serverFn: (arg: K) => Promise<IReturnAction<K>>,
    afterCallback?: (data: IReturnState<K>) => void,
    initialState?: IReturnState<K>
): IUseServerActionUniqueStateReturn<K>

/**
 * React hook to manage the lifecycle of a typed server action.
 *
 * It keeps track of the current action state (idle/loading/success/error),
 * exposes a `runAction` function to trigger the server action, and a
 * `handleAction` helper ready to be used directly in event handlers (e.g. onClick).
 *
 * @template K - Type of the argument passed to the server action.
 * @template T - Type of the successful payload returned by the server action.
 * @param serverFn - Server action function that receives an argument of type K and returns an IReturnAction<T>.
 * @param afterCallback - Optional callback invoked after each server action completion with the final state.
 * @param initialState - Optional initial action state before any request is made.
 * @returns An object with:
 * - `isPending`: boolean flag indicating if the action is currently in 'loading' state.
 * - `runAction`: function to trigger the server action imperatively.
 * - `handleAction`: curried version of runAction, convenient for event handlers.
 * - `actionState`: the latest IReturnState<T> representing the action result.
 */
export function useServerActionState<K, T>(
    serverFn: (arg: K) => Promise<IReturnAction<T>>,
    afterCallback?: (data: IReturnState<T>) => void,
    initialState?: IReturnState<T>
): IUseServerActionStateReturn<K, T> {
    const [actionState, setActionState] = useState<IReturnState<T>>(
        initialState ?? { status: 'idle' }
    )

    const runAction = async (arg: K) => {
        try {
            setActionState({ status: 'loading' })
            const result = await serverFn(arg)
            setActionState(result)
            if (afterCallback) {
                afterCallback(result)
            }
            return result
        } catch (error: unknown) {
            const errorMessage = {
                status: 'error',
                error: {
                    message:
                        typeof error === 'string'
                            ? error
                            : error instanceof Error
                              ? error.message
                              : 'Fatal error',
                },
            } as const
            setActionState(errorMessage)
            if (afterCallback) {
                afterCallback(errorMessage)
            }
            return errorMessage
        }
    }

    return {
        isPending: actionState.status === 'loading',
        runAction,
        handleAction: (arg: K) => () => runAction(arg),
        actionState,
    }
}
