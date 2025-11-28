import { IReturnAction } from '@/_server/_actions/types'

export type IReturnState<T> = IReturnAction<T> | { status: 'loading' }
