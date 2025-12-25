import { SQL } from 'drizzle-orm/sql/sql'

export type IFieldsWhere<T> = {
    [key in keyof T]?: IFieldsWhereSingle<T>
}

export type IFieldsWhereSingle<T> = {
    value: T[keyof T]
    comparison: (...args: any[]) => SQL<unknown>
}
