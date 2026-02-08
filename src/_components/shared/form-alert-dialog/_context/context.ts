'use client'

import { createContext } from 'react'

export interface IFormAlertDialogContext {
    // State
    isOpen: boolean
    // Actions
    onOpenChange: (open: boolean) => void
    onDataChange: (data: Partial<IFormAlertDialogContext>) => void
    // Type
    type: 'alert' | 'confirm'
    // Data
    title: string
    description: string
    actionText?: string
    cancelText?: string
    actionButtonVariant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'link'
        | 'ghost'
        | null
    cancelButtonVariant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'link'
        | 'ghost'
        | null
    icon?: React.ReactNode
    promiseWithResolvers?: PromiseWithResolvers<boolean>
}

export type IFormAlertDialogOptions = Omit<
    IFormAlertDialogContext,
    'isOpen' | 'onOpenChange' | 'onDataChange' | 'type'
>

export const FormAlertDialogContext = createContext<IFormAlertDialogContext>({
    isOpen: false,
    onOpenChange: () => {},
    onDataChange: () => {},
    type: 'alert',
    title: '',
    description: '',
})
