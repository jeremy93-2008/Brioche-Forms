export type IReturnAction<T> =
    | IReturnActionIdle
    | IReturnActionOnSuccess<T>
    | IReturnActionOnError

export type IReturnActionIdle = {
    status: 'idle'
}

export type IReturnActionOnSuccess<T> = {
    status: 'success'
    data: T
}

export type IReturnActionOnError = {
    status: 'error'
    error: { message: string }
}
