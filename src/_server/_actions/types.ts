export type IReturnAction<T> =
    | { status: 'idle' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: { message: string } }
