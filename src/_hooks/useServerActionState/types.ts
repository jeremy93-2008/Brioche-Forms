import { IReturnAction } from '@/_server/actions/types'

export type IReturnState<T> = IReturnAction<T> | { status: 'loading' }

export interface IUseServerActionUniqueStateReturn<K> {
    isPending: boolean
    runAction: (arg: K) => Promise<void>
    handleAction: (arg: K) => () => Promise<void>
    actionState: IReturnState<K>
}

export interface IUseServerActionStateReturn<K, T> {
    isPending: boolean
    runAction: (arg: K) => Promise<void>
    handleAction: (arg: K) => () => Promise<void>
    actionState: IReturnState<T>
}
