'use client'
import { IFullForm } from '@/_server/queries/form/get'
import React, { createContext } from 'react'

export const SingleFormSelectedContext = createContext<IFullForm | null>(null)

interface IFormSelectedProviderProps extends React.PropsWithChildren {
    value: IFullForm
}

export function SingleFormSelectedProvider(props: IFormSelectedProviderProps) {
    const { value } = props
    return (
        <SingleFormSelectedContext value={value}>
            {props.children}
        </SingleFormSelectedContext>
    )
}
