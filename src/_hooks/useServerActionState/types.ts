import { IReturnAction } from '@/_server/actions/types'

export type IReturnState<T> = IReturnAction<T> | { status: 'loading' }
