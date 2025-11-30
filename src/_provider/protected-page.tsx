import { stackServerApp } from '@/_stack/server'
import React from 'react'

export async function ProtectedPage(props: React.PropsWithChildren) {
    await stackServerApp.getUser({ or: 'redirect' })

    return props.children
}
