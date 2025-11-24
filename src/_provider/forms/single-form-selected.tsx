'use client'
import React, { createContext } from 'react'
import { type IForm } from '../../../db/schema'

export const SingleFormSelectedContext = createContext<IForm | null>(null)

interface IFormSelectedProviderProps extends React.PropsWithChildren {
    value: IForm
}

export function SingleFormSelectedProvider(props: IFormSelectedProviderProps) {
    const { value } = props
    return (
        <SingleFormSelectedContext value={value}>
            {props.children}
        </SingleFormSelectedContext>
    )
}
