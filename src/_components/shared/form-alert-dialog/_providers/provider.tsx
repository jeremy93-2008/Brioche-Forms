'use client'

import {
    FormAlertDialogContext,
    IFormAlertDialogContext,
} from '@/_components/shared/form-alert-dialog/_context/context'
import { FormAlertDialogComponent } from '@/_components/shared/form-alert-dialog/component.client'
import { useState } from 'react'

interface IFormAlertDialogProviderProps extends React.PropsWithChildren {
    defaultOpen?: boolean
    type?: 'alert' | 'confirm'
    options?: {
        title?: string
        description?: string
        actionText?: string
        cancelText?: string
        icon?: React.ReactNode
    }
}

export function FormAlertDialogProvider(props: IFormAlertDialogProviderProps) {
    const { defaultOpen, type, options, children } = props

    const [state, setState] = useState<IFormAlertDialogContext>({
        isOpen: defaultOpen ?? false,
        onOpenChange: () => {},
        onDataChange: () => {},
        type: type ?? 'alert',
        title: '',
        description: '',
        promiseWithResolvers: Promise.withResolvers<boolean>(),
    })

    const onOpenChange = (open: boolean) => {
        setState({ ...state, isOpen: open })
    }

    const onDataChange = (data: Partial<IFormAlertDialogContext>) => {
        setState({
            ...state,
            ...data,
        })
    }

    return (
        <FormAlertDialogContext.Provider
            value={{
                ...state,
                onOpenChange,
                onDataChange,
                ...options,
            }}
        >
            <FormAlertDialogComponent />
            {children}
        </FormAlertDialogContext.Provider>
    )
}
