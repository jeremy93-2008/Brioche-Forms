'use client'
import React, { createContext } from 'react'
import { CurrentUser, useUser } from '@stackframe/stack'

function useProtectedPage() {
    const user = useUser({ or: 'redirect' })

    return { currentUser: user }
}

export const ProtectedPageContext = createContext<CurrentUser | null>(null)

export function ProtectedPage(props: React.PropsWithChildren) {
    const user = useProtectedPage().currentUser

    return (
        <ProtectedPageContext value={user}>
            {props.children}
        </ProtectedPageContext>
    )
}
