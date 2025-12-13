export interface IMapCtx<T> extends Iterable<[keyof T, T[keyof T]]> {
    get<P extends keyof T>(key: P): T[P] | undefined

    set<P extends keyof T>(key: P, value: T[P]): void

    has<P extends keyof T>(key: P): boolean

    forEach<P extends keyof T>(
        callbackfn: (value: T[P], key: P, map: Map<P, T>) => void,
        thisArg?: never
    ): void
    clear(): void

    delete<P extends keyof T>(key: P): boolean
}
