import { IReturnAction } from '@/_server/_handlers/actions/types'

export type IReturnState<T> = IReturnAction<T> | { status: 'loading' }

export interface IUseServerActionUniqueStateReturn<K> {
    isPending: boolean
    runAction: (arg: K) => Promise<IReturnAction<any>>
    handleAction: (arg: K) => () => Promise<IReturnAction<any>>
    actionState: IReturnState<K>
}

export interface IUseServerActionStateReturn<K, T> {
    isPending: boolean
    runAction: (arg: K) => Promise<IReturnAction<T>>
    handleAction: (arg: K) => () => Promise<IReturnAction<T>>
    actionState: IReturnState<T>
}
